-- check NOT NULL/Total Participation
-- check keys for the normalized relations
-- change attribute names  

DROP TABLE FERTILIZER cascade constraints;
DROP TABLE FLOWER cascade constraints;
DROP TABLE GARDEN cascade constraints;
DROP TABLE HARVEST cascade constraints;
DROP TABLE HERB cascade constraints;
DROP TABLE HOUSEPEOPLE cascade constraints;
DROP TABLE PESTR1 cascade constraints;
DROP TABLE PESTR3 cascade constraints;
DROP TABLE PESTR4 cascade constraints;
DROP TABLE PLANTFERTILIZED cascade constraints;
DROP TABLE PLANTS cascade constraints;
DROP TABLE TOOLSR1 cascade constraints;
DROP TABLE TOOLSR3 cascade constraints;
DROP TABLE TOOLSR4 cascade constraints;
DROP TABLE SUPPLY cascade constraints;
DROP TABLE VEGETABLE cascade constraints;
DROP TABLE WATERINGR1 cascade constraints;
DROP TABLE WATERINGR2 cascade constraints;
DROP TABLE WORKSON cascade constraints;
                                                                      
CREATE TABLE HousePeople (
    username VARCHAR(20),
    pass VARCHAR(20) NOT NULL,
    fullName VARCHAR(20) NOT NULL,
    gender VARCHAR(8),
    gardenRole VARCHAR(20) NOT NULL,
    yearsOfExp INT,
    PRIMARY KEY(username)
);


CREATE TABLE Garden (
    gardenName VARCHAR(20),
    loc VARCHAR(20) NOT NULL,
    soilType VARCHAR(20) NOT NULL,
    gardenSize INT NOT NULL,
    PRIMARY KEY (gardenName, loc)
);

CREATE TABLE WorksOn (
    username VARCHAR(20),
    gardenName VARCHAR(20),
    loc VARCHAR(20),
    PRIMARY KEY (username, gardenName, loc),
    FOREIGN KEY (username) REFERENCES HousePeople(username) ON DELETE CASCADE,
    FOREIGN KEY (gardenName, loc) REFERENCES Garden(gardenName, loc) ON DELETE CASCADE
);

CREATE TABLE Plants (
    plantId INT,
    plantName VARCHAR(20) NOT NULL,
    wateringSchedule VARCHAR(8) NOT NULL,
    species VARCHAR(20),
    gardenName VARCHAR(20) NOT NULL,
    loc VARCHAR(20) NOT NULL,
    PRIMARY KEY (plantId),
    FOREIGN KEY (gardenName, loc) REFERENCES Garden(gardenName, loc) ON DELETE CASCADE
);

CREATE TABLE Flower (
    plantId INT,
    color VARCHAR(20) NOT NULL,
    typeOfPlant VARCHAR(20) NOT NULL,
    PRIMARY KEY (plantId),
    FOREIGN KEY (plantId) REFERENCES Plants(plantId) ON DELETE CASCADE
);

CREATE TABLE Vegetable (
    plantId INT,
    vitaminType CHAR(1) NOT NULL,
    PRIMARY KEY (plantId),
    FOREIGN KEY (plantId) REFERENCES Plants(plantId) ON DELETE CASCADE
);

CREATE TABLE Herb (
    plantId INT,
    medicalUse VARCHAR(20) NOT NULL,
    PRIMARY KEY (plantId),
    FOREIGN KEY (plantId) REFERENCES Plants(plantId) ON DELETE CASCADE
);

---------------- TOOLS -----------------
CREATE TABLE ToolsR1 (
    purchaseDate DATE,
    material VARCHAR(20),
    condition VARCHAR(20) NOT NULL,
    PRIMARY KEY (purchaseDate, material) 
);

CREATE TABLE ToolsR3 (
    toolName VARCHAR(20),
    material VARCHAR(20) NOT NULL,
    PRIMARY KEY (toolName)  
);

CREATE TABLE ToolsR4 (
    serialNumber INT,
    toolName VARCHAR(20) NOT NULL,
    purchaseDate DATE NOT NULL,
    username VARCHAR(20),
    PRIMARY KEY (serialNumber),
    FOREIGN KEY (toolName) REFERENCES ToolsR3(toolName) ON DELETE CASCADE,
    FOREIGN KEY (username) REFERENCES HousePeople(username) ON DELETE CASCADE
);
----------------------------------------------------
CREATE TABLE Supply (
    plantId INT,
    serialNumber INT,
    PRIMARY KEY (plantId, serialNumber),
    FOREIGN KEY (plantId) REFERENCES Plants(plantId) ON DELETE CASCADE,
    FOREIGN KEY (serialNumber) REFERENCES ToolsR4(serialNumber) ON DELETE CASCADE
);
-------------------- WATERING ---------------------
CREATE TABLE WateringR1 (
    wateringDate DATE,
    temperature FLOAT,
    pH FLOAT,
    amount INT NOT NULL,
    PRIMARY KEY (wateringDate, temperature, pH)
);

