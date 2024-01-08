# このアプリについて
小学生の子供向けに、いろんな教科の問題がとけるWebアプリを作る。  
作るものは以下に随時追加していく。
- 小学生用の計算問題ができるアプリケーション
- 小学生用の漢字の読み書き問題ができるアプリケーション

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

# Expressのディレクトリ構成及び処理フロー例
- [こちら](https://qiita.com/MotohiroSiobara/items/b672b22ce0505e5e17de)を参考にディレクトリ構成を作成
- 処理フローは以下 (以下では計算アプリの例を記載、処理内容は[こちら](https://snowsystem.net/javascript/typescript/express-typescript-rest-api/#)も参考)
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
サーバでfrontのデプロイをするとサーバが死ぬので、ローカルでビルドしてgithub経由で渡す(低スペ…？)  
サーバデプロイ周り、他のチームがどうやってるのか気になってはいる、ちゃんとやるならhtaccessとかいじる必要ありそう(詳細は[こちら](https://qiita.com/neras_1215/items/27c16c605a367ebe88d9))
- ~~front/src/App.tsxの以下をコメントアウトする (なんか自動化できればいいな)~~
  - ~~apiServerUrlの変数定義~~
  - ~~apiServerUrlを利用している個所 (相対パスにする)~~
- ~~ローカルで以下のコマンドを叩く~~
  - ~~cd webapp_calc/front~~
  - ~~npm run build~~
- dotenvを導入し、npm run startもしくはnpm run server時に環境を指定することで「.env.環境名」ファイルのプロパティを取得できるように変更した
  - local環境用にdev serverを開始する場合は以下コマンド
    - `npm run start:local`
  - production環境用にbuildする場合は以下コマンド
    - `npm run build:prod`
- `front/build`配下の以下ファイルを`back/public`配下に`cp`する
  - `cp front/build/index.html back/public/.`
  - `cp -r front/build/static back/public/.`
- gitにpushする
- serverに入って`git pull`
- `back`配下で以下コマンドを実行
  - ~~`npm run server &`~~　<- 廃止
  - `forever start -c "npm run server" ./`
    - コマンドの詳細は[本番環境での環境構築困りごとメモ](#本番環境での環境構築困りごとメモ)を参照
  - 「port:8080で起動中」と表示されたらControl＋Cで中断する

## 補足：環境変数について
- Reactの環境ファイル(.env)の利用方法は[こちら](https://ralacode.com/blog/post/use-env-variables-in-react/)を参照
- dotenvライブラリについては[こちら](https://qiita.com/sea_glow/items/978055ae2533e9844ebb)を参照

# 環境構築メモ
基本的な手順は[こちら](https://ralacode.com/blog/post/create-nodejs-react-app-with-typescript/)の通り

以下、MacOS MacOS High Sierra(10.13.6) で詰まったところを記載
- nodeの最新版を入れるとnode -vでエラーになるので、v15.14.0を入れた
  - [参考](https://chaika.hatenablog.com/entry/2018/06/07/090000)
- npm init -yを叩くとnpmのバージョンを上げろと言われるが、nodeのバージョンと会っていないとあげられないので、あげない
  - [Nodeとnpmのバージョン対比表](https://nodejs.org/ja/download/releases)

# 本番環境での環境構築困りごとメモ
- npm run serverいたサーバが勝手に落ちてしまう
  - 例外を検出すると落ちてしまう？
  - foreverをinstallした 
    - [参照1](https://gihyo.jp/dev/serial/01/nodejs/0002)
    - [参照2](https://github.com/foreversd/forever/issues/1057#issuecomment-626194082)
    - `forever start -c "npm run server" ./`

# Reactの諸々
- [今から始めるReact入門 〜 React の基本](https://qiita.com/TsutomuNakamura/items/72d8cf9f07a5a30be048)
- [React hooks周り](https://qiita.com/seira/items/e62890f11e91f6b9653f)
- [Reactで画像を表示する方法](https://qiita.com/ytnd0928/items/22704b1c47c20e1bd83f)
- [[React] 副作用フックを使用してsetTimeoutのタイマーをリセットする](https://dev.classmethod.jp/articles/reset-timer-for-settimeout-using-use-effect-in-react/)
- [【React】「useStateの値を更新しても反映されない！」の解決方法](https://zenn.dev/syu/articles/3c4aa813b57b8c)
- [React Router (ナビゲーションの話 / Demoあり英語サイト)](https://www.w3schools.com/react/react_router.asp)
- [入門者でもわかるReact Routerを利用したルーティング設定の基礎](https://reffect.co.jp/react/react-router)


# その他知識集
- [Sassなしで入れ子が可能に。CSSネストが全ブラウザ対応](https://zenn.dev/tonkotsuboy_com/articles/css-nesting-without-sass)
- [CSS カスタムプロパティ（変数）の使用](https://developer.mozilla.org/ja/docs/Web/CSS/Using_CSS_custom_properties)
- [CSSアニメーション](https://coco-factory.jp/ugokuweb/css02/)