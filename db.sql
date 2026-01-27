CREATE DATABASE IF NOT EXISTS calculo_semanal;
USE calculo_semanal;

CREATE TABLE calculo_semanal (
    id INT AUTO_INCREMENT PRIMARY KEY,
    capital DECIMAL(10,2) NOT NULL,
    vino DECIMAL(10,2) NOT NULL,
    naranja DECIMAL(10,2) NOT NULL,
    azucar DECIMAL(10,2) NOT NULL,
    pina DECIMAL(10,2) NOT NULL,
    botella DECIMAL(10,2) NOT NULL,
    total_insumos DECIMAL(10,2) NOT NULL,
    ganancia DECIMAL(10,2) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);