## usage
yarn install
yarn start

server會開在localhost:4000

## code
整個都是用websocket
在client.on("message", incoming...)裡處理各式各樣前端送來的訊息

1. 註冊
public/index.html  line 31-42
src/server.js      line 83-103
按下註冊鍵之後，
前端會送 ['SIGN_UP', {name, email, password}] 給後端，後端看到'SIGN_UP'之後，就會拿前端送來的資料去db創建一個user，
成功之後再回送['SIGN_UP', 'User created']給前端

2. 登入
public/index.html  line 44-54
src/server.js      line 105-132
按下登入鍵之後，
前端會送 ['SIGN_IN', {email, password}] 給後端，後端看到'SIGN_IN'之後，會根據信箱去db找user存不存在，再用密碼確定可不可以登入
成功登入之後回送['SIGN_IN','Login success!!']給前端

3. 狀態
每開一個網頁完成登入之後就會打開一個wss client，client.status初始都是'lobby'，代表正在等待配對，等到有第二個人登入之後client.status就會變成'ingame'\
這時候後端會送一個['WAITING', {client, clients}]，我做index.html沒有用到這個，不過可以拿來做些你想做的東西

4. error
只要後端遇到任何error，都會送一個['ERROR', error_message]給前端，error_message代表發生什麼錯誤
種類有： 'User already exists!!'、'User does not exist!!'、'Wrong password!!'、'Not your turn!'、'This line is full!'

5. 開始遊戲
public/index.html  line 90-105
src/matching.js    line 36-43
湊滿兩個user之後後端會對每個client送['START',new_game]給前端代表遊戲開始了，new_game就是空的棋盤包括盤面、users...的內容

6. 下棋
public/index.html  line 63-69
src/server.js      line 146-193
在前端的按隨便一排都會讓他降到那排的最下面，前端會送['PLACE', {col, row}]給後端，row其實不重要，因為都會降到最下面，
後端收到之後根據按的人、按的位置、按的棋盤狀況處理完之後，如果有error就看第四點，如果一切順利的話，
就會根據下那一步的結果送['PLACE', game]（代表沒有結束，game代表下完之後遊戲的狀況）
或是送['END', [game, winner]]（代表遊戲結束，game是遊戲最後的樣子，winner有'w'、'b''tie'三種，分別代表白贏黑贏或平手）給前端
前端再根據type跟data做相對應的處理






