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

* sequelize를 글로벌로 설치할 경우 package에 기록이 남지 않아 다른 사람이 프로젝트를
  받았을 경우 전혀 알수 없음.