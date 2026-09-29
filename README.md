# Mayro website

HPと無料体験LPを管理するリポジトリです。過去の制作案・比較ページ・試作スクリプト・未使用画像は削除済みです。以前の内容はGit履歴から確認できます。

- HP: https://hitomin-git.github.io/mayro-pilates-lp/hp/
- LP: https://hitomin-git.github.io/mayro-pilates-lp/trial/
- ルートURLはHPへ、従来の `final.html` はLPへ転送します。

## ファイル構成

| フォルダ | 用途 |
| --- | --- |
| `dist/hp/` | HPの10ページ・ページ別CSS・共通CSS/JS・画像・フォント。ここを直接編集 |
| `dist/trial/` | LPのHTML・CSS・JS・使用画像。ここを直接編集 |
| `scripts/` | プレビュー、参照チェック |

LPは `dist/trial/index.html`・`style.css`・`site.js` を編集します。PC・スマホとも `assets/hero-13.jpg` を使用します。CSS・JS更新時はHTMLの `?v=` も更新してください。

HPは `dist/hp/<ページ名>/index.html` を直接編集する普通の静的HTMLです。各ページ専用のCSSは `dist/hp/<ページ名>.css`（トップページのみ `dist/hp/home.css`）にあります。全ページ共通のスタイル・色/フォント変数・動作は `dist/hp/base.css`・`site.js` です。ルート直下の `dist/<ページ名>/index.html` は本番公開用のコピーで、`dist/hp/` と同じ内容を参照しています（`hp/base.css` のように `hp/` を経由）。HTML・CSSを更新したら、両方の場所（`dist/hp/...` と `dist/...`）を同じ内容に更新し、`?v=` のハッシュも変更してください。

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
git subtree push --prefix dist origin gh-pages
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
- 支給写真の番号付きファイルは `dist/hp/assets/photo-番号.jpg` です。画像は枠ごとに保持し、繰り返し部品でも上書きしません。
- 端末で動きを減らす設定が有効な場合は、自動再生とフェードを停止します。
