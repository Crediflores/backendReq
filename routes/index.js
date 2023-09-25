const Router=require("express");
const router=Router()
const {ingresoUser, RegistroUser, changePassword}=require("../controller/indexController");



router.post("/login",ingresoUser)
router.post("/register",RegistroUser)
router.post("/changepassword",changePassword)


module.exports=router;
