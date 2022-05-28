export default function initTableInfoController(db) {
const tableInfo = {tableInfo:db.TableInfo.findAll()}

  function changePosition(position,maxSeat) {
    position = (position + 1) % maxSeat

    return position
  }
  const index = async (request, response) => {
    try {
      const tableInfo = await db.TableInfo.findAll();
      response.send({ tableInfo });
    } catch (error) {
      console.log(error);
    }
  };

  const check = async (request, response) => {
    try {
      const info = tableInfo()
      if (info.tableInfo.length>0) {
        tableInfo
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    index,
  };
}
