# このアプリについて
- Webページ上で小学生用の計算問題ができるアプリケーションを作成する
- あと何となくプロフィールページも作る

# server
- WebARENAさんの一番安いプランをお借りする
- 1CPU 1GB Ubuntu 22.04 (CentOSにしようとしたけどサポート切れる記事を見た気がしたので)
- レンタルサーバの容量が小さいので、軽量かつ迅速に実行できるNode.jsの標準server機能を利用
- dockerとかNginxとかそこらへんも将来的に使ってみたいけど、容量次第

# 言語選択・実行環境
練習も兼ねてるので、以下の構成にする
- 実行環境 -> Node.js
- backend  -> TypeScript + Express
- frontend -> React + TypeScript
- [参考にしたサイト](https://ralacode.com/blog/post/create-nodejs-react-app-with-typescript/)

(自分用メモ)
WebARENAのインスタンスがちょいちょい停止になるので、
`デスクトップ/webARENA` 配下のshellからサーバに乗り込んで
`npm run server` してください。

# Expressのディレクトリ構成及び処理フロー例
- [こちら](https://qiita.com/MotohiroSiobara/items/b672b22ce0505e5e17de)を参考にディレクトリ構成を作成
- 処理フローは以下 (処理内容は[こちら](https://snowsystem.net/javascript/typescript/express-typescript-rest-api/#)も参考)
- controllerとrouteの使い分けは[こちら](https://reffect.co.jp/node-js/first-time-express-js/#controllers-%E3%81%AE%E4%BD%9C%E6%88%90)を参照
  - /public/  -> Expressの静的ファイル置き場([こちら](https://expressjs.com/ja/starter/static-files.html)を参照)
    - index.html  -> ReactAppのbuild結果
    - static/  -> ReactAppのbuild結果(cssやjsを格納)
  - /src/api/
    - server.ts  -> main処理、"/math"をmath/index.tsに振り分ける
    - route/
      - math/
        - index.ts  -> "/math"以下のパスを振り分ける
        - calculaterGame.ts  -> "/math/calculater-game"以下のパスを振り分けて、Controllerに連携する
    - controller/
      - math/
        - calculaterGameController.ts  -> "/math/calculater-game"以下の実処理を行う

# 開発時に困ったことTios
- front -> backにリクエストを投げるとCORSに引っかかる
  - CORSについては[こちら](https://qiita.com/10mi8o/items/2221134f9001d8d107d6)を参照
  - 解決策については[こちら](https://qiita.com/tomoya_ozawa/items/feca4ffc6217d585b037)を参照

# サーバデプロイ方法
サーバでfrontのデプロイをするとサーバが死ぬので、ローカルでビルドしてgithub経由で渡す
サーバデプロイ周り、他のチームがどうやってるのか気になってはいる、ちゃんとやるならhtaccessとかいじる必要ありそう(詳細は[こちら](https://qiita.com/neras_1215/items/27c16c605a367ebe88d9))
- front/src/App.tsxの以下をコメントアウトする (なんか自動化できればいいな)
  - apiServerUrlの変数定義
  - apiServerUrlを利用している個所 (相対パスにする)
- ローカルで以下のコマンドを叩く
  - cd webapp_calc/front
  - npm run build
- webapp_calc/front/build配下の以下のファイルをwebapp_calc/back/public配下にcpする
  - index.html
  - static/配下全て
- gitにpushする
- serverに入ってgit pull
- webapp_calc/back配下で以下コマンドを実行
  - npm run server &
  - 「port:8080で起動中」と表示されたらControl＋Cで中断する

# 環境構築メモ
基本的な手順は[こちら](https://ralacode.com/blog/post/create-nodejs-react-app-with-typescript/)の通り
以下、MacOS MacOS High Sierra(10.13.6) で詰まったところを記載
- nodeの最新版を入れるとnode -vでエラーになるので、v15.14.0を入れた
  - [参考](https://chaika.hatenablog.com/entry/2018/06/07/090000)
- npm init -yを叩くとnpmのバージョンを上げろと言われるが、nodeのバージョンと会っていないとあげられないので、あげない
  - [Nodeとnpmのバージョン対比表](https://nodejs.org/ja/download/releases)

# Reactの諸々
- [React hooks周り](https://qiita.com/seira/items/e62890f11e91f6b9653f)