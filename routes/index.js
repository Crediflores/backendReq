const Router=require("express");
const router=Router()
const {ingresoUser, RegistroUser, changePassword,consultaFun, consultMasiva,areas, cargos, adminChangePass}=require("../controller/indexController");



router.post("/login",ingresoUser)
router.post("/register",RegistroUser)
router.post("/changepassword",changePassword)
router.post("/consultaFun",consultaFun)
router.get("/consultMasiva",consultMasiva)
router.get("/areas",areas)
router.get("/cargos",cargos)
router.post("/adminChangePass",adminChangePass)


module.exports=router;