CREATE TABLE WateringR2 (
    wateringId INT,
    wateringDate DATE NOT NULL,
    temperature FLOAT NOT NULL,
    pH FLOAT NOT NULL,
    plantId INT NOT NULL,
    PRIMARY KEY (wateringId),
    FOREIGN KEY (wateringDate, temperature, pH) REFERENCES WateringR1(wateringDate, temperature, pH) ON DELETE CASCADE,
    FOREIGN KEY (plantId) REFERENCES Plants(plantId) ON DELETE CASCADE
);
----------------------------------------------------

CREATE TABLE Fertilizer (
    fertilizerName VARCHAR(20),
    manufacturer VARCHAR(20),
    fertilizerType VARCHAR(20) NOT NULL,
    price INT NOT NULL,
    PRIMARY KEY (fertilizerName, manufacturer)
);

CREATE TABLE PlantFertilized (
    fertilizerName VARCHAR(20),
    manufacturer VARCHAR(20),
    plantId INT,
    qty INT NOT NULL,
    applicationDate DATE NOT NULL,
    PRIMARY KEY (fertilizerName, manufacturer, plantId),
    FOREIGN KEY (fertilizerName, manufacturer) REFERENCES Fertilizer(fertilizerName, manufacturer) ON DELETE CASCADE,
    FOREIGN KEY (plantId) REFERENCES Plants(plantId) ON DELETE CASCADE
);

-------------------- PESTS ---------------------
CREATE TABLE PestR1 (
    pestType VARCHAR(20),
    controlMethod VARCHAR(50),
    PRIMARY KEY (pestType) 
);

CREATE TABLE PestR3 (
    pestName VARCHAR(20),
    pestType VARCHAR(20) NOT NULL,
    PRIMARY KEY (pestName),
    FOREIGN KEY (pestType) REFERENCES PestR1(pestType) ON DELETE CASCADE
);

CREATE TABLE PestR4 (
    pestId INT,
    plantId INT NOT NULL,
    pestName VARCHAR(20) NOT NULL,
    PRIMARY KEY (pestId),
    FOREIGN KEY (plantId) REFERENCES Plants(plantId) ON DELETE CASCADE,
    FOREIGN KEY (pestName) REFERENCES PestR3(pestName) ON DELETE CASCADE
);
----------------------------------------------------

CREATE TABLE Harvest (
    harvestId INT,
    plantId INT,
    qty INT,
    harvestDate DATE,
    PRIMARY KEY (harvestId, plantId),
    FOREIGN KEY (plantId) REFERENCES Plants(plantId) ON DELETE CASCADE
);

-- HousePeople
INSERT INTO HousePeople VALUES ('user1', 'password1', 'Alice', 'F', 'Grandma', 5);
INSERT INTO HousePeople VALUES ('user2', 'password2', 'Bob', 'M', 'Grandpa', 3);
INSERT INTO HousePeople VALUES ('user3', 'password3', 'Charlie', 'M', 'Father', 2);
INSERT INTO HousePeople VALUES ('user4', 'password4', 'Diana', 'F', 'Mother', 4);
INSERT INTO HousePeople VALUES ('user5', 'password5', 'Eve', 'F', 'Daughter', 1);
INSERT INTO HousePeople VALUES ('user6', 'password6', 'Trevor', 'M', 'Son', 10);

-- Garden
INSERT INTO Garden VALUES ('Rose Garden', 'Southeast', 'Loamy', 100);
INSERT INTO Garden VALUES ('Vegetable Garden', 'Southwest', 'Sandy', 150);
INSERT INTO Garden VALUES ('Herb Garden', 'Northwest', 'Clay', 200);
INSERT INTO Garden VALUES ('Flower Garden', 'Northeast', 'Silty', 250);
INSERT INTO Garden VALUES ('Tropical Garden', 'Center', 'Peaty', 300);
INSERT INTO Garden Values ('Tree Garden', 'East', 'Silty', 500);

-- WorksOn
INSERT INTO WorksOn VALUES ('user1', 'Rose Garden', 'Southeast');
INSERT INTO WorksOn VALUES ('user2', 'Vegetable Garden', 'Southwest');
INSERT INTO WorksOn VALUES ('user3', 'Herb Garden', 'Northwest');
INSERT INTO WorksOn VALUES ('user4', 'Flower Garden', 'Northeast');
INSERT INTO WorksOn VALUES ('user5', 'Tropical Garden', 'Center');
INSERT INTO WorksOn VALUES ('user6', 'Tree Garden', 'East');

