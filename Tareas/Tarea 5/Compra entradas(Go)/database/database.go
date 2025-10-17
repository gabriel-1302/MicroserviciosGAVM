package database

import (
	"fmt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	// Asegúrate de que la base de datos 'compras_db' exista en tu MySQL (XAMPP)
	dsn := "root:@tcp(127.0.0.1:3306)/compras_db?charset=utf8mb4&parseTime=True&loc=Local"
	database, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})

	if err != nil {
		panic("Failed to connect to database!")
	}

	fmt.Println("Database connection successful.")
	DB = database
}
