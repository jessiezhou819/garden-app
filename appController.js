const express = require('express');
const appService = require('./appService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

router.get('/housepeople', async (req, res) => {
    const tableContent = await appService.fetchHousePeopleFromDb();
    res.json({ data: tableContent });
});

router.get('/plant', async (req, res) => {
    const tableContent = await appService.fetchPlantFromDb();
    res.json({ data: tableContent });
});

router.post('/insertHousePerson', async (req, res) => {
    const { username, password, fullName, gender, gardenRole, yearsOfExp } = req.body;
    try {
        await appService.insertHousePersonIntoDb(username, password, fullName, gender, gardenRole, yearsOfExp);
        res.status(200).send('User inserted successfully');
    } catch (err) {
        console.error('Failed to insert user:', err);
        res.status(500).send('Failed to insert user');
    }
});

router.get('/demotable', async (req, res) => {
    const tableContent = await appService.fetchDemotableFromDb();
    res.json({ data: tableContent });
});

router.post("/initiate-demotable", async (req, res) => {
    const initiateResult = await appService.initiateDemotable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-demotable", async (req, res) => {
    const { id, name } = req.body;
    const insertResult = await appService.insertDemotable(id, name);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-name-demotable", async (req, res) => {
    const { oldName, newName } = req.body;
    const updateResult = await appService.updateNameDemotable(oldName, newName);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/delete-demotable", async (req, res) => {
    console.log("request body ", req.body)
    const { id, name } = req.body;
    const deleteResult = await appService.deleteDemotable(id, name);
    if (deleteResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/count-demotable', async (req, res) => {
    const tableCount = await appService.countDemotable();
    if (tableCount >= 0) {
        res.json({
            success: true,
            count: tableCount
        });
    } else {
        res.status(500).json({
            success: false,
            count: tableCount
        });
    }
});


module.exports = router;