-- Plants (17 entries)
INSERT INTO Plants VALUES (1, 'Rose', 'Daily', 'Rosa', 'Rose Garden', 'Southeast');
INSERT INTO Plants VALUES (2, 'Tomato', 'Weekly', 'Solanum', 'Vegetable Garden', 'Southwest');
INSERT INTO Plants VALUES (3, 'Basil', 'Monthly', 'Ocimum', 'Herb Garden', 'Northwest');
INSERT INTO Plants VALUES (4, 'Tulip', 'Daily', 'Tulipa', 'Flower Garden', 'Northeast');
INSERT INTO Plants VALUES (5, 'Mango', 'Weekly', 'Mangifera', 'Tropical Garden', 'Center');
INSERT INTO Plants VALUES (6, 'Daisy', 'Daily', 'Bellis', 'Flower Garden', 'Northeast');
INSERT INTO Plants VALUES (7, 'Cucumber', 'Weekly', 'Cucumis', 'Vegetable Garden', 'Southwest');
INSERT INTO Plants VALUES (8, 'Rosemary', 'Monthly', 'Rosmarinus', 'Herb Garden', 'Northwest');
INSERT INTO Plants VALUES (9, 'Lily', 'Daily', 'Lilium', 'Flower Garden', 'Northeast');
INSERT INTO Plants VALUES (10, 'Peach', 'Weekly', 'Prunus', 'Tropical Garden', 'Center');
INSERT INTO Plants VALUES (11, 'Sunflower', 'Daily', 'Helianthus', 'Flower Garden', 'Northeast');
INSERT INTO Plants VALUES (12, 'Carrot', 'Weekly', 'Daucus', 'Vegetable Garden', 'Southwest');
INSERT INTO Plants VALUES (13, 'Thyme', 'Monthly', 'Thymus', 'Herb Garden', 'Northwest');
INSERT INTO Plants VALUES (14, 'Orchid', 'Daily', 'Orchidaceae', 'Flower Garden', 'Northeast');
INSERT INTO Plants VALUES (15, 'Papaya', 'Weekly', 'Carica', 'Tropical Garden', 'Center');
INSERT INTO Plants VALUES (16, 'Ostrich Fern', 'Daily', 'Polypodiophyta', 'Tree Garden', 'Center');
INSERT INTO Plants VALUES (17, 'Oak', 'Monthly', 'Quercus', 'Tree Garden', 'Northwest');

-- Flower (5 entries)
INSERT INTO Flower VALUES (1, 'Red', 'Rose');
INSERT INTO Flower VALUES (4, 'Yellow', 'Tulip');
INSERT INTO Flower VALUES (6, 'White', 'Daisy');
INSERT INTO Flower VALUES (9, 'Pink', 'Lily');
INSERT INTO Flower VALUES (11, 'Yellow', 'Sunflower');

-- Vegetable (5 entries)
INSERT INTO Vegetable VALUES (2, 'A');
INSERT INTO Vegetable VALUES (7, 'B');
INSERT INTO Vegetable VALUES (12, 'C');
INSERT INTO Vegetable VALUES (3, 'D');
INSERT INTO Vegetable VALUES (13, 'E');

-- Herb (6 entries)
INSERT INTO Herb VALUES (3, 'Medicinal');
INSERT INTO Herb VALUES (8, 'Culinary');
INSERT INTO Herb VALUES (13, 'Aromatic');
INSERT INTO Herb VALUES (15, 'Medicinal');
INSERT INTO Herb VALUES (10, 'Medicinal');
INSERT INTO Herb VALUES (11, 'Aromatic');


-- Tools
INSERT INTO ToolsR1 VALUES (DATE '2020-01-01', 'Metal', 'New');
INSERT INTO ToolsR1 VALUES (DATE '2021-06-15', 'Plastic', 'Used');
INSERT INTO ToolsR1 VALUES (DATE '2022-08-20', 'Wood', 'Good');
INSERT INTO ToolsR1 VALUES (DATE '2020-12-05', 'Iron', 'Worn');
INSERT INTO ToolsR1 VALUES (DATE '2019-11-12', 'Steel', 'Excellent');

INSERT INTO ToolsR3 VALUES ('Shovel', 'Metal');
INSERT INTO ToolsR3 VALUES ('Watering Can', 'Plastic');
INSERT INTO ToolsR3 VALUES ('Hoe', 'Wood');
INSERT INTO ToolsR3 VALUES ('Rake', 'Iron');
INSERT INTO ToolsR3 VALUES ('Pruning Shears', 'Steel');

INSERT INTO ToolsR4 VALUES (1, 'Shovel', DATE '2020-01-01', 'user1');
INSERT INTO ToolsR4 VALUES (2, 'Watering Can', DATE '2021-06-15', 'user2');
INSERT INTO ToolsR4 VALUES (3, 'Hoe', DATE '2022-08-20', 'user3');
INSERT INTO ToolsR4 VALUES (4, 'Rake', DATE '2020-12-05', 'user4');
INSERT INTO ToolsR4 VALUES (5, 'Pruning Shears', DATE '2019-11-12', 'user5');

