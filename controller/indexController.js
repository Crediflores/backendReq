const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const Pool=require("../src/bd")


//rutas

const adminChangePass=async(req,res)=>{
    var {id,password}=req.body;
    contrasenaEncriptada=await convertirContrasena(password)
    try{
        const consulta=await Pool.query("UPDATE tuser SET clave=$1 WHERE iduser=$2",[contrasenaEncriptada,id])
        return res.status(200).json({"Aprobacion":"La contraseña se pudo actualizar"});
    }catch(e){
        return res.status(401).send(e);
    }


}


const areas=async(req,res)=>{
    try{
        const consulta=await Pool.query("select * from area");
        return res.status(200).json(consulta.rows)
    }catch(error){
        return res.status(401).send(error);
    }
}


const cargos=async(req, res)=>{
    try{
        const consulta=await Pool.query("select * from cargo");
        return res.status(200).json(consulta.rows)
    }catch(error){
        return res.status(401).send(error);
    }
}


const consultMasiva=async(req,res)=>{
    try{
        const consulta=await Pool.query("select * from tuser a inner join dell_user b on a.iddell_user=b.iddell_user" );
        return res.status(200).json({"DatosUsuarios":consulta.rows});
    }catch(error){
        return res.status(401).send(error);
    }
}

const consultaFun=async(req,res)=>{
    var {documento}=req.body;
    var existencia=await validarExistencia(documento);
    return res.status(200).json({"user":existencia});
}

const RegistroUser=async (req, res)=>{
    var {documento,usuario,contrasena,id_perfil}=req.body;
    var existencia=await validarExistencia(documento);
    var existenciaUser=await validarExistenciaUser(existencia[0].iddell_user);
    
    if(existencia.length>0 && existenciaUser.length==0){
        
        //const registro=await registroEmpleado(documento,nombre,correo,area,cargo,extension)

            contrasenaEncriptada=await convertirContrasena(contrasena)
            console.log(contrasenaEncriptada)
            
            //contrasenaEncriptada="S4n74"
            try{
                const consulta=await Pool.query("INSERT INTO tUser (usuario, clave, idperfil, iddell_user, estadocuenta) values ($1,$2,$3,$4,true)",[usuario,contrasenaEncriptada,id_perfil,existencia[0].iddell_user])
                console.log(existencia[0].iddell_user);
                console.log(usuario,contrasenaEncriptada);
                return res.status(200).json({"Aprobacion":"El usuario se pudo registrar"});
           }catch(e){
                return res.status(401).send(e);
            }
       
    }else{
        console.log(existencia.length)
        return res.status(401).send("El usuario ya existe o aún el funcionario no se encuentra registrado.");
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

async function validarExistenciaUser(id){
    const consulta=await Pool.query("SELECT * FROM tuser WHERE iddell_user=$1",[id]);
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
        
        return res.status(200).json({"Aprobacion":"La contraseña se pudo cambiar"});

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

module.exports={RegistroUser, ingresoUser, changePassword, consultaFun, consultMasiva, areas, cargos, adminChangePass}