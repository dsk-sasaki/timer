# タイマー (Timer) ![Deploy to GitHub Pages](https://github.com/dsk-sasaki/timer/actions/workflows/pages.yml/badge.svg)

ブラウザで動くシンプルなカウントダウンタイマーです。分・秒入力、開始/一時停止、リセット、プリセット（3分/5分）、時間の増減（+1分 / -10秒）、進捗リング表示、完了時ビープ音（Web Audio）をサポートします。

## 公開URL
- GitHub Pages: https://dsk-sasaki.github.io/timer/

## デモ / 実行方法
- ローカルで `index.html` をブラウザで開くだけで動作します。
  - 例: ファイルをダブルクリック、またはブラウザにドラッグ＆ドロップ
- 音はユーザー操作後に鳴ります（自動再生制限に対応）。

## 主な機能
- 分・秒入力（停止中は編集可能、範囲: 分0-999 / 秒0-59）
- 開始 / 一時停止 / リセット
- プリセット: 3分 / 5分
- 時間調整: +1分 / -10秒（動作中でも反映）
- 進捗リング（円形の残り時間可視化）
- ページタイトルに残り時間を表示
- 完了時にビープ音（Web Audio API）
- キーボードショートカット
  - スペース: 開始/一時停止
  - R: リセット

## 画面構成
- 中央に残り時間（MM:SS）
- 下部に分・秒入力欄と操作ボタン
- フッタにショートカットのヒント

## 開発
- ファイル構成
  - `index.html` … 本体HTML
  - `style.css` … スタイル（ライト/ダーク対応, 進捗リング）
  - `script.js` … タイマーのロジック（Web Audio, 入力検証, ショートカット 等）
  - `images/watch.png` … ファビコン

- 推奨ブラウザ: 最新版の Chrome / Edge / Firefox / Safari

## デプロイ
GitHub Actions により、`main` へ push すると自動で GitHub Pages に公開されます。
初回のみ、リポジトリの Settings → Pages で Source を “GitHub Actions” に設定してください。

## ライセンス
未設定（必要に応じて追加してください）
