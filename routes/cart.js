
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const CryptoJS = require("crypto-js");
const { route } = require("express/lib/application");
const Cart = require("../models/Cart");
const router = require("express").Router();
// create

router.post("/", verifyTokenAndAuthorization, async (req, res) => {
  const newCart = new Cart(req.body);

  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// update
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// // Delete

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("product has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});
// Get User cart

router.get("/find/userId", async (req, res) => {
  try {
    const cart = await Cart.findone({userId:req.params.userId});
    res.status(200).json(cart);
    console.log(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});
// Get All 

router.get("/",verifyTokenAndAdmin, async (req, res) => {
    try{
        cart = await Cart.find();
        res.status(200).json(cart)

    }catch(err){
        res.status(500).json(err)
    }
  
});

module.exports = router;
