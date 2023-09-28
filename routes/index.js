const Router=require("express");
const router=Router()
const {ingresoUser, RegistroUser, changePassword,consultaFun}=require("../controller/indexController");



router.post("/login",ingresoUser)
router.post("/register",RegistroUser)
router.post("/changepassword",changePassword)
router.post("/consultaFun",consultaFun)


module.exports=router;
