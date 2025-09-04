import "reflect-metadata";
import { DataSource } from "typeorm";
import { Agenda } from "./entity/Agenda";
import * as dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "", // Si la contraseña está vacía, se usa una cadena vacía
  database: process.env.DB_NAME || "agenda_db",
  synchronize: true, // ¡CUIDADO! Usar en desarrollo, no en producción
  logging: false,
  entities: [Agenda],
  migrations: [],
  subscribers: [],
  extra: {
    authPlugins: {
      mysql_native_password: () => () => '' // Forzar el uso de contraseña vacía para mysql_native_password
    }
  }
});

