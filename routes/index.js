const Router=require("express");
const router=Router()
const {ingresoUser, RegistroUser}=require("../controller/indexController");



router.post("/login",ingresoUser)
router.post("/register",RegistroUser)


module.exports=router;
