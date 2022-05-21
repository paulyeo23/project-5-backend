export default function initOrdersController(db) {
  const index = async (request, response) => {
    try {
      const orders = await db.Order.findAll();
      response.send({ orders });
    } catch (error) {
      console.log(error);
    }
  };

  const create = async (request, response) => {
    try {
      const order = await db.Order.create({
        total: request.body.total,
      });

      const { items } = request.body;

      const orderItemQueries = [];
      for (let i = 0; i < items.length; i += 1) {
        const item = {
          order_id: order.id,
          item_id: items[i].id,
          quantity: items[i].quantity,
          created_at: new Date(),
          updated_at: new Date(),
        };

        orderItemQueries.push(db.OrderItem.create(item));
      }

      const orderItemResults = await Promise.all(orderItemQueries);

      response.send({ orderItems: orderItemResults, order });
    } catch (error) {
      console.log(error);
    }
  };

  return {
    create,
    index,
  };
}
