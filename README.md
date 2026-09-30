# Mayro website

HPと無料体験LPを管理するリポジトリです。過去の制作案・比較ページ・試作スクリプト・未使用画像は削除済みです。以前の内容はGit履歴から確認できます。

- HP: https://hitomin-git.github.io/mayro-pilates-lp/
- LP: https://mayro-pilates.com/trial2/
- LP比較案: https://mayro-pilates.com/trial3/ ・ https://mayro-pilates.com/trial4/
- ルートURLはHPへ、旧LPの `trial/` と従来の `final.html` はLP（`trial2/`）へ転送します。

## ファイル構成

| フォルダ | 用途 |
| --- | --- |
| `dist/index.html`, `dist/404.html`, `dist/menu/`, `dist/staff/`, `dist/privacypolicy/` | HPの5ページ。ここを直接編集 |
| `dist/css/` | 全ページ共通の`base.css`・`fonts.css`と、ページ別CSS（`home.css`・`menu.css`など） |
| `dist/js/` | 全ページ共通の`site.js` |
| `dist/assets/` | HPで使う画像・フォント |
| `dist/trial2/` | LP。HP側とは独立（フォントの`../css/fonts.css`のみ共用） |
| `dist/trial3/`, `dist/trial4/` | LPの比較案。`index.html`だけを持ち、CSS・JS・画像は`trial2/`のものを使用 |
| `dist/trial/` | 旧LPのURL。`trial2/`へ転送するだけのページ |
| `scripts/` | プレビュー、参照チェック |

LP（`dist/trial2/`）の構成:

| ファイル | 内容 |
| --- | --- |
| `index.html` | ページ本体。セクションごとにコメントあり |
| `css/hero.css` | ファーストビュー（写真・キャッチコピー・予約ボタン） |
| `css/sections.css` | ファーストビューより下のセクション〜フッター |
| `css/booking.css` | 予約ボタン（スマホの画面下固定バーと、ボタンの共通デザイン） |
| `js/hero-fit.js` | ファーストビューを画面の高さに収める |
| `js/booking-bar.js` | 画面下固定バーの表示/非表示（ページ一番下の予約ボタンが画面に入ったら隠す） |
| `assets/` | LPで使う画像 |

PC・スマホとも `assets/hero-13.jpg` を使用します。CSS・JS更新時はHTMLの `?v=` も更新してください（`trial3`・`trial4`のHTMLも同じファイルを読み込んでいるので、そちらも更新）。CSS内の画像参照（`url('../assets/...')`）は、`css/`から見た相対パスなので`../`が必要です。

HPは各ページのHTMLを直接編集する普通の静的サイトです。共通スタイル・色/フォント変数・動作は `dist/css/base.css`・`dist/js/site.js` です。CSSやJSを更新したら、それを読み込んでいる各HTMLの `?v=` のハッシュも変更してください。背景画像は各要素の`style="--node-image:url(...)"`で指定していますが、この`url()`は**そのプロパティを実際に使っているCSSファイル（`dist/css/`）を基準に解決される**ため、パスは常に`../assets/...`になります（ページ自身の階層とは無関係です）。`npm run check`はこの点も含めてパスの整合性を検証します。

## 確認・更新

Node.jsを使用します。追加ライブラリのインストールは不要です。

```sh
npm run check
npm run preview
```

プレビューは http://127.0.0.1:4186/ 。`PORT` 環境変数で変更できます。

```sh
git add dist scripts README.md package.json .gitignore
git commit -m "Update Mayro website"
git push origin master
# gh-pagesの履歴はmasterと別なので、distの中身をgh-pagesの上に1コミット追加して公開する
git fetch origin gh-pages
git push origin "$(git commit-tree HEAD:dist -p origin/gh-pages -m "Publish Mayro website")":refs/heads/gh-pages
```

GitHub Pagesは `gh-pages` のルートを公開します。公開処理の成功後に実際のHPとLPを確認してください。

## 現在の公開範囲

全ページは検索除外 `noindex,nofollow` の確認用公開です。パスワード保護ではありません。既存の `mayro-pilates.com` はStudioのままで、独自ドメインへの接続は未実施です。

HPは元サイトの構成を保存した静的再現版です。ニュースのCMS連携や計測タグは未接続です。旧予約・問い合わせフォームは表示確認用で送信されません。現行の予約・LINEリンクは引き継いでいます。正式運用前に窓口・フォーム・SEO設定を確認してください。

## HPの写真と動き

- HEROは既存の2枚を5秒間隔、1.8秒のクロスフェードで切り替えます。15番は使用しません。
- NEWSとMENUの間は支給写真12→8→9→10を横方向に自動ループします。
- FLOWは支給写真6→7→5→4。PC・スマホとも4列で表示します。
- REVIEWは3件を左右へ循環し、初期表示から隣接カードを薄く表示します。矢印・横スワイプで操作できます。
- ACCESSと本文全体は内容に応じた高さとし、フッターを通常の文書順で配置しています。
- 支給写真の番号付きファイルは `dist/assets/photo-番号.jpg` です。画像は枠ごとに保持し、繰り返し部品でも上書きしません。
- 端末で動きを減らす設定が有効な場合は、自動再生とフェードを停止します。
