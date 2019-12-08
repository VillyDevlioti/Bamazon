DROP DATABASE IF EXISTS bamazon;

/* Create database */
CREATE DATABASE bamazon;
USE bamazon;

/* Create new table with a primary key that auto-increments, and a text field */
CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(200) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price decimal (6,2) not null,
  stock_quantity INTEGER (10) not null,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES 
("Side Table Modern Nightstand Round","Furniture",39.99,58),
("Cuisinart CFO-3SS Electric Fondue Maker","Kitchen",37.99,12),
("Ceramic Space Heater1000W Electric Portable","Home",36.99,23),
("Canon Color imageCLASS LBP622Cdw","Office Products",149.99,52),
("Homework","CDs & Vinyl",27.50,8),
("Robot LED Neon Sign Lights","Lighting",79.99,13),
("LEEPES Large Natural Woven Seagrass Tote Belly Basket","Garden",16.99,122),
("VEHHE Metal Straws 10.5 Drinking Straws","Kitchen",7.99,97),
("NICETOWN 100% Blackout Window Curtain Panels","Home",42.45,12),
("Paws & Pals Airline Approved Pet Carrier","Pet Supplies",14.98,22);