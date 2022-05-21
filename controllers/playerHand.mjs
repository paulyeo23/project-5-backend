export default function initPlayerHandController(db) {
  const index = async (request, response) => {
    try {
      const playerHand = await db.PlayerHand.findAll();
      response.send({ playerHand });
    } catch (error) {
      console.log(error);
    }
  };

  return {
    index,
  };
}
