const express = require('express');

const app = express();
const { Sequelize } = require("sequelize");
const cors = require("cors");
const morgan = require("morgan");
const { port } = require("./config");
const PORT = process.env.PORT || port;
let bodyParser = require("body-parser");
const { createServer } = require('node:http');
const {Server}=require("socket.io");
const server = createServer(app);


const io=new Server(server,{
  cors: "no-cors"
});



//models

const UserModel = require("./common/models/User");
const PostModel = require("./common/models/Posts");
const ReactionsModel = require("./common/models/Reactions")
// const ProductModel = require("./common/models/Product");

//routes
const AuthorizationRoutes = require("./authorization/routes");
const PostRoutes = require("./posts/routes");
const  setMails=require("./authorization/controllers/AuthorizationController")
const  sendNotifs=require("./posts/PostController")


// server.listen(4001);



app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const chatMsgs=[];
const nottifis=[
  `Shanks posted:MERN #check it out`,
  `Trent posted:.Net Framework #check it out`,
  `TonyStark posted:React.js #check it out`
]

io.on("connection",(socket)=>{
  console.log("working:",socket.id);
  socket.emit("wel","welcome ok");
  setMails.setMailNotif(io,socket,nottifis);
   sendNotifs.sentNotifs(io,socket,nottifis);
   socket.on("user",(user)=>{io.emit("userJoined",`${user} has joined the chat`)})
   socket.on("chats",(msgObj)=>{
    chatMsgs.push(msgObj)
    // console.log(msgObj);
    io.emit("msgs",msgObj);
  });

//   function emitMsgs(welMsg){
//     io.emit("welMsg", welMsg);
// }
});

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./storage/data.db", // Path to the file that will store the SQLite DB.
});
// Initialising the Model on sequelize
// 
UserModel.initialise(sequelize);
/* const arrays=[
  PostModel.initialise(sequelize),
  ReactionsModel.initialise(sequelize)
] */
const Post= PostModel.initialise(sequelize);
const Reaction= ReactionsModel.initialise(sequelize);
/* const cylces=arrays.map(async (e)=>{
  return await e
}); */

/* const newArrey=[
  PostModel.forPostRelations,
    ReactionsModel.forRelations
]

cylces.forEach(async(e)=>{
  newArrey.map(async(ele)=> ele(await e))
}) */
//for db relationships
 PostModel.forPostRelations(Reaction);
 ReactionsModel.forRelations(Post); 

/*  async function forModelRelations(x){
  console.log(x)
  return x
 }
 forModelRelations(PostModel.forPostRelations(await cylces[1]))
 forModelRelations(ReactionsModel.forRelations(await cylces[0])) */
 



// ProductModel.initialise(sequelize);

async function auth() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
auth()


sequelize.sync().then(() => {
  console.log('sqlite initialiseed')

  app.use('/', AuthorizationRoutes);
  app.use('/post', PostRoutes);

  server.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT)
  })
})
  .catch((err) => {
    console.error("Sequelize Initialisation threw an error:", err);
  });

module.exports=server