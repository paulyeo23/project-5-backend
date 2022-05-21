export default function initTablesController(db) {
  const index = async (request, response) => {
    try {
      const tables = await db.Tables.findAll();
      response.send({ tables });
    } catch (error) {
      console.log(error);
    }
  };

  return {
    index,
  };
}
