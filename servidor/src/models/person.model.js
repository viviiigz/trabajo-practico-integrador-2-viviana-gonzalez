import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const PersonModel = sequelize.define(
  "person",
  {
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "name"
    },
    lastname: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "lastname"
    },
  },
  {
    paranoid: true,
    underscored: true,
    // timestamps: false
  }
);
