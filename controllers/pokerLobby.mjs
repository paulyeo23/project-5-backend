export default function initPokerLobbyController(db) {
  const Info = async (request) => {
    const info = {
      table: await db.Tables.findAll(),
      tableInfo: await db.TableInfo.findAll(),
      allTablePlayers: await db.TablePlayer.findAll(),
      deck: await db.Deck.findAll(),
      communityCards: await db.CommunityCards.findAll(),
      users: await db.Users.findAll(),
      hands: await db.PlayerHand.findAll(),
    };
    return info;
  };

  const info2 = async (request) => {
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
      communityCards: await db.CommunityCards.findAll({
        where: { roundid: request.roundid },
      }),
      users: await db.Users.findAll(),
      hands: await db.PlayerHand.findAll(),
    };
    return info;
  };

  function roundStart(info) {
    function player(position) {
      return info.allPlayersInRound.filter((player) => {
        return player.tablePosition == position;
      })[0];
    }
    info.tableInfo[0].currentPosition = changePosition(
      info,
      info.tableInfo[0].currentPosition,
    );
    for (let i = 0; i < 2; i++) {
      info.allPlayersInRound.forEach((x) => {
        const currentplayerid = player(
          info.tableInfo[0].currentPosition,
        ).userid;
        dealCard(info, currentplayerid, info.deck[0].deckPosition);
        info.deck[0].deckPosition += 1;
        info.tableInfo[0].currentPosition = changePosition(
          info,
          info.tableInfo[0].currentPosition,
        );
      });
    }
    info.tableInfo[0].currentPosition = changePosition(
      info,
      info.tableInfo[0].dealerPosition,
    );

    console.log(
      "player(info.tableInfo[0].currentPosition).userid",
      player(info.tableInfo[0].currentPosition).userid,
    );
    raise(
      info,
      player(info.tableInfo[0].currentPosition).userid,
      info.table[0].blinds,
    );
    info.tableInfo[0].currentPosition = changePosition(
      info,
      info.tableInfo[0].currentPosition,
    );
    console.log(
      "player(info.tableInfo[0].currentPosition).userid",
      info.tableInfo[0].currentPosition,
    );

    raise(
      info,
      player(info.tableInfo[0].currentPosition).userid,
      info.table[0].blinds * 2,
    );
    info.tableInfo[0].currentPosition = changePosition(
      info,
      info.tableInfo[0].currentPosition,
    );
    createNextGame(info);

    db.TableInfo.update(
      {
        currentRaise: info.table[0].blinds * 2,
        previousRaise: info.table[0].blinds,
      },
      { where: { roundid: info.tableInfo[0].roundid } },
    );
  }

  const seatPlayer = async (request, response) => {
    Info().then((results) => {
      const info = results;
      const currentTableInfo = info.table.filter((table) => {
        return table.id == request.params.tableid;
      })[0];
      if (info.allTablePlayers.length == 0) {
        db.TablePlayer.create({
          roundid: request.params.roundid,
          userid: request.params.userid,
          tablePosition: 0,
          stack: 100,
        });
        info2(request.params).then((results) => {
          response.send(results);
        });
      } else if (info.allTablePlayers.length > 0) {
        const allPlayersInRound = info.allTablePlayers.filter((player) => {
          return player.roundid == request.params.roundid;
        });
        console.log(allPlayersInRound);

        for (let i = 0; i < currentTableInfo.maxPlayer; i++) {
          let tableposition = i;
          const playerInPosition = allPlayersInRound.filter((player) => {
            return player.tablePosition == tableposition;
          });
          if (playerInPosition.length == 0) {
            db.TablePlayer.create({
              roundid: request.params.roundid,
              userid: request.params.userid,
              tablePosition: tableposition,
              stack: 100,
            });
            if (allPlayersInRound.length + 1 >= 2) {
              info2(request.params).then((results) => {
                response.send(results);
              });
              break;
            }
            break;
          }
        }
      }
    });
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
    seatPlayer,
  };
}
