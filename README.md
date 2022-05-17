# FirstKitchen - 점주용 POS 

[FirstKitchen 배달앱](https://github.com/pyun0825/first_kitchen)

<br>

### 📌 Development Environment 
>  **Front-end** 
> - JavaScript
> 
> **Back-end** 
> - Node.js
> - MySQL, Sequelize
> 
> **DevOps**
> - AWS lambda 
> - API gateway, EventBridge

</br><br>

## 💡 Introduction
공유주방에서 쓰일 POS를 웹 앱으로 제작

<br><br>

## 💡 Lambda

server 실행시 setEndTime(lambda function)이 trigger되어 

동적으로 autoEndStore(lambda function)에 EventBridge trigger들을 생성하여 연결한다.

cron에 의해서 해당 시간이되면 autoEndStore 함수가 pos server로 post 요청을 보내어 

해당 store를 자동마감시킨다.


<br><br>


<img src="/img/6.PNG" width="937" height="400">

<br><br>

## 💡 Demo

### 홈 화면
<img src="/img/1.PNG" width="232" height="409">

배달앱에서 주문한 내역을 Status에 따라 표시

Click을 통해 Status 변경 가능

<br>


### 결제 내역(1)

<img src="/img/2.PNG" width="232" height="409">

각 내역 클릭 시 아래 팝업창이 생김

<br>

### 결제 내역(2)

<img src="/img/3.PNG" width="232" height="409">

환불처리 가능(PG 시스템과 연동 예정)

<br>

### 영업 시작/마감
<img src="/img/4.PNG" width="232" height="409">

<br><br>

## 💡 Database

<img src="/img/5.png" width="1000" height="781">

## ⚙ Technical Features 
- JWT Token 사용해서 보안 강화 
- Socket.io 사용해서 실시간 통신(예정)
- AWS lambda 를 사용한 serverless server: 자동 마감 시스템
