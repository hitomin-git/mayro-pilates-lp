# 予約希望ページ /reservation/

GitHub Pagesのdist/reservation/と、Firebase Functionsのschedule関数で構成します。
ページを開く・再取得するたびに公開hacomonoをHTTPで読み込みます。予約・会員登録はしません。

## 公開手順
1. Firebaseプロジェクトを指定し、Functionsを利用可能な課金設定を確認する。
2. functions/で npm install を実行する。
3. リポジトリルートで firebase deploy --only functions:mayro-schedule --project mayro-reservation を実行する。
4. 返されたschedule関数URLをdist/reservation/config.jsのMAYRO_SCHEDULE_URLに設定する。
5. 公開APIの応答・CORS・実データを確認してから、README.mdのgh-pages公開手順を実行する。

Firebase関数は公開済みで、config.jsに接続先を設定しています。GitHub Pagesへの反映は別途必要です。

## 日程ルール
日本時間の取得日+2日から。取得日20日までは当月末、21日からは翌月末。
カレンダーは月〜日。期間外は選択不可。体験マークあり・満席/無効でない枠を候補として表示。
講師名は非表示。同じ開始・終了時間はまとめます。第3希望まで、名前と希望日時の文章を生成します。
氏名はブラウザ内だけで保持。LINE連携・送信・hacomono予約更新は未実装です。

## 留意点
公開HTMLの構造に依存するため、hacomono側の変更時にはパーサー修正が必要です。
表示は取得時点の希望候補で、枠確保ではありません。FunctionsのCORSは既存サイトの公開元のみ許可します。

## Claude Codeで編集するとき

予約画面の入口は `dist/reservation/index.html` です。
- `style.css`: 見た目とスマホ対応。末尾に変更の上書きがあります。
- `app.js`: 週切り替え、希望日時の選択、名前入力、文章生成。
- `config.js`: 公開したFirebase関数のURL。
- `functions/schedule.mjs`: 日付範囲の計算とhacomono公開HTMLの解析。
- `functions/index.mjs`: HTTP関数、CORS、エラー応答。

HTML/CSS/JSはPrettierで整形済みです。UIには予約確定やLINE送信の処理はありません。
取得日+2日〜当月末（21日以降は翌月末）、月曜始まり、第3希望までという仕様を維持してください。

### 認証（本人のターミナルで実行）
```powershell
gh auth login --hostname github.com --git-protocol https --web
firebase login --reauth
```
認証完了後、FirebaseのBlaze設定を確認してから関数をデプロイします。
関数URLをconfig.jsに設定し、実データを確認してからGitHub Pagesに公開してください。
