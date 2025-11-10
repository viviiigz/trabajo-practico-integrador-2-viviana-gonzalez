import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { PersonModel } from "./person.model.js";

export const UserModel = sequelize.define(
  "user",
  {
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "username"
    },
    email: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
      field: "email"
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "password"
    },
  },
  {
    underscored: true,
    // paranoid: true,
  }
);

// RELACIONES UNO A UNO
UserModel.belongsTo(PersonModel, {
  foreignKey: "person_id",
  as: "person",
  onDelete: "CASCADE",
});

PersonModel.hasOne(UserModel, { foreignKey: "person_id", as: "user" });

PersonModel.addHook("afterDestroy", async (person) => {
  const user = await UserModel.findOne({
    where: { person_id: person.dataValues.id },
  });
  if (user) {
    await user.destroy();
  }
});
