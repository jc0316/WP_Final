Web Programming 109-2 Final Project
===

## 如何在 localhost 安裝之詳細步驟

  * **開一個terminal，cd到wp1092/final/WP_Final**
  
  * **安裝環境**
  ```
    yarn
  ```
  * **在WP_Final底下設定.env裡的參數**
  ```
  MONGO_URL=xxx
  PORT=4000
  ```
  * **在WP_Final底下執行**
  ```
  yarn start
  ```
  到此已經可以開始測試
  
## 如何在 localhost 測試之詳細步驟
  * 打開兩個localhost:4000，各稱作**c1**跟**c2**
    ，畢竟是對戰遊戲，所以需要開兩個
  * 還沒有帳號所以申請兩個
    * 在**c1**按signin底下的**Don't have an account? Sign Up**
    * **分別在firstname, lastname, Email Address, password輸入名、姓、信箱、密碼**
    
      方便起見給兩組資訊，這裡輸入第一組
      ```
      [player, 1, player1@ntu.edu.tw, 123456]
      [player, 2, player2@ntu.edu.tw, 123456]
      ```
    * **按下Register**，會成功註冊並返回登入頁面
    * **接著換c2，重複上面的步驟**，換成第二組資訊
  * 有了帳號密碼之後就登入
    * **c1的Email address打上player1@ntu.edu.tw，password打上123456**
    * **c2的Email address打上player2@ntu.edu.tw，password打上123456**
    * 登入成功之後會進到等待配對的頁面，等別人進來
    * 登入失敗則會跳登入失敗的通知
  * 遊戲介面
    * 左上角是自己，左下角是對手
    * 玩家卡裡顯示紅/黃方、名字以及平均勝率...等等資訊
    * 測試一般遊戲步驟，**因為設定一步只能花15秒，所以這部分盡量快一些**：
      * **c1按棋盤任一地方**，一顆紅棋會掉到那排最下面
      * **c2按棋盤那顆紅棋的旁邊**，一顆黃棋會掉到那邊
      * **c1按隨便一顆紅棋，c2按隨便一顆黃棋**
      * **c1按隨便一顆紅棋，c2按隨便一顆黃棋**
      * **c1按隨便一顆紅棋**，這時候因為勝利條件已經達到，c1會顯示victory，c2會顯示defeat
    * 接下來測試登出跟新遊戲的功能
      * **c1按LOGOUT**，會跳回登入頁面
      * **c2按NEW GAME**，會進到配對頁面
      * 回到c1，**Email address打上player1@ntu.edu.tw，password打上123456**
      * **按下signin**，會進到配對頁面，並很快配到剛剛已經在等的player2
    * 這場遊戲測一些錯誤訊息跟投降的功能
      * **c1按隨便一排**，會跳出這回合不是輪到你的通知
      * **c2按隨便一排**，**c1按同一排**
      * **c2按同一排**，**c1按同一排**
      * **c2按同一排**，**c1按同一排**
      * **c2按同一排**，會跳出這排已經滿了的通知
      * 既然滿了，那就投降吧
      * **c2按玩家卡上的QUIT**，會看到cancel跟confirm選項，cancel是放棄投降，confirm是直接投降
      * **c2按confirm**，c2會直接跳到登入頁面，c1會跳到victory的頁面
    * 接下來測超時的功能
      * 接續上一場的結果(c2回到登入頁面)
      * **c2在Email address打上player2@ntu.edu.tw，password打上123456**
      * 按下signin，進到配對頁面
      * **c1按NEWGAME**，進到配對頁面，並很快配到剛剛已經在等的player2
      * c2這邊放滿15秒，就會顯示defeat的頁面，同時c1顯示victory。
# 測試到此結束
