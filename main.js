// api : 3kuPZHI0QFA2W3JFflmZezQxiKlQzLcbFCWaNQtd9iQ
// js에서 api부르는 함수
// url 준비->헤더 준비->서버에 요청->데이터 보여짐.
// 뉴스 뽑아내기(보여주기) let news [] = articles
import "regenerator-runtime";

let news = [];
let menus = document.querySelectorAll(".menus button");
let page = 1;
let totalPages = 0;

let searchEl = document.querySelector(".search"); // 돋보기 모양 클릭 변수
let searchInputEl = document.getElementById("search-input");

// 돋보기 모양 포커스
searchEl.addEventListener("click", () => {
  searchInputEl.focus();
});

searchInputEl.addEventListener("focus", () => {
  searchEl.classList.add("focused"); // classList 특정 요소에 클래스 정보를 가지고 있는 객체에 add하겠다.
  searchInputEl.setAttribute("placeholder", "영화를 검색하세요."); // setAttribute : html에 어떤 태그 속성을 지정하겠다.
});

searchInputEl.addEventListener("blur", () => {
  // focus 해제 blur
  searchEl.classList.remove("focused"); // classList 특정 요소에 클래스 정보를 가지고 있는 객체에 add하겠다.
  searchInputEl.setAttribute("placeholder", ""); // setAttribute : html에 어떤 태그 속성을 지정하겠다.
});

// foreach 를 통한 각각 메뉴 에다가 아이템을 준다 메뉴 반복
menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByTopic(event))
);
// 검색 버튼 클릭 변수
let searchButton = document.getElementById("search-button");
let url; // url 지역변수 대신 전역변수 선언

//  getNews  뉴스 부르는 메인 header 페이지 부분
const getNews = async () => {
  // 에러 핸들링 try
  try {
    let header = new Headers({
      "x-api-key": "3kuPZHI0QFA2W3JFflmZezQxiKlQzLcbFCWaNQtd9iQ",
    });
    // 첫번째 페이지로 고정되어 있는 url을 다음페이지로 넘겨 주는 작업
    url.searchParams.set("page", page); //&page_size=10 정적인 값이 아닌 동적인 값으로 변환 &page=page

    let response = await fetch(url, { headers: header }); // 데이터를 보내는 방식 fetch 하지만 아직 데이터가 안와서 await로 기다려준다
    let data = await response.json(); // response 응답객체와 세트 (json : 서버통신에서 많이쓰이는 자료형 타입)
    // 에러가 발생하면  articles 키 자체가 없어지므로 if 조건을 통해 에러 핸들링을 해준다.
    if (response.status === 200) {
      if (data.total_hits === 0) {
        // total_hits 데이터 즉 찾은 몇개의 데이터 값이 0이므로 에러메시지 발생.
        throw new Error("검색된 결과 값이 없습니다.");
      }
      news = data.articles; // 뉴스 데이터 정보
      totalPages = data.totalPages; // 총 페이지 데이터 정보
      page = data.page; // 각 페이지 데이터 정보
      console.log(news);
      render();
      pageNation();
      // render ui에 뿌려진 뉴스를 호이스팅을 이용해 호출한다.
    } else {
      throw new Error(data.message); // throw 강제 에러 메세지 발생
    }
  } catch (error) {
    errorRender(error.message);
  }
};
// 페이지 네이션 함수 pageNation
// 1. total_page : 15개 (api를 호출하면 토탈페이지도 같이 준다.)
// 2. page별 그룹 나누기 1~5, 6~10 , 11~15 ( 12을 선택햇을때 12/5 나머지는 3 / 결론은 math.ceil(page/5)) 배열 올림 함수 이용
// 3. page정보 기준으로 내가 몇번째 그룹인지 확인
// 4. 그 그룹의 첫번째(마지막 - 4)와 마지막(그룹숫자 + 5) 페이지를 확인.
// 5. 첫번째 ~ 마지막 페이지 까지 그려준다(for문 이용)
// 1. 총 토탈 페이지수 알아야 한다.
// 2. 내가 현재 어떤 페이지를 보고 있는지
// 3. 페이지 그룹을 찾아야 한다. 그 그룹의 베이스로 마지막 페이지와 첫번째 페이지 찾기
// 4. 첫번째 페이지 ~ 마지막 페이지 프린트

