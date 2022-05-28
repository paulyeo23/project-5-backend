export default function initUsersController(db) {
  const index = async (request, response) => {
    try {
      const users = await db.Users.findAll();
      response.send({ users });
    } catch (error) {
      console.log(error);
    }
  };

  const register = async (request, response) => {
    try {
      let data = request.body;
      let username = data.username;
      let password = data.password;
      const users = await db.Users.findAll({
        where: {
          username: username,
          password: password,
        },
      });
      if (users.length == 0) {
        const user = await db.Users.create({
          username: username,
          password: password,
          accountValue: 100,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const login = async (request, response) => {
    try {
      let data = request.body;
      let username = data.username;
      let password = data.password;
      const users = await db.Users.findAll({
        where: {
          username: username,
          password: password,
        },
      });
      response.send({ users });
    } catch (error) {
      console.log(error);
    }
  };

  return {
    index,
    register,
    login,
  };
}
