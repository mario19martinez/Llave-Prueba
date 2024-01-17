const { server, httpServer } = require("./src/app");
const { conn } = require("./src/db");

const port = process.env.PORT || 3001;

conn.sync({ alter: true }).then(() => {
  httpServer.listen(port, () => {
    console.log(`%s listening at ${port}`);
  });
});
