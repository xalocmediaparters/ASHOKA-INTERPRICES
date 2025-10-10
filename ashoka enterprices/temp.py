import sqlite3

connect = sqlite3.connect("bank.db")

cursor = connect.cursor()

cursor.execute("CREATE TABLE Account (name VARCHAR(50) NOT NULL, phone VARCHAR(10) UNIQUE CHECK (LENGTH(phone) = 10), email VARCHAR(256) UNIQUE NOT NULL, DOB DATE NOT NULL, IFSC VARCHAR(11) NOT NULL, acc_type VARCHAR(15) NOT NULL, gender VARCHAR(6) NOT NULL, balance DEFAULT 1000, pin VARCHAR(64) NULL);")

connect.commit()

connect.close()
