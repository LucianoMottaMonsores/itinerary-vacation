DROP TABLE IF EXISTS tickets;
DROP TABLE IF EXISTS transport_types;

CREATE TABLE IF NOT EXISTS transport_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transport_type_id INT NOT NULL,
    departure VARCHAR(100) NOT NULL,
    arrival VARCHAR(100) NOT NULL,
    transport_number VARCHAR(50),
    seat VARCHAR(20),
    gate VARCHAR(20),
    luggage_info TEXT,
    additional_info TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_transport_type FOREIGN KEY (transport_type_id) REFERENCES transport_types(id)
);

INSERT INTO transport_types (name) VALUES
('train'),
('tram'),
('flight'),
('bus');

INSERT INTO tickets (transport_type_id, departure, arrival, transport_number, seat, gate, luggage_info, additional_info)
VALUES
-- Step 6: Flight to Paris
(3, 'Bologna Guglielmo Marconi Airport', 'Paris CDG Airport', 'AF1229', '10A', '22', 'Self-check-in luggage at counter', NULL),

-- Step 3: Flight to Venice
(3, 'Innsbruck Airport', 'Venice Airport', 'AA904', '18B', '10', 'Self-check-in luggage at counter', NULL),

-- Step 1: Train from St. Anton to Innsbruck
(1, 'St. Anton am Arlberg Bahnhof', 'Innsbruck Hbf', 'RJX 765', '17C', NULL, NULL, 'Platform 3'),

-- Step 5: Bus to Bologna Airport
(4, 'Bologna San Ruffillo', 'Bologna Guglielmo Marconi Airport', NULL, NULL, NULL, NULL, 'No seat assignment'),

-- Step 2: Tram from Innsbruck Hbf to Airport
(2, 'Innsbruck Hbf', 'Innsbruck Airport', 'S5', NULL, NULL, NULL, NULL),

-- Step 7: Final flight to Chicago
(3, 'Paris CDG Airport', 'Chicago O\'Hare', 'AF136', '10A', '32', 'Luggage will transfer automatically from the last flight', NULL),

-- Step 4: Train from Venice to Bologna
(1, 'Venice Airport', 'Bologna San Ruffillo', 'ICN 35780', '13F', NULL, NULL, 'Platform 1');