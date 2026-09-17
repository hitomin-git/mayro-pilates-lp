# Mayro LP design gallery

カード一覧から各LPを開ける、静的な比較サイトです。Google Sitesではありません。

公開先: https://hitomin-git.github.io/mayro-pilates-lp/
リポジトリ: https://github.com/hitomin-git/mayro-pilates-lp

## 保存しているページ

| ページ | 内容 |
| --- | --- |
| dist/index.html | カード形式のLP一覧・ブラウザー内のお気に入り |
| dist/versions/old.html | 古い版。2004862時点の短いストーリーLP |
| dist/versions/change1.html | 変更1。2026-09-17の最初の参考画像ベース試作 |
| dist/versions/change2.html | 変更2。写真カード・図解・横並び構成を参考画像へ近づけた版 |
| dist/versions/review2.html | 参考画像との同幅比較・自己評価の内訳 |

## 過去の版を上書きしない

- 古い版・変更1のHTML/CSS/JSは凍結。version-baselines.jsonのハッシュで変更がないことを検証します。
- 次はchange3.html / change3.css / change3.jsを新規作成し、一覧にカードを追加します。
- 写真も新しい名前で追加。既存バージョンの共有素材を置き換えないでください。
- お気に入りはブラウザー内に保存されます。端末間・ローカル版と公開版の間では共有されません。

## 確認と公開

1. node serve.mjs で http://127.0.0.1:4173/ を表示。
2. node check-mayro-versions.cjs でページ・素材参照・アンカー・保存版の不変性を検証。
3. 今回のサイト関連ファイルだけをコミットしてmasterにpush。
4. git subtree push --prefix dist origin gh-pages で公開内容を更新。
5. GitHub Pagesの最新ビルド成功を確認。

公開元は既存設定のgh-pagesブランチ直下です。distに含まれる公開用ファイルだけを配置し、作業用フォルダーは公開しません。
旧来の.openai/hosting.jsonは既存履歴として保持。今回はユーザー指定どおりGitHub Pagesを利用します。

## デザインの評価と素材

変更2の自己評価は90/100。構成・配置など10項目を目視で評価した目安で、画像の一致率ではありません。
人物写真、公式情報に合わせたスタッフ2名の構成、控えめな背景装飾に差が残ります。
詳細はdist/versions/review2.html、素材の出典と生成プロンプトはDESIGN-ASSETS.mdを参照。

## 変更3
実写写真・生成り・深い茶色・淡いグリーンを使った新しいLP。dist/versions/change3.html、独立した料金ページ change3-price.html。料金は2026-09-17に公式ページで確認。過去のLPは変更なし。

