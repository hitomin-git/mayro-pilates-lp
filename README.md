# Mayro LP

公開用: https://hitomin-git.github.io/mayro-pilates-lp/final.html
制作案一覧: https://hitomin-git.github.io/mayro-pilates-lp/

## 編集元

- `dist/versions/change4.html` : 現在の原稿・構成
- `dist/versions/change4.css` : 見た目
- `dist/versions/change4.js` : 固定予約ボタンの表示判定
- `dist/assets/` : 公開用画像。新規画像は必ずGitに追加する
- `dist/final.*` : 自動生成する完成版。直接編集しない
- `dist/index.html` : 制作案一覧。完成版へのカードを含む

完成版は制作案の下部リンクを除去し、その分の高さを調整する。
過去の版と共有画像は上書きしない。今回の整理で履歴の書き換えやファイル削除はしていない。

## 更新手順

1. 変更4を編集する。
2. `node build-mayro-final.cjs` で完成版を更新する。CSS/JSのキャッシュ識別子も更新される。
3. `node serve.mjs` でプレビューする。PC・スマホの画像、改行、予約ボタン、Q&Aを確認する。
4. 今回変更したファイルと新しい画像をファイル名指定で `git add` する。別案件が同居しているため `git add .` は使わない。
5. `node check-mayro-release.cjs` を実行する。完成版の同期、リンク、過去版の保存状態、画像のGit登録漏れを検査する。
6. コミットし、`git push origin master` を実行する。
7. `git subtree push --prefix dist origin gh-pages` で公開する。
8. GitHub Actionsの該当コミットのPages処理成功を確認する。

公開先は `gh-pages` 直下。作業フォルダ全体を公開しない。
画像を `.gitignore` で拡張子ごとに除外しない。試作画像は個別に除外する。

## 過去の制作スクリプト

`build-mayro-change2.cjs`、`build-mayro-change3.cjs`、`update-mayro-hub.cjs` は以前の試作用。
現在の原稿・一覧を古い内容に戻す可能性があるため、通常の更新には使わない。
`sync-mayro-navigation.cjs` は制作案用。完成版には制作ナビを追加しない。

## 次のメンテナンス候補

CSSには試行錯誤による上書きルールが残る。見た目を比較しながらセクションごとに整理する。
別案件を専用フォルダ・リポジトリに移す作業は、移動先を決めてから行う。
完成版は現状、検索エンジンに載せない `noindex,nofollow` を維持。正式ドメイン運用時に掲載方針を確認する。
