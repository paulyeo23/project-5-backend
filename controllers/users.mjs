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
      const order = await db.Order.create({
        total: request.body.total,
      });

      const { users } = request.body;

      const userQueries = [];
      for (let i = 0; i < users.length; i += 1) {
        const users = {
          username: users.username,
          password: users.password,
          accountValue: 100,
        };

        userQueries.push(db.Users.create(users));
      }

      const userResults = await Promise.all(userQueries);

      response.send({ orderItems: userResults, order });
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
