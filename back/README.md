## Backend
 - 프론트와 백엔드의 통신은 하나의 규격으로 정의됨 -> http

## http
 - http method
 * GET: 가져오다
 * POST: 생성하다
 * PUT: 전체 수정
 * PATCH: 부분 수정
 * EDLETE: 삭제
 * OPTIONS: 찔러보기
 - request(요청) / response(응답)
 - http - port: 80
 - https - port: 443

## 시퀄라이저(sequelize)
 - Javascript로 sql을 표현할 수 있음

## 프로젝트 대표 설치 라이브러리 설명
- 시퀄라이저(sequelize): Javascript로 sql을 표현
- mysql2: node와 mysql을 연결 하기 위한 라이브러리
- sequelize-cli: 개발 모드에서 이용하길 위해 설치
- passport passport-local 로그인 관련 라이브러리

* sequelize를 글로벌로 설치할 경우 package에 기록이 남지 않아 다른 사람이 프로젝트를
  받았을 경우 전혀 알수 없음.

## Access-Control-Allow-Origin 에러
 - 해결방법 : 서버에서 프론트 주소를 허용해 줘야함.
 - Access-Control-Allow-Origin 을 heder에 심어줘야 함.
 * 이 프로젝트에서는 미들웨어를 사용. npm i cors 사용

## 암호화 방법
 - bcrypt
 - scrypt
 - pbkdf2

## models
 # associate
  - db 테이블들 간의 관계를 나타냄
  - 관계의 종류
   * 1:1 (hasOne, belongsTo)
   * 1:다 (hasMany, belongsTo)
   * 다:다 (belongsToMany)
   * belongsTo: 사용자 id 를 자동생성 해줌
   * hasMany: 자동생성 되는 항목은 없으나 양방향으로 데이터를 불러 올수 있음
 
 # sequelize.define
  - 생성 테이블 이름 앞글자 대문자로 작성: ex) Post / User
  - 테이블 생성시 소문자로 생성됨: ex) posts / users

 # next
  - 인수가 없을 경우 다음 미들웨어로 넘어가라는 의미
  - 인수가 있을 경우 에러 처리로 넘어가라는 의미

 # exports
  - 객체 형태
  - exports === {};
  - module.exports가 exports 보다 우선권이 있어서 같이 쓰는 순간 module.exports가 덮어 씌워 버린다.
  - module.exports, exports 쓰는 방법이 다름

 # Image
  - 이미지는 json 형식이 아니므로 form 데이터로 보냄
  - single: 파일 하나
  - array: 같은 키로 여러 개
  - fields: 다른 키로 여러 개
  - none: 파일 업로드 x

 # multer