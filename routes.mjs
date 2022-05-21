import { resolve } from "path";
import db from "./models/index.mjs";

// import initItemsController from './controllers/items.mjs';
// import initOrdersController from './controllers/orders.mjs';
import initDeckController from "./controllers/deck.mjs";
import initPlayerHandController from "./controllers/playerHand.mjs";
import initTableInfoController from "./controllers/tableInfo.mjs";
import initTablePlayerController from "./controllers/tablePlayer.mjs";
import initTablesController from "./controllers/tables.mjs";
import initTransactionsController from "./controllers/transactions.mjs";
import initUsersController from "./controllers/users.mjs";

export default function routes(app) {
  // const OrdersController = initOrdersController(db);
  // app.post('/orders', OrdersController.create);
  // app.get('/orders', OrdersController.index);

  // const ItemsController = initItemsController(db);
  // app.get('/items', ItemsController.index);

  const DeckController = initDeckController(db);
  app.get("/deck", DeckController.index);

  const PlayerHandController = initPlayerHandController(db);
  app.get("/playerhand", PlayerHandController.index);

  const TableInfoController = initTableInfoController(db);
  app.get("/tableinfo", TableInfoController.index);

  const TablePlayerController = initTablePlayerController(db);
  app.get("/tableplayer", TablePlayerController.index);

  const TablesController = initTablesController(db);
  app.get("/tables", TablesController.index);

  const TransactionsController = initTransactionsController(db);
  app.get("/transactions", TransactionsController.index);

  const UsersController = initUsersController(db);
  app.get("/users", UsersController.index);
  app.post("/login", UsersController.login)
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
