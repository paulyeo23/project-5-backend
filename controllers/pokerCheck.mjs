export default function initPokerCheck(db) {
  function changePosition(position) {
    while (true) {
      let newPosition = (position + 1) % maxSeat;
      let nextPlayer = info.allPlayersInRound.filter((player) => {
        return player.tablePosition == newPosition;
      });
      if (nextPlayer.folded == false) {
        break;
      }
    }
    return newPosition;
    //socket emit
  }

  const checkplayer = async (request, response) => {
    try {
      console.log(request.params);
      const info = [
        {
          table: await db.Tables.findAll({
            where: { id: request.params.tableid },
          }),
          tableInfo: await db.TableInfo.findAll({
            where: { roundId: request.params.roundid },
          }),
          roundId: request.params.roundid,
          currentPlayer: await db.TablePlayer.findAll({
            where: { userId: request.params.userid },
          }),
          allPlayersInRound: await db.TablePlayer.findAll({
            where: { roundId: request.params.roundid },
          }),
          deck: await db.Deck.findAll({
            where: { roundId: request.params.roundid },
          }),
        },
      ];

      Promise.all(info).then(function (results) {
        const info = results[0];

        const currentPlayer = info.allPlayersInRound.filter((player) => {
          return player.userid == request.params.userid;
        })[0];
        if (currentPlayer.tableposition != info.tableInfo[0].currentPosition) {
          console.log("False");

          return;
        }

        db.TablePlayer.update(
          { check: true },
          {
            where: {
              roundId: request.params.roundid,
              userId: request.params.userid,
            },
          },
        );
      });

      //socket emit
    } catch (error) {
      console.log(error);
    }
  };
  return { checkplayer };
}
