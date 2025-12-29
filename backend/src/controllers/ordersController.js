import { ordersDao } from "../database/dao_exports.js";

class ordersController {
  static async add(req, res) {
    try {
      const { productId, quantity = 1 } = req.body;

      if (!productId) {
        return res.status(400).json({
          status: "error",
          message: "Product ID is required",
        });
      }

      let orderId = req.cookies.orderId;
      let order;

      if (!orderId) {
        const newOrder = await ordersDao.createOrder({
          items: [{ productId, quantity }],
          status: "draft",
        });

        res.cookie("orderId", newOrder._id.toString(), {
          httpOnly: true,
          sameSite: "lax",
        });

        order = await ordersDao.getOrderById(newOrder._id, {
          populateProducts: true,
        });

      } else {
        order = await ordersDao.getOrderById(orderId, {
          populateProducts: true,
        });

        if (order.status === "paid") {
          return res.status(403).json({
            status: "error",
            message: "Paid orders cannot be modified.",
          });
        }

        const item = order.items.find(
          item => item.productId._id.toString() === productId
        );

        if (item) {
          item.quantity += quantity;
        } else {
          order.items.push({ productId, quantity });
        }

        await ordersDao.save(order);
      }

      res.status(201).json({
        status: "success",
        payload: order,
        message: "Product added to order.",
      });

    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  static async getCurrentOrder(req, res) {
    try {
      const orderId = req.cookies.orderId;

      if (!orderId) {
        return res.status(200).json({
          status: "success",
          message: "There is no current active order.",
          payload: null,
        });
      }

      const order = await ordersDao.getOrderById(orderId, {
        populateProducts: true,
      });

      if (!order) {
        return res.status(404).json({
          status: "error",
          message: "Order not found.",
        });
      }

      res.status(200).json({
        status: "success",
        message: "Order delivered.",
        payload: order,
      });

    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  static async removeItem(req, res) {
    try {
      const orderId = req.cookies.orderId;
      const { productId } = req.params;

      if (!orderId) {
        return res.status(404).json({
          status: "error",
          message: "Order not found.",
        });
      }

      if (!productId) {
        return res.status(400).json({
          status: "error",
          message: "Product ID is required",
        });
      }

      const order = await ordersDao.getOrderById(orderId, {
        populateProducts: true,
      });

      if (!order) {
        return res.status(404).json({
          status: "error",
          message: "Order not found.",
        });
      }

      if (order.status === "paid") {
        return res.status(403).json({
          status: "error",
          message: "Paid orders cannot be modified.",
        });
      }

      // Filtrar el item a eliminar
      order.items = order.items.filter(
        item => item.productId._id.toString() !== productId
      );

      if (order.items.length === 0) {
        // Si no quedan productos, eliminar la orden y la cookie
        await ordersDao.deleteOrder(order._id);
        res.clearCookie("orderId");


        return res.status(200).json({
          status: "success",
          message: "Last item removed, order deleted.",
          payload: null,
        });
      }

      // Guardar cambios si aún quedan productos
      await ordersDao.save(order);

      res.status(200).json({
        status: "success",
        message: "Item removed from order.",
        payload: order,
      });

    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  }


  static async clearOrder(req, res) {
    try {
      const orderId = req.cookies.orderId;

      if (!orderId) {
        return res.status(404).json({
          status: "error",
          message: "Order not found",
        });
      }

      const order = await ordersDao.getOrderById(orderId);

      if (order.status === "paid") {
        return res.status(403).json({
          status: "error",
          message: "Paid orders cannot be modified.",
        });
      }

      order.items = [];
      await ordersDao.save(order);

      res.status(200).json({
        status: "success",
        message: "Order cleared.",
        payload: order,
      });

    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  static async updateQuantity(req, res) {
    try {
      const orderId = req.cookies.orderId;
      const { productId, quantity } = req.body;

      if (!orderId) {
        return res.status(404).json({
          status: "error",
          message: "Order not found.",
        });
      }

      if (!productId) {
        return res.status(400).json({
          status: "error",
          message: "Product ID is required",
        });
      }

      if (quantity < 1) {
        return res.status(400).json({
          status: "error",
          message: "Incorrect quantity.",
        });
      }

      const order = await ordersDao.getOrderById(orderId, {
        populateProducts: true,
      });

      if (order.status === "paid") {
        return res.status(403).json({
          status: "error",
          message: "Paid orders cannot be modified.",
        });
      }

      const item = order.items.find(
        item => item.productId._id.toString() === productId
      );

      if (!item) {
        return res.status(404).json({
          status: "error",
          message: "Product not found in the order.",
        });
      }

      item.quantity = quantity;

      await ordersDao.save(order);

      res.status(200).json({
        status: "success",
        message: "Quantity has been updated.",
        payload: order,
      });

    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  static async pay(req, res) {
    try {
      const orderId = req.cookies.orderId;

      if (!orderId) {
        return res.status(404).json({
          status: "error",
          message: "Order not found.",
        });
      }

      const order = await ordersDao.getOrderById(orderId);

      if (!order || order.items.length === 0) {
        return res.status(400).json({
          status: "error",
          message: "Order is empty.",
        });
      }

      if (order.status === "paid") {
        return res.status(400).json({
          status: "error",
          message: "Order already paid.",
        });
      }

      order.status = "paid";
      await ordersDao.save(order);

      res.clearCookie("orderId");

      res.status(200).json({
        status: "success",
        message: "Order paid successfully.",
        payload: order,
      });

    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  }
}

export { ordersController };
