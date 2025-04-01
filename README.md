# Gmail to LINE Notifier

Gmail to LINE Notifier is a Google Apps Script that automatically sends notifications to LINE when specific emails arrive in your Gmail inbox. It uses the LINE Messaging API to deliver customized notifications directly to your LINE account.

Gmail to LINE Notifier は、Gmail に特定のメールが届いたときに自動的に LINE に通知を送信する Google Apps Script です。LINE Messaging API を使用して、カスタマイズされた通知を LINE アカウントに直接配信します。

## 📋 Features | 機能

- Monitors your Gmail inbox for specific messages (e.g., from a particular sender)
- Sends real-time notifications to LINE when matching emails are detected
- Customizable message format with date and subject information
- Optional automatic marking of processed emails as read
- Detailed logging for troubleshooting

---

- 特定の送信者からのメールなど、Gmail の受信トレイを監視
- 条件に一致するメールが検出されると、LINE にリアルタイムで通知
- 日付や件名情報を含むカスタマイズ可能なメッセージ形式
- 処理済みメールを既読としてマークするオプション
- トラブルシューティングのための詳細なログ出力

## 🛠️ Prerequisites | 前提条件

- A Google account with access to [Google Apps Script](https://script.google.com/)
- A [LINE Developers account](https://developers.line.biz/)
- A LINE Messaging API channel set up
- Basic knowledge of JavaScript and Google Apps Script

---

- [Google Apps Script](https://script.google.com/) にアクセスできる Google アカウント
- [LINE Developers アカウント](https://developers.line.biz/)
- LINE Messaging API チャネルのセットアップ
- JavaScript と Google Apps Script の基本的な知識

## ⚙️ Setup Instructions | セットアップ手順

### 1. LINE Messaging API Setup | LINE Messaging API の設定

1. Create a LINE Developers account at [developers.line.biz](https://developers.line.biz/)
2. Create a new provider (if you don't have one already)
3. Create a new Messaging API channel
4. Note your Channel Access Token from the "Messaging API" tab
5. Add the LINE Bot as a friend using the QR code provided in the LINE Developers Console
6. Enable webhook in the "Messaging API" settings (optional for advanced usage)

---

1. [developers.line.biz](https://developers.line.biz/) で LINE Developers アカウントを作成
2. 新しいプロバイダーを作成（まだ持っていない場合）
3. 新しい Messaging API チャネルを作成
4. 「Messaging API」タブからチャネルアクセストークンをメモ
5. LINE Developers コンソールで提供されている QR コードを使用して LINE Bot を友だちに追加
6. 「Messaging API」設定でウェブフックを有効にする（高度な使用法の場合はオプション）

### 2. Google Apps Script Setup | Google Apps Script の設定

1. Go to [Google Apps Script](https://script.google.com/) and create a new project
2. Copy the code from `gmail-line-notifier.js` into the script editor
3. Update the following variables with your information:
   ```javascript
   var CHANNEL_ACCESS_TOKEN = "YOUR_CHANNEL_ACCESS_TOKEN"; // From LINE Developers Console
   var USER_ID = "YOUR_USER_ID"; // Your LINE user ID
   var get_interval = 1; // Check interval in minutes
   ```
4. Modify the email search criteria in the `fetchContactMail()` function:
   ```javascript
   var strTerms = '(is:unread from:example@gmail.com after:' + time_term + ')';
   ```
5. Customize the notification message format if desired:
   ```javascript
   var messageText = "Custom notification message"
                + "\n【date】: " + dateStr
                + "\n【Subject】: " + subjectStr;
   ```

---

1. [Google Apps Script](https://script.google.com/) にアクセスし、新しいプロジェクトを作成
2. スクリプトエディタに `gmail-line-notifier.js` のコードをコピー
3. 以下の変数をあなたの情報で更新:
   ```javascript
   var CHANNEL_ACCESS_TOKEN = "あなたのチャネルアクセストークン"; // LINE Developers コンソールから
   var USER_ID = "あなたのLINEユーザーID"; // あなたの LINE ユーザー ID
   var get_interval = 1; // チェック間隔（分）
   ```
4. `fetchContactMail()` 関数でメール検索条件を変更:
   ```javascript
   var strTerms = '(is:unread from:example@gmail.com after:' + time_term + ')';
   ```
5. 必要に応じて通知メッセージ形式をカスタマイズ:
   ```javascript
   var messageText = "カスタム通知メッセージ"
                + "\n【日時】: " + dateStr
                + "\n【件名】: " + subjectStr;
   ```

### 3. Setting Up a Trigger | トリガーの設定

1. In your Google Apps Script project, click on "Triggers" in the left sidebar
2. Click "+ Add Trigger"
3. Configure the trigger with the following settings:
   - Choose function to run: `main`
   - Select event source: `Time-driven`
   - Select type of time based trigger: `Minutes timer`
   - Select minute interval: Match this with your `get_interval` variable (e.g., every 5 minutes)
4. Click "Save"

---

1. Google Apps Script プロジェクトで、左サイドバーの「トリガー」をクリック
2. 「+ トリガーを追加」をクリック
3. 以下の設定でトリガーを構成:
   - 実行する関数を選択: `main`
   - イベントのソースを選択: `時間主導型`
   - 時間ベースのトリガーのタイプを選択: `分タイマー`
   - 分間隔を選択: `get_interval` 変数と一致させる（例: 5分ごと）
4. 「保存」をクリック

### 4. Getting Your LINE User ID | LINE ユーザー ID の取得

To get your LINE User ID for the script:

1. Use the `doPost()` function that handles webhook events
2. Set up a webhook URL in the LINE Developers Console pointing to your deployed Apps Script
3. Add the bot as a friend
4. Check the Apps Script logs to see your User ID logged when the follow event is received

Alternatively, you can use the LINE Developers Console webhook testing features or other LINE Bot frameworks to obtain your User ID.

---

スクリプト用の LINE ユーザー ID を取得するには:

1. Webhook イベントを処理する `doPost()` 関数を使用
2. LINE Developers コンソールで、デプロイされた Apps Script を指すウェブフック URL を設定
3. ボットを友だちに追加
4. フォローイベントが受信されたときに Apps Script のログを確認して、ユーザー ID を確認

あるいは、LINE Developers コンソールのウェブフックテスト機能や他の LINE Bot フレームワークを使用してユーザー ID を取得することもできます。

## 📝 Usage Notes | 使用上の注意

- **Search Terms**: Customize the `strTerms` variable to specify which emails to detect
- **Notification Format**: Modify the `messageText` variable to change how notifications appear
- **Read Status**: Uncomment the `lastMsg.markRead()` line to automatically mark emails as read
- **Testing**: Use the `testMailSearch()` function to verify your email search is working correctly

---

- **検索条件**: `strTerms` 変数をカスタマイズして、検出するメールを指定
- **通知形式**: `messageText` 変数を変更して、通知の表示方法を変更
- **既読状態**: `lastMsg.markRead()` の行のコメントを解除して、メールを自動的に既読としてマーク
- **テスト**: `testMailSearch()` 関数を使用して、メール検索が正しく機能していることを確認

## 🔎 Troubleshooting | トラブルシューティング

If you're experiencing issues:

1. Check the Apps Script logs for detailed error messages
2. Verify that your Channel Access Token and User ID are correct
3. Make sure your script has the necessary permissions to access Gmail
4. Run the `testMailSearch()` function to verify emails are being found
5. Check that your bot has been added as a friend in LINE

---

問題が発生した場合:

1. 詳細なエラーメッセージについては Apps Script のログを確認
2. チャネルアクセストークンとユーザー ID が正しいことを確認
3. スクリプトに Gmail へのアクセスに必要な権限があることを確認
4. `testMailSearch()` 関数を実行して、メールが見つかっていることを確認
5. ボットが LINE で友だちに追加されていることを確認

## ⚠️ Security Considerations | セキュリティに関する考慮事項

- Never share your Channel Access Token or User ID publicly
- Consider setting up OAuth2 for more secure authentication with the LINE API
- Regularly monitor your script's execution to ensure it's working as expected

---

- チャネルアクセストークンやユーザー ID を公開しないでください
- LINE API とのより安全な認証のために OAuth2 の設定を検討してください
- スクリプトの実行を定期的に監視して、期待通りに動作していることを確認してください

## 📄 License | ライセンス

This project is licensed under the MIT License - see the LICENSE file for details.

このプロジェクトは MIT ライセンスの下でライセンスされています - 詳細については LICENSE ファイルを参照してください。

## 🤝 Contributing | 貢献

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

貢献、問題、機能リクエストを歓迎します！お気軽に issues ページをご確認ください。

## ✨ Acknowledgements | 謝辞

- LINE for providing the Messaging API
- Google for Google Apps Script

---

- Messaging API を提供している LINE
- Google Apps Script を提供している Google
