# FirstKitchen - 점주용 POS 

[FirstKitchen 배달앱 Git 보러가기](https://github.com/pyun0825/first_kitchen)

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

[Blog 보러가기](https://velog.io/@www8989/AWS-lambda)

<br>

POS server 실행시 setEndTime(lambda function)이 작동. 

setEndTime은 POS server로부터 각 store의 autoEndTime을 받아옴.

그 후 동적으로 autoEndStore(lambda function)에 EventBridge trigger들을 연결.

해당 시간이되면 autoEndStore가 POS server로 post 요청을 보내 해당 store 자동마감.


<br><br>


<img src="/img/6.PNG" width="937" height="400">

<br><br>

## 💡 getAllStore API issue

배달앱 사용자 설정 배송지 3km 이내 가게들만 조회하게 하는 API

[Blog 보러가기](https://velog.io/@www8989/getAllStore-%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98-issue)

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

<br>

### 매출달력

<img src="/img/7.PNG" width="232" height="409">

<br>

### 매출분석

<img src="/img/8.PNG" width="232" height="409">

<br>

### 영업분석

<img src="/img/9.PNG" width="232" height="409">

<br>

### 상품분석

<img src="/img/10.PNG" width="232" height="409">

<br>

### 고객분석

<img src="/img/11.PNG" width="232" height="409">

<br><br>

## 💡 Database

<img src="/img/5.png" width="1000" height="781">

## ⚙ Technical Features 
- JWT Token 사용해서 보안 강화 
- Login 인증번호 sms 구현, cafe24 API 
- AWS lambda 를 사용한 serverless server: 자동 마감 시스템
