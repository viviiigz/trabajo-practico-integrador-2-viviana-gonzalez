import { sequelize } from '../src/config/database.js';
import { PersonModel } from '../src/models/person.model.js';
import { UserModel } from '../src/models/user.model.js';
import { RoleModel } from '../src/models/role.model.js';
import { UserRoleModel } from '../src/models/user_role.model.js';
import { TaskModel } from '../src/models/task.model.js';
import { faker } from '@faker-js/faker';

async function seed() {
  try {
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
  await sequelize.sync({ force: true });
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('Tablas eliminadas y recreadas.');

    const roles = ['admin', 'user'];
    const roleInstances = [];
    for (const role of roles) {
      roleInstances.push(await RoleModel.create({ rolename: role }));
    }
    console.log('Roles creados.');

    // Usuarios fijos para cada rol
    const fixedUsers = [
      {
        name: "Admin",
        lastname: "Root",
        username: "admin",
        email: "admin@example.com",
        password: "admin123",
        role: "admin"
      },
      {
        name: "Usuario",
        lastname: "Normal",
        username: "user",
        email: "user@example.com",
        password: "user123",
        role: "user"
      }
    ];
    for (const fixedUser of fixedUsers) {
      const person = await PersonModel.create({ name: fixedUser.name, lastname: fixedUser.lastname });
      const user = await UserModel.create({
        username: fixedUser.username,
        email: fixedUser.email,
        password: fixedUser.password,
        person_id: person.id,
      });
      const roleInstance = roleInstances.find(r => r.rolename === fixedUser.role);
      await UserRoleModel.create({ user_id: user.id, role_id: roleInstance.id });
      // Crear tareas de ejemplo para cada usuario fijo
      for (let j = 0; j < 2; j++) {
        await TaskModel.create({
          title: `${fixedUser.role} task ${j+1}`,
          description: `Tarea de ejemplo para ${fixedUser.role}`,
          is_completed: false,
          user_id: user.id,
        });
      }
    }
  } catch (error) {
    console.error('Error al poblar la base de datos:', error);
  } finally {
    await sequelize.close();
    process.exit();
  }
}

seed();
