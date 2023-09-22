const {config}=require("dotenv")
config()

module.exports={
    db:{

        
        DB_USER: process.env.DB_USER,
        DB_PASSWORD: process.env.DB_PASSWORD,
        DB_HOST: process.env.DB_HOST,
        DB_DATABASE: process.env.DB_DATABASE,
        DB_PORT: process.env.DB_PORT
        

    },
    email:{
        A_EMAIL:process.env.A_EMAIL,
        A_PASSWORD:process.env.A_PASSWORD
    }
}
