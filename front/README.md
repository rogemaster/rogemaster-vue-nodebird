## vuex store
- actions
 * context, payload를 인자로 받음
 * context는 구조분해 가능
  - commit, dispatch, state, rootState, getters, rootGetters 존재

- FollowerList
 * components 를 공통으로 사용.
 * props로 event 처리.

## Tip
 - created에서 실행한 부분도 Destroy 시켜야 함. 그렇지 않으면 메모리 누수가 생김
 - fetch() : component가 마운트 되기 전에 실행
 - window 함수는 created() 함수에서 사용불가. 화면이 붙은 후 mounted 이후에서만 사용 가능
 - 화면 비율 구하는 방법
  * window.scrollY : 현재 스크롤이 있는때까지의 위에서 부터 아래 높이 
  * document.documentElement.clientHeight : 스크롤 무시하고 현 화면의 맨위부터 아래 까지의 높이
  * document.documentElement.scrollHeight : 스크롤를 최대 밑에서부터 최대 위까지 높이
  * 스크롤을 끝까지 내렸을 경우
   window.scrollY + document.documentElement.clientHeight
   === document.documentElement.scrollHeight

## 프론트 기능 개발
 - 인피니티 스크롤링
 * 문제 : 전체 게시물의 수를 모른다.
 * 스크롤을 끝까지 내리기 전에 리스트를 추가로 불러와야 함
 * 실무에서는 쓰로툴링 적용, limit 방식으로 하지 않음
 * window.scrollY + document.documentElement.clientHeight === document.documentElement.scrollHeight 를 이용하여 추가 리스트 호출

 - virtualized
 * 라이브러리: vue-virtual-scroll-list
 * 화면에 보이지 않는 데이터를 없애 버리고 id 정도만 기록해 놓고 스크롤 이동시 보여줌.
 * 직접 구현이 어려우니 라이브러리 사용을 추천
 * 벤치 데이터도 있어야 함.
 * 단점: 화면의 높이를 알아야 함.(브라우저 높이, 컨텐츠 높이 등등)

## Q&A
 - () => 와 () => ({}) 의 차이
 * () => 는 아래와 같은 return 문이다.
 * 괄호는 무제한으로 사용 가능하다.
() => { 
   return   -> 
}

* () => ({}) 객체를 괄호로 감싸는 이유는 괄호가 없을 경우 위 retrun 문과 구분이 되지 않기 때문에
() => ({      () => a
  return a ->     동일
})            

## 프론트앤드 개발자의 마인드
 - 프론트 개발자의 업무 : 쓸데 없는 서버 호출은 없어야 한다
 - 프론트앤드 해커가 되지 않아야 한다.

## 프로젝트 참고 사이트
- zeroCho vue-NodeBird github url: https://github.com/ZeroCho/vue-nodebird