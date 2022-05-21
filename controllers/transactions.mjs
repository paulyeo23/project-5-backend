export default function initTransactionsController(db) {
  const index = async (request, response) => {
    try {
      const transactions = await db.Transactions.findAll();
      response.send({ transactions });
    } catch (error) {
      console.log(error);
    }
  };

  return {
    index,
  };
}
