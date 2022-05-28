export default function initTableInfoController(db) {
  const tableInfo = { tableInfo: db.TableInfo.findAll() };

  const Info = async (request) => {
    const info = {
      table: await db.Tables.findAll(),
      tableInfo: await db.TableInfo.findAll(),
      allPlayersInRound: await db.TablePlayer.findAll(),
      deck: await db.Deck.findAll(),
      users: await db.Users.findAll(),
    };
    return info;
  };

  const index = async (request, response) => {
    try {
      Info().then((result) => response.send(result));
    } catch (error) {
      console.log(error);
    }
  };

  return {
    index,
  };
}
