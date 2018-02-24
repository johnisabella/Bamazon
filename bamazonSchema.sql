DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(80) NULL,
  department_name VARCHAR(80) NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INTEGER(10) NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("yoga mat", "yoga", 40.99, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("cork block", "yoga", 10.99, 500);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("long strap", "yoga", 15.99, 1000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("bolster", "yoga", 25.99, 75);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("organic dog treats", "pets", 15.99, 1500);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("cute dog sweater", "pets", 28.99, 350);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("dog leash", "pets", 12.99, 800);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("all natural dog food", "pets", 50.99, 1200);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("essential oils candle", "home", 17.99, 425);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("long stem lighter", "home", 7.99, 900);
