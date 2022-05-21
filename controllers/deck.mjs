export default function initDeckController(db) {
  const index = async (request, response) => {
    try {
      const deck = await db.Deck.findAll();
      response.send({ deck });
    } catch (error) {
      console.log(error);
    }
  };

  return {
    index,
  };
}
