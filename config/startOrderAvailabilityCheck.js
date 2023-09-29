const cron = require("node-cron");

const Order = require("../models/orderModel");
const Baker = require("../models/bakerModel");

// Define a cron job to run every, 10 minutes and update bakers availablity
function startOrderAvailabilityCheck() {
  cron.schedule("*/10 * * * *", async () => {
    // Find completed orders
    const completedOrders = await Order.find({
      status: "fulfilled",
      endTime: { $lte: new Date() }, // Orders whose end time is in the past
    });
    if (!completedOrders) {
      return res.status(404).json({ error: "Baker are busy now" });
    }

    // Update the baker's current order to null and clear the end time
    for (const order of completedOrders) {
      const baker = await Baker.findById(order.baker);
      if (baker) {
        baker.currentOrder.order = null;
        baker.currentOrder.endTime = null;
        await baker.save();
      }
    }

    console.log(`Updated ${completedOrders.length} bakers' availability.`);
    // console.error("Error updating baker availability:", err);
  });
}

module.exports = startOrderAvailabilityCheck;