const pageNation = () => {
  // 페이지 숫자(li)태그들을 담아줄 변수 선언
  let pageNationHTML = ``;
  // pageGroup pageGroup 은 배열이다.
  let pageGroup = Math.ceil(page / 5);
  // last page
  let last = pageGroup * 5;
  // first page
  let first = last - 4;

  // 페이지 이동 첫번째 화살표 표시 onclick="moveToPage(${i-1})"
  if (first >= 6) {
    pageNationHTML = `  <li class="page-item">
  <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${
    first - 1
  })">
    <span aria-hidden="true">&lt;&lt</span>
  </a>
</li> <li class="page-item">
  <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${
    page - 1
  })">
    <span aria-hidden="true">&lt;</span>
  </a>`;
  }
  for (let i = first; i <= last; i++) {
    //  pageNationHTML += -> pageNationHTML = pageNationHTML + 페이지(li) 태그
    pageNationHTML += `<li class="page-item ${
      page == i ? "active" : "" //페이지 active 효과 삼항 연산자 이용 ${page == i ? "active" : ""}
    }"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`;
    // 페이지 버튼 클릭시 페이지 이동 onclick 이벤트 속성 부여 moveToPage(${i}) 몇번째 페이지 클릭했는데 매개변수${i}로 받아준다.
  }
  // 페이지 이동 마지막 화살표 표시
  if (last <= last) {
    pageNationHTML += `
</li> <li class="page-item">
  <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${
    page + 1
  })">
    <span aria-hidden="true">&gt;</span>
  </a>
</li><li class="page-item">
<a class="page-link" href="#" aria-label="Next"onclick="moveToPage(${
      last + 1
    })">
  <span aria-hidden="true">&gt;&gt</span>
</a>`;
  }
  document.querySelector(".pagination").innerHTML = pageNationHTML;
};

// 페이지 버튼 클릭 이동 moveToPage()
// 1. 이동하고 싶은 페이지를 알아야 된다.
// 2. 이동하고 싶은 페이지를 가지고 api을 다시 호출 한다
const moveToPage = (pageNumber) => {
  page = pageNumber;
  getNews();
};

// 메인 뉴스 페이지
const getElNews = () => {
  // js url 클래스
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=sport&page_size=10`
  );
  getNews();
};

// 각 메뉴들을 클릭 했을때 페이지 종류별로 페이지를 가져온다.
// articles 뽑아주기
const getNewsByTopic = (event) => {
  console.log("클릭", event.target.textContent);
  let topic = event.target.textContent.toLowerCase();
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`
  );
  getNews();
};

// 검색 버튼 함수
const getNewsByKeyword = async () => {
  // 1. 검색 키워드 읽어오기
  // 2. url에 검색 키워드 입력하기
  // 3. 헤더준비
  // 4. url 부르기
  // 5.데이터 가져오기
  // 6.데이터 보여주기

  // 1. input에 있는 키워드 불러오기 id(search-input)복사해서 가져온다 뒤에 .value(값)을 붙여준다
  let keyword = document.getElementById("search-input").value;
  url = new URL(
    `https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=10`
  );
  getNews();
};

// textContent : 태그 안에 있는 내용만 가지고 온다.
// for문 대신 array 배열(news) map을 사용하여 새로운 배열데이터를 html에 뿌려준다.
// toLowerCase() : 소문자로 변경해주는 함수
const render = () => {
  let newsHTMl = "";
  newsHTMl = news
    // newsHTMl = news 여기서의 news 배열 그자체이고, .map((item)에 있는 news는 각각의 배열 아이템들 이다.
    .map((item) => {
      return `<div class="news-list">
    <div class="img-area">
      <img
        src="${item.media}"
        alt=""
      />
    </div>
    <div class="text-area">
      <h2>${item.title}</h2>
      <p>${
        item.summary == null || item.summary == ""
          ? "내용없음"
          : item.summary.length > 200
          ? item.summary.substring(0, 200) + "..."
          : item.summary
      }</p>
      <div>${item.rights} * ${item.published_date}</div>
    </div>
  </div>`;
    })
    .join("");
  // news는 배열데이터라 ui에(콤마)가 보인다 .join('')를 이용해 배열->string으로 바꿔 콤마표시를 제거해준다.
  // ${news.media} : ui에 고정된 이미지 글들을 문자보간 방식으로 api에서 꺼내와 변경해준다.
  document.getElementById("header-board").innerHTML = newsHTMl;
};
// 에러 핸들링을 통해 잡힌에러를 ui에 보여주는 함수
const errorRender = (message) => {
  let errorHTML = `<div class="alert alert-danger text-center" role="alert">${message}
  A simple danger alert—check it out!
</div>`;
  document.getElementById("header-board").innerHTML = errorHTML;
};

// 화살표 함수 사용시 호이스팅이 안되기 때문에 searchButton을 아래쪽으로 이동해주었다.
searchButton.addEventListener("click", getNewsByKeyword);
getElNews();
