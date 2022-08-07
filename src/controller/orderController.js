//--------------------requiring modules-------------------
const orderModel = require('../model/orderModel');
const cartModel = require('../model/cartModel');
const userModel = require('../model/userModel');
const { isValidObjectId } = require('../validation/valid')

//--------------------create order-------------------
const createOrder = async (req, res) => {
  try {
    let userId = req.params.userId

    //-------------------db call for checking userid--------------------------
    let checkId = await userModel.findById({ _id: userId })
    if (!checkId) return res.status(400).send({ status: false, message: 'User Id is not present' })

    let orderData = req.body
    let { cancellable, cartId } = orderData

    //----------------------validating req body----------------------------------
    if (!isValidObjectId(cartId)) { return res.status(400).send({ status: false, message: "Invalid cartId" }) }

    //---------------------db call for checking cart id---------------
    let cartOrder = await cartModel.findOne({ userId: userId })
    if (!cartOrder) return res.status(400).send({ status: false, message: 'cart is  not present' })

    if (cartOrder.items.length === 0) { return res.status(400).send({ status: false, message: "Your Cart is Empty." }) }

    if (cancellable) {
      if (!(cancellable == false || cancellable == true)) { return res.status(400).send({ status: false, message: "Enter Only true / false in cancellable" }) }

    }

    //------------------to calculate tottal quantity--------------
    let total = 0
    for (let i = 0; i < cartOrder.items.length; i++) {
      total = total + cartOrder.items[i].quantity
    }
    let totalQuantity = total

    //---------------------fields to be present in our cart---------------------------
    let cartTobeOrder = {
      userId: cartOrder.userId,
      items: cartOrder.items,
      totalPrice: cartOrder.totalPrice,
      totalItems: cartOrder.totalItems,
      totalQuantity: totalQuantity,
      cancellable: orderData.cancellable
    }

    let orderCreate = await orderModel.create(cartTobeOrder)
    res.status(201).send({ status: true, message: ' Order successfully created', data: orderCreate })

    //-------------------it will empty our cart-------------------------
    await cartModel.updateOne(
      { userId: userId },
      { items: [], totalPrice: 0, totalItems: 0 },
    )
  }
  catch (err) {
    return res.status(500).send({ status: false, error: err.message })
  }

}

//----------------------update order-------------------------
const updateOrder = async (req, res) => {
  try {
    let userId = req.params.userId
    let checkUserId = await userModel.findById({ _id: userId })
    if (!checkUserId) { return res.status(404).send({ status: false, message: "UserId Do Not Exits" }) }

    let data = req.body;
    let { orderId } = data

    //--------------------------validating req body----------------------------
    if (Object.keys(data).length < 1) { return res.status(400).send({ status: false, message: "create order" }) }

    //----------------------checking if cart exists or not-------------------------
    let findOrder = await orderModel.findOne({ _id: orderId, isDeleted: false });
    if (!findOrder) return res.status(404).send({ status: false, message: `No order found with this '${orderId}' order-ID` })

    //------------------------validating if status is in valid format----------------------
    if (!(['Pending', 'Completed', 'Cancelled'].includes(data.status))) return res.status(400).send({ status: false, message: "Order status should be one of this 'Pending','Completed' and 'Cancelled'" });
    let conditions = {};
    if (data.status == "Cancelled") {

      //--------------------checking if the order is cancellable or not-------------------
      if (!findOrder.cancellable) return res.status(400).send({ status: false, message: "You cannot cancel this order" });
      conditions.status = data.status;
    } else {
      conditions.status = data.status;
    }

    let resData = await orderModel.findByIdAndUpdate({ _id: findOrder._id }, conditions, { new: true })
    res.status(200).send({ status: true, message: "Success", data: resData });
  }
  catch (err) {
    res.status(500).send({ status: false, error: err.message })
  }
}

//---------------------making api public------------------
module.exports = { createOrder, updateOrder }