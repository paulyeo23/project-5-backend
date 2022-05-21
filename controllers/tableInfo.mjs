export default function initTableInfoController(db) {
  const index = async (request, response) => {
    try {
      const tableInfo = await db.TableInfo.findAll();
      response.send({ tableInfo });
    } catch (error) {
      console.log(error);
    }
  };

  return {
    index,
  };
}
