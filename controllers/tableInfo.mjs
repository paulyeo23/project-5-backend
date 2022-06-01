export default function initTableInfoController(db) {
  const tableInfo = { tableInfo: db.TableInfo.findAll() };

  const Info = async () => {
    const info = {
      table: await db.Tables.findAll(),
    };
    return info;
  };

  const index = async (request, response) => {
    try {
      Info().then((result) => response.send(result.table));
    } catch (error) {
      console.log(error);
    }
  };

  return {
    index,
  };
}
