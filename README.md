# まいにち九段ベースボール ⚾

千代田区立九段中等教育学校をめざす、小学4年生のための**毎日学習アプリ**です。
計算・音読・作文・理科社会を、ガチャやごほうびのゲーム感覚で習慣化できます。

- **完全オフライン / 単体動作**：ネット接続もログインも不要。`index.html` を開くだけで動きます。
- **データは端末に保存**：連勝・集めたカード・貯金・学習記録・苦手リストは、ブラウザの localStorage にその端末ごとに保存されます（サーバー送信なし）。
- **ホーム画面に追加**でアプリのように使えます（PWA対応）。

---

## 📁 フォルダ構成

```
九段下対策アプリ/
├── index.html                  ← アプリ本体（これがGitHub Pagesのトップになる）
├── manifest.webmanifest        ← ホーム画面追加（PWA）用の設定
├── icon-192.png                ← アイコン（Android / PWA）
├── icon-512.png                ← アイコン（大）
├── icon-512-maskable.png       ← アイコン（マスカブル）
├── icon-180.png                ← アイコン（iOS apple-touch）
├── .nojekyll                   ← GitHub PagesのJekyll処理を無効化（空ファイル）
├── README.md                   ← このファイル
├── 開発資料/
│   ├── 開発の経緯.md            ← v1〜v12 の作り込みの流れ
│   └── アプリ仕様.md            ← 機能・コンテンツ・ロジックの仕様
└── source/                     ← 編集・再ビルド用の元ファイルとバックアップ
    ├── content_reading.js       ← 音読20話（編集用ソース）
    ├── content_writing.js       ← 作文20題（編集用ソース）
    ├── content_science.js       ← 理科社会28問・三択（編集用ソース）
    ├── app_logic.js             ← 初期ロジックの参考（※最新は index.html が正）
    └── backups/                 ← 各バージョンの index バックアップ（v1〜v11）
```

> **重要**：実際に動くアプリは `index.html` 1ファイルに、コンテンツもロジックも全部入っています。
> `source/` の中身は「あとで中身を編集したいとき用」の元ファイルです。アプリを動かすだけなら `index.html`（と同じ階層のアイコン類・manifest）だけで完結します。

---

## 🚀 GitHub Pages で公開する手順

GitHub Pages はリポジトリの**ルート（トップ階層）**に置いた `index.html` をそのまま配信できます。
このフォルダの中身を**そのまま**リポジトリのルートに入れればOKです（`index.html` がルートに来るように）。

### 手順（ブラウザ + Git どちらでも）

1. **GitHubで新しいリポジトリを作成**
   - 名前の例：`kudan-baseball`
   - 公開範囲：Public（GitHub Pages を無料で使うため）
   - README は「追加しない」（このフォルダのREADMEを使う）

2. **このフォルダの中身をリポジトリにアップロード**
   - `index.html` がリポジトリの**ルート**に来るようにする（フォルダごと入れ子にしない）
   - アイコン類・`manifest.webmanifest`・`.nojekyll` も同じルートに置く
   - `開発資料/` `source/` はサブフォルダのままでOK

3. **GitHub Pages を有効化**
   - リポジトリの **Settings → Pages** を開く
   - **Build and deployment** の **Source** を「**Deploy from a branch**」にする
   - **Branch** を `main`（または `master`）、フォルダを `/ (root)` にして **Save**

4. **数分待つ**と、`Settings → Pages` の上部に公開URLが表示される
   - URLの形：`https://<あなたのユーザー名>.github.io/kudan-baseball/`
   - そのURLをスマホで開く → 動作確認

5. **スマホのホーム画面に追加**（任意）
   - iPhone(Safari)：共有ボタン → 「ホーム画面に追加」
   - Android(Chrome)：メニュー → 「アプリをインストール」または「ホーム画面に追加」
   - アイコンと「九段ベースボール」の名前で、全画面アプリとして起動します

### Gitコマンドで行う場合（参考）

```bash
# このフォルダの中で
git init
git add .
git commit -m "まいにち九段ベースボール 初回公開"
git branch -M main
git remote add origin https://github.com/<ユーザー名>/kudan-baseball.git
git push -u origin main
# このあと Settings → Pages で Source を main / root にして Save
```

---

## 🔄 中身を更新したいとき

- アプリの中身（コンテンツ・機能）を直すときは、基本 `index.html` を編集します。
- `index.html` 内の `READINGS` / `WRITINGS` / `SCIENCE` がコンテンツ本体です（`source/` の同名ファイルが読みやすい元データ）。
- 直したら `index.html` をリポジトリに再アップロード（push）すれば、数分で公開版に反映されます。
- **データ保存のキーは `kudan-state-v5`**。保存形式を壊す変更をすると、利用者の進捗が読めなくなる場合があるので注意。

---

## ⚠️ 注意・既知の仕様

- データは**端末ごと**に保存されます。別の端末・別ブラウザでは進捗は共有されません（サーバーなしのため）。
- ブラウザのデータ消去や「サイトデータを削除」をすると、進捗（カード・貯金・記録）も消えます。
- アプリ内の「全データを初期化（保護者用）」ボタンでも全消去できます。
- ガチャの選手カードは**すべて架空**で、実在の選手・チーム名は使っていません（権利配慮）。
- 対象は小学4年生。難易度・内容は10歳の平均的な学力に合わせています。

楽しく毎日つづけて、九段中合格を応援しています！⚾
