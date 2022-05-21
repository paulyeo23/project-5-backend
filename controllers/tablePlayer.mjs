export default function initTablePlayerController(db) {
  const index = async (request, response) => {
    try {
      const tablePlayer = await db.TablePlayer.findAll();
      response.send({ tablePlayer });
    } catch (error) {
      console.log(error);
    }
  };

  return {
    index,
  };
}
