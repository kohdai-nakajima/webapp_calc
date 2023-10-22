import express from "express";
import mathRoute from "./route/math/index"

/////////////////////////////////////////////////
// サーバ自体の設定
/////////////////////////////////////////////////

const app: express.Express = express();
const port = 8080;

// portの設定
app.listen(port, () => {
  console.log(`port ${port} でサーバー起動中`);
});

// JSONオブジェクトの受信設定
app.use(express.json())

// 配列側のオブジェクトの受信設定
app.use(express.urlencoded({ extended: true }));

// CORSを許可する
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/////////////////////////////////////////////////
// APIのrouting
/////////////////////////////////////////////////

app.use("/api/math", mathRoute);


/////////////////////////////////////////////////
// 静的ファイルのrouting
// ※ React Appをbuildしてbackpublic配下に格納
/////////////////////////////////////////////////

app.use(express.static("public"));
