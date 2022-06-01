import { resolve } from "path";
import db from "./models/index.mjs";

// import initItemsController from './controllers/items.mjs';
// import initOrdersController from './controllers/orders.mjs';

import initTableInfoController from "./controllers/tableInfo.mjs";
import initUsersController from "./controllers/users.mjs";
import initPokerMechanicsController from "./controllers/pokermechanics.mjs";

export default function routes(app) {
  // const OrdersController = initOrdersController(db);
  // app.post('/orders', OrdersController.create);
  // app.get('/orders', OrdersController.index);

  // const ItemsController = initItemsController(db);
  // app.get('/items', ItemsController.index);

  const TableInfoController = initTableInfoController(db);
  app.get("/gettableinfo", TableInfoController.index);

  const PokerMechanicsController = initPokerMechanicsController(db);
  app.get(
    "/tableinfo/check/:roundid/:tableid/:userid",
    PokerMechanicsController.checkplayer,
  );
  app.get(
    "/tableinfo/raise/:roundid/:tableid/:userid/:raisevalue",
    PokerMechanicsController.raiseplayer,
  );

  app.get(
    "/tableinfo/call/:roundid/:tableid/:userid/",
    PokerMechanicsController.callplayer,
  );

  app.get(
    "/tableinfo/fold/:roundid/:tableid/:userid/",
    PokerMechanicsController.foldplayer,
  );

  app.get(
    "/tableinfo/index/:roundid/:tableid/:userid/",
    PokerMechanicsController.index,
  );

  app.get("/tableinfo/call/", PokerMechanicsController.index);

  const UsersController = initUsersController(db);
  app.get("/users", UsersController.index);
  app.post("/login", UsersController.login);
  app.post("/register", UsersController.register);
  // function (request, response) {
  // let data = request.body;
  // let username = data.username;
  // let password = data.password;
  // console.log(username, password);
  // });

  // special JS page. Include the webpack index.html file
  // app.get('/home', (request, response) => {
  //   response.sendFile(resolve('dist', 'main.html'));
  // });
}
