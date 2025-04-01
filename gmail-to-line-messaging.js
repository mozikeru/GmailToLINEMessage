// LINE Messaging API用の設定
var CHANNEL_ACCESS_TOKEN = "your_channel_token"; // LINE Messaging APIのチャネルアクセストークン
var USER_ID = "send_users_line_id"; // 通知を送りたいユーザーID（自分に送る場合は「チャネル基本設定」画面の「あなたのユーザーID」を設定）
var FROM = "xxx@example.com"; // 捕まえたいメールのFromアドレス
var get_interval = 1; // 〇分前～現在の新着メールを取得 #--トリガーをこれに合わせておく

/**
 * LINE Messaging APIを使用してメッセージを送信する関数
 * @param {string} message - 送信するメッセージテキスト
 */
function sendLineMessage(message) {
  // メッセージが空でないか確認
  if (!message || message.trim() === "") {
    Logger.log("エラー: 空のメッセージは送信できません");
    return;
  }

  var url = "https://api.line.me/v2/bot/message/push";
  
  // デバッグ情報をログに記録
  Logger.log("送信メッセージ: " + message);
  Logger.log("送信先ユーザーID: " + USER_ID);
  
  var payload = {
    "to": USER_ID,
    "messages": [
      {
        "type": "text",
        "text": message
      }
    ]
  };
  
  var options = {
    "method": "post",
    "contentType": "application/json",
    "headers": {
      "Authorization": "Bearer " + CHANNEL_ACCESS_TOKEN
    },
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true  // 完全なエラーレスポンスを取得するため
  };
  
  try {
    var response = UrlFetchApp.fetch(url, options);
    var responseCode = response.getResponseCode();
    var responseBody = response.getContentText();
    
    Logger.log("レスポンスコード: " + responseCode);
    Logger.log("レスポンス内容: " + responseBody);
    
    if (responseCode >= 200 && responseCode < 300) {
      Logger.log("メッセージ送信成功");
    } else {
      Logger.log("メッセージ送信エラー: " + responseBody);
    }
  } catch (error) {
    Logger.log("例外発生: " + error);
  }
}

/**
 * 条件に合うメールを取得する関数
 * @return {Array} 取得したメールの情報配列
 */
function fetchContactMail() {
  // 取得間隔
  var now_time = Math.floor(new Date().getTime() / 1000); // 現在時刻を変換
  var time_term = now_time - ((300 * get_interval) + 10); // 秒にして+10秒しておく

  // 検索条件指定
  var strTerms = '(is:unread from:' + FROM + ' after:' + time_term + ')';
  Logger.log("検索条件: " + strTerms);

  // 取得
  var myThreads = GmailApp.search(strTerms);
  Logger.log("検索されたスレッド数: " + myThreads.length);
  
  var valMsgs = [];
  
  if (myThreads.length > 0) {
    // 各スレッドを直接処理
    for (var i = 0; i < myThreads.length; i++) {
      try {
        // スレッドから直接メッセージを取得 (slice[-1]の代わり)
        var messages = myThreads[i].getMessages();
        var lastMsg = messages[messages.length - 1]; // 最新のメッセージを取得
        
        // メッセージのプロパティを取得して出力
        Logger.log("メッセージID: " + lastMsg.getId());
        Logger.log("メッセージ送信者: " + lastMsg.getFrom());
        
        // 日付を適切なフォーマットで取得
        var dateObj = lastMsg.getDate();
        var dateStr = Utilities.formatDate(dateObj, Session.getScriptTimeZone(), "yyyy/MM/dd HH:mm:ss");
        Logger.log("メッセージ日付: " + dateStr);
        
        // 件名を取得
        var subjectStr = lastMsg.getSubject() || "件名なし";
        Logger.log("メッセージ件名: " + subjectStr);
        
        // メッセージテキストを作成
        var messageText = "ご主人さま、宮小学校/保育所からメールが届いたようですよ。"
                  + "\n【date】: " + dateStr
                  + "\n【Subject】: " + subjectStr;
        
        // メッセージが空でないことを確認
        if (messageText && messageText.trim() !== "") {
          valMsgs.push(messageText);
          Logger.log("メッセージ作成: " + messageText);
        } else {
          Logger.log("空のメッセージが作成されました");
        }
        
        // 以下のコメントを外すとメッセージを既読にします
        // lastMsg.markRead(); // メッセージを既読にする
      } catch (error) {
        Logger.log("メッセージ処理エラー: " + error);
      }
    }
  }

  return valMsgs;
}

/**
 * メイン実行関数
 * Google Apps Scriptのトリガーで定期実行される
 */
function main() {
  try {
    // 設定値の確認
    if (!CHANNEL_ACCESS_TOKEN || CHANNEL_ACCESS_TOKEN === "あなたのチャネルアクセストークンを入力してください") {
      Logger.log("エラー: チャネルアクセストークンが設定されていません");
      return;
    }
    
    if (!USER_ID || USER_ID === "あなたのユーザーIDを入力してください") {
      Logger.log("エラー: ユーザーIDが設定されていません");
      return;
    }
    
    Logger.log("メール取得開始");
    var new_Me = fetchContactMail();
    Logger.log("取得したメッセージ数: " + new_Me.length);
    
    if (new_Me.length > 0) {
      for (var i = new_Me.length - 1; i >= 0; i--) {
        Logger.log("メッセージ " + (i + 1) + " を送信します");
        sendLineMessage(new_Me[i]);
      }
    } else {
      Logger.log("送信するメッセージがありません");
    }
  } catch (error) {
    Logger.log("main関数でエラーが発生しました: " + error);
  }
}

/**
 * ユーザーIDを取得するための関数
 * Webhook URLを設定し、友だち追加イベントを受け取ると使用できます
 */
function doPost(e) {
  var json = JSON.parse(e.postData.contents);
  
  // イベントタイプが友だち追加の場合
  var events = json.events;
  for (var i = 0; i < events.length; i++) {
    if (events[i].type == "follow") {
      var userId = events[i].source.userId;
      Logger.log("新しいユーザーID: " + userId);
      
      // ここでユーザーIDをスプレッドシートに保存するなどの処理が可能
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({'status': 'ok'}))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * テスト用関数 - フック対象のメールが存在するか確認
 */
function testMailSearch() {
  var now_time = Math.floor(new Date().getTime() / 1000); // 現在時刻を変換
  var time_term = now_time - (300 * 24 * 60); // 過去24時間分チェック
  
  var strTerms = '(is:unread from:' + FROM + ' after:' + time_term + ')';
  Logger.log("検索条件: " + strTerms);
  
  var threads = GmailApp.search(strTerms);
  Logger.log("検索されたスレッド数: " + threads.length);
  
  if (threads.length > 0) {
    for (var i = 0; i < threads.length; i++) {
      var messages = threads[i].getMessages();
      Logger.log("スレッド " + (i + 1) + " のメッセージ数: " + messages.length);
      
      var lastMsg = messages[messages.length - 1];
      Logger.log("送信者: " + lastMsg.getFrom());
      Logger.log("件名: " + lastMsg.getSubject());
      Logger.log("日時: " + Utilities.formatDate(lastMsg.getDate(), Session.getScriptTimeZone(), "yyyy/MM/dd HH:mm:ss"));
      Logger.log("未読？: " + lastMsg.isUnread());
    }
  }
}