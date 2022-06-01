export default function initPokerLobbyController(db) {
  const Info = async (request) => {
    const info = {
      table: await db.Tables.findAll({
        where: { id: request.tableid },
      }),
      tableInfo: await db.TableInfo.findAll({
        where: { roundid: request.roundid },
      }),
      roundId: request.roundid,
      allPlayersInRound: await db.TablePlayer.findAll({
        where: { roundid: request.roundid },
      }),
      deck: await db.Deck.findAll({
        where: { roundid: request.roundid },
      }),
      communityCard: await db.CommunityCards.findAll({
        where: { roundid: request.roundid },
      }),
      users: await db.Users.findAll(),
    };
    return info;
  };

  const createTable = async (request, response) => {
    try {
    } catch (error) {
      console.log(error);
    }
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
