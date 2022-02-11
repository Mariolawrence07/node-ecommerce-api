const Order = require("../models/Order");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const CryptoJS = require("crypto-js");
const { route } = require("express/lib/application");

const router = require("express").Router();
// create

router.post("/", verifyTokenAndAuthorization, async (req, res) => {
  const newOrder = new Order(req.body);

  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// update
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// // Delete

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    Order.findByIdAndDelete(req.params.id);
    res.status(200).json("order has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});
// Get User Order

router.get("/find/userId", async (req, res) => {
  try {
    const Order = await Order.find({userId:req.params.userId});
    res.status(200).json(Order);
    console.log(Order);
  } catch (err) {
    res.status(500).json(err);
  }
});
// Get All 

router.get("/",verifyTokenAndAdmin, async (req, res) => {
    try{
        Order = await Order.find();
        res.status(200).json(Order)

    }catch(err){
        res.status(500).json(err)
    }
  
});

// get monthly income

router.get("/income", verifyTokenAndAdmin, async(req, res)=>{

  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth()-1));
  const previousMonth = new Date (newDate().setMonth(lastMonth()-1));
  try{
      const income = await Order.aggregate([
        {
          $match:{
            createdAt: {$gte: previousMonth}
          }
        },{
          $project:{
            month:{
              $month:"$createdAt"
            },
            sales:"$amount",
          },
        },{
             $group:{
               _id:"$month",
               total:{$sum: "$sales"},
             },
          },
        
      ]);
      res.status(200).send(income)
  }catch(err){
    res.status(500).json(err)
  }
} )

module.exports = router;