-- Supply (relation between Tools and Plants)
INSERT INTO Supply VALUES (1, 1);
INSERT INTO Supply VALUES (2, 2);
INSERT INTO Supply VALUES (3, 3);
INSERT INTO Supply VALUES (4, 4);
INSERT INTO Supply VALUES (5, 5);

-- Watering
INSERT INTO WateringR1 VALUES (DATE '2023-04-01', 20.5, 6.5, 500);
INSERT INTO WateringR1 VALUES (DATE '2023-05-01', 18.0, 6.8, 300);
INSERT INTO WateringR1 VALUES (DATE '2023-06-01', 21.0, 7.0, 400);
INSERT INTO WateringR1 VALUES (DATE '2023-07-01', 19.5, 6.7, 350);
INSERT INTO WateringR1 VALUES (DATE '2023-08-01', 22.0, 6.9, 450);

INSERT INTO WateringR2 VALUES (1, DATE '2023-04-01', 20.5, 6.5, 1);
INSERT INTO WateringR2 VALUES (2, DATE '2023-05-01', 18.0, 6.8, 2);
INSERT INTO WateringR2 VALUES (3, DATE '2023-06-01', 21.0, 7.0, 3);
INSERT INTO WateringR2 VALUES (4, DATE '2023-07-01', 19.5, 6.7, 4);
INSERT INTO WateringR2 VALUES (5, DATE '2023-08-01', 22.0, 6.9, 5);

-- Fertilizer
INSERT INTO Fertilizer VALUES ('Compost', 'GreenGrow', 'Organic', 20);
INSERT INTO Fertilizer VALUES ('Nitrogen', 'FarmBest', 'Synthetic', 15);
INSERT INTO Fertilizer VALUES ('Phosphate', 'PlantMagic', 'Chemical', 25);
INSERT INTO Fertilizer VALUES ('Potassium', 'GrowthMax', 'Natural', 30);
INSERT INTO Fertilizer VALUES ('Ammonium', 'BioBoost', 'Organic', 18);

INSERT INTO PlantFertilized VALUES ('Compost', 'GreenGrow', 1, 2, DATE '2023-04-15');
INSERT INTO PlantFertilized VALUES ('Nitrogen', 'FarmBest', 2, 3, DATE '2023-05-20');
INSERT INTO PlantFertilized VALUES ('Phosphate', 'PlantMagic', 3, 4, DATE '2023-06-25');
INSERT INTO PlantFertilized VALUES ('Potassium', 'GrowthMax', 4, 1, DATE '2023-07-30');
INSERT INTO PlantFertilized VALUES ('Ammonium', 'BioBoost', 5, 2, DATE '2023-08-10');

-- Pest
INSERT INTO PestR1 VALUES ('Caterpillars', 'BT');
INSERT INTO PestR1 VALUES ('Aphids', 'Neem Oil');
INSERT INTO PestR1 VALUES ('Whiteflies', 'Insecticidal Soap');
INSERT INTO PestR1 VALUES ('Mites', 'Miticide');
INSERT INTO PestR1 VALUES ('Beetles', 'Pyrethrin');

INSERT INTO PestR3 VALUES ('Cabbage Worm', 'Caterpillars');
INSERT INTO PestR3 VALUES ('Greenfly', 'Aphids');
INSERT INTO PestR3 VALUES ('Greenhouse Whitefly', 'Whiteflies');
INSERT INTO PestR3 VALUES ('Spider Mite', 'Mites');
INSERT INTO PestR3 VALUES ('Cucumber Beetle', 'Beetles');

INSERT INTO PestR4 VALUES (1, 2, 'Cabbage Worm');
INSERT INTO PestR4 VALUES (2, 2, 'Greenfly');
INSERT INTO PestR4 VALUES (3, 3, 'Greenhouse Whitefly');
INSERT INTO PestR4 VALUES (4, 4, 'Spider Mite');
INSERT INTO PestR4 VALUES (5, 5, 'Cucumber Beetle');

-- Harvest
INSERT INTO Harvest VALUES (1, 2, 10, DATE '2023-06-01');
INSERT INTO Harvest VALUES (2, 3, 5, DATE '2023-07-01');
INSERT INTO Harvest VALUES (3, 1, 7, DATE '2023-08-01');
INSERT INTO Harvest VALUES (4, 4, 8, DATE '2023-09-01');
INSERT INTO Harvest VALUES (5, 5, 12, DATE '2023-10-01');
INSERT INTO Harvest VALUES (6, 5, 10, DATE '2024-05-01');