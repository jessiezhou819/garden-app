const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};

// initialize connection pool
async function initializeConnectionPool() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

initializeConnectionPool();

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);


// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(); // Gets a connection from the default pool 
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}


// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

async function fetchHousePeopleFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM HousePeople');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchGardenFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Garden');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchWorksOnFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM WorksOn');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function findDivision(username) {
return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT gardenName, loc FROM WorksOn WHERE username=:username`,
            [username],
            { autoCommit: true }
        );
        console.log(result);

        if (result.rows && result.rows.length > 0) {
            return result.rows;
        } else {
            return null;
        }
    }).catch(() => {
        return null;
    });
}

/**
 * DATABASE OPERATIONS RELATED TO WATERING
 */

// For fetching watering entries from R2 and R1
async function fetchWateringFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `select r2.wateringId, r2.pH, r2.temperature, r2.wateringDate, r1.amount, r2.plantId from WateringR2 r2 inner join WateringR1 r1 on r2.wateringDate = r1.wateringDate and r2.temperature = r1.temperature and r2.pH = r1.pH`
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}
// For fetching watering entries from R2
async function fetchWateringR2FromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `select * from WateringR2`
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}
// For fetching watering entries from R1
async function fetchWateringR1FromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `select * from WateringR1`
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}
// Inserting into watering R2 and R1
async function insertWatering(wateringId, pH, temperature, wateringDate, amount, plantId) {
    return await withOracleDB(async (connection) => {
        const checkIfR2Exist = await connection.execute(
            `select * from WateringR2 where wateringId=:wateringId`,
            [wateringId]
        );
        const checkIfR1Exist = await connection.execute(
            `select * from WateringR1 where pH=:pH and temperature=:temperature and wateringDate=TO_DATE(:wateringDate, 'YYYY-MM-DD')`,
            [pH, temperature, wateringDate]
        );
        if (checkIfR2Exist.rows.length == 0 && checkIfR1Exist.rows.length == 0) {
            const insertIntoR1 = await connection.execute(
                `insert into WateringR1 (pH, temperature, wateringDate, amount) values (:pH, :temperature, TO_DATE(:wateringDate, 'YYYY-MM-DD'), :amount)`,
                [pH, temperature, wateringDate, amount],
                { autoCommit: true }
            );
            const insertIntoR2 = await connection.execute(
                `insert into WateringR2 (wateringId, wateringDate, temperature, pH, plantId) values (:wateringId, TO_DATE(:wateringDate, 'YYYY-MM-DD'), :pH, :temperature, :plantId)`,
                [wateringId, wateringDate, temperature, pH, plantId],
                { autoCommit: true }
            );
            
            return insertIntoR2.rowsAffected && insertIntoR1.rowsAffected && insertIntoR2.rowsAffected > 0 && insertIntoR1.rowsAffected > 0;
        } else {
            return false;
        }
    }).catch(() => {
        return false;
    })
} 
// Deleting WateringR1 and cascading it to WateringR2
async function deleteWatering(wateringDate, temperature, pH) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `delete from WateringR1 where wateringDate=TO_DATE(:wateringDate, 'YYYY-MM-DD') and temperature=:temperature and pH=:pH`,
            [wateringDate, temperature, pH],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    })
}
// Update Tuple in WateringR2
async function updateWateringR2(wateringId, wateringDate, temperature, pH, plantId) {
    return await withOracleDB(async (connection) => {
        var result;
        if(wateringDate && temperature && pH) {
            result = await connection.execute(
                `update WateringR2 set pH=:pH, temperature=:temperature, wateringDate=TO_DATE(:wateringDate, 'YYYY-MM-DD') where wateringId=:wateringId`,
                [pH, temperature, wateringDate, wateringId],
                { autoCommit: true }
            );
        }
        if(wateringDate && temperature) {
            result = await connection.execute(
                `update WateringR2 set temperature=:temperature, wateringDate=TO_DATE(:wateringDate, 'YYYY-MM-DD') where wateringId=:wateringId`,
                [temperature, wateringDate, wateringId],
                { autoCommit: true }
            );
        }
        if(temperature && pH) {
            result = await connection.execute(
                `update WateringR2 set pH=:pH, temperature=:temperature where wateringId=:wateringId`,
                [pH, temperature, wateringId],
                { autoCommit: true }
            );
        }
        if(wateringDate && pH) {
            result = await connection.execute(
                `update WateringR2 set pH=:pH, wateringDate=TO_DATE(:wateringDate, 'YYYY-MM-DD') where wateringId=:wateringId`,
                [pH, wateringDate, wateringId],
                { autoCommit: true }
            );
        }
        if(wateringDate) {
            result = await connection.execute(
                `update WateringR2 set wateringDate=TO_DATE(:wateringDate, 'YYYY-MM-DD') where wateringId=:wateringId`,
                [wateringDate, wateringId],
                { autoCommit: true }
            );
        }
        if(temperature) {
            result = await connection.execute(
                `update WateringR2 set temperature=:temperature where wateringId=:wateringId`,
                [temperature, wateringId],
                { autoCommit: true }
            );
        }
        if(pH) {
            result = await connection.execute(
                `update WateringR2 set pH=:pH where wateringId=:wateringId`,
                [pH, wateringId],
                { autoCommit: true }
            );
        }
        if(plantId) {
            result = await connection.execute(
                `update WateringR2 set plantId=:plantId where wateringId=:wateringId`,
                [plantId, wateringId],
                { autoCommit: true }
            );
        }
        if(wateringDate && temperature && pH && plantId) {
            result = await connection.execute(
                `update WateringR2 set plantId=:plantId, pH=:pH, temperature=:temperature, wateringDate=TO_DATE(:wateringDate, 'YYYY-MM-DD') where wateringId=:wateringId`,
                [plantId, pH, temperature, wateringDate, wateringId],
                { autoCommit: true }
            );
        }
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    })
}

/**
 * TEMPLATE RELATED FUNCTIONS
 */
async function fetchDemotableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM DEMOTABLE');
        return result.rows;
    }).catch(() => {
        return null;
    });
}

async function initiateDemotable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE DEMOTABLE`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE DEMOTABLE (
                id NUMBER PRIMARY KEY,
                name VARCHAR2(20)
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function insertDemotable(id, name) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO DEMOTABLE (id, name) VALUES (:id, :name)`,
            [id, name],
            { autoCommit: true }
        );

        console.log(result);
        console.log(result.rowsAffected);
        console.log(result.rowsAffected > 0);
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateNameDemotable(oldName, newName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE DEMOTABLE SET name=:newName where name=:oldName`,
            [newName, oldName],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function deleteDemotable(id, name) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM DEMOTABLE WHERE id=:id AND name=:name`,
            [id, name],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function countDemotable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM DEMOTABLE');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

module.exports = {
    testOracleConnection,
    fetchHousePeopleFromDb,
    fetchGardenFromDb,
    fetchWorksOnFromDb,
    findDivision,
    fetchWateringFromDb,
    fetchWateringR2FromDb,
    fetchWateringR1FromDb,
    insertWatering,
    deleteWatering,
    updateWateringR2,
    fetchDemotableFromDb,
    initiateDemotable, 
    insertDemotable, 
    updateNameDemotable,
    deleteDemotable,
    countDemotable
};