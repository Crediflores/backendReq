const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const Pool=require("../src/bd")


//rutas

const RegistroUser=async (req, res)=>{
    var {documento,usuario,contrasena, nombre, correo, area, cargo, extension, id_perfil}=req.body;
    var existencia=await validarExistencia(documento);
    if(existencia.length==0){
        
        const registro=await registroEmpleado(documento,nombre,correo,area,cargo,extension)

            contrasenaEncriptada=await convertirContrasena(contrasena)
            console.log(contrasenaEncriptada)
            console.log(registro)
            //contrasenaEncriptada="S4n74"
            try{
                const consulta=await Pool.query("INSERT INTO tUser (usuario, clave, idperfil, iddell_user, estadocuenta) values ($1,$2,$3,$4,true)",[usuario,contrasenaEncriptada,id_perfil,registro])
                console.log(existencia[0].iddell_user);
                console.log(usuario,contrasenaEncriptada);
                return res.status(200).send("El usuario se pudo registrar");
           }catch(e){
                return res.status(401).send(e);
            }
       
    }else{
        console.log(existencia.length)
        return res.status(401).send("El usuario ya existe");
    }
   
}




async function registroEmpleado(documento,nombre,correo,area,cargo,extension){
    
        const consulta=await Pool.query("INSERT INTO Dell_User (documento, nombre, correo,area,cargo,extension,vip) VALUES ($1,$2,$3, $4, $5, $6, false)",[documento,nombre,correo,area,cargo,extension]);
        const datos=await validarExistencia(documento)
        console.log("El id es:" + datos[0].iddell_user)
        return datos[0].iddell_user;
}  



async function validarExistencia(documento){
    const consulta=await Pool.query("SELECT * FROM Dell_User WHERE documento=$1",[documento]);   
    return consulta.rows;
}

const ingresoUser=async (req, res)=>{
    var {usuario, contrasena}=req.body;

    try{
    
    const palabraTextoPlano=contrasena

    const consulta=await Pool.query("SELECT * FROM tUser WHERE usuario=$1",[usuario]);

    const datos=consulta.rows;
    const palabraSecretaEncriptada=datos[0].clave;
    
    palabraSecretaValida=await bcrypt.compare(palabraTextoPlano,palabraSecretaEncriptada);

    if(palabraSecretaValida){

        const token=jwt.sign({id_user:datos[0].iduser}, 'secretKey')
        var datosUser = { idUser: datos[0].iduser, usuario:datos[0].usuario, usuario:datos[0].usuario, idPerfil:datos[0].idperfil };
        return res.status(200).json({token, datosUser})
    }else{
        return res.status(401).send("Contraseña incorrecta");
    }

 }catch(error){
     return res.status(401).send("El usuario no existe");
 
 }

}
 

const changePassword=async (req, res)=>{
    var {token, password}=req.body

    try{

        const decoded=jwt.verify(token, 'secretKey')
        const iduser=decoded.id_user
        contrasenaEncriptada=await convertirContrasena(password)
        const response=await Pool.query("update tUser set clave=$1 where iduser=$2",[contrasenaEncriptada, iduser])
        
        return res.status(200).send("La contraseña se pudo cambiar");

    }catch(error){
        return res.status(401).send("No es posible realizar el cambio de clave");
    }
}





async function convertirContrasena(password){
    const palabraTextoPlano=password
    const rondas=10;
    password=bcrypt.hash(palabraTextoPlano,rondas);

    return password;
}

module.exports={RegistroUser, ingresoUser, changePassword}