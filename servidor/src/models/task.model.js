import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { UserModel } from "./user.model.js";

export const TaskModel = sequelize.define(
  "task",
  {
    title: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
      field: "title"
    },
    description: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "description"
    },
    is_completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "is_completed"
    },
  },
  {
    underscored: true,
    // timestamps: false,
    // createdAt: "created_at",
  }
);

// RELACIONES UNO A MUCHOS
TaskModel.belongsTo(UserModel, {
  foreignKey: "user_id",
  as: "author",
  onDelete: "CASCADE",
});

UserModel.hasMany(TaskModel, { foreignKey: "user_id", as: "tasks" });
