const express = require('express');

const app = express();
const { Sequelize } = require("sequelize");
const cors = require("cors");
const morgan = require("morgan");
const { port } = require("./config");
const PORT = process.env.PORT || port;

//models

const UserModel = require("./common/models/user");
const PostModel = require("./common/models/Posts");
const ReactionsModel = require("./common/models/Reactions")
// const ProductModel = require("./common/models/Product");

//routes
const AuthorizationRoutes = require("./authorization/routes");
const PostRoutes = require("./posts/routes");



app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());


const sequelize = new Sequelize('sqlite::memory:');
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

  app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT)
  })
})
  .catch((err) => {
    console.error("Sequelize Initialisation threw an error:", err);
  });

