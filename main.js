// api : 3kuPZHI0QFA2W3JFflmZezQxiKlQzLcbFCWaNQtd9iQ
// js에서 api부르는 함수
// url 준비->헤더 준비->서버에 요청->데이터 보여짐.
// 뉴스 뽑아내기(보여주기) let news [] = articles

let news = [];
let menus = document.querySelectorAll(".menus button");

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
    let response = await fetch(url, { headers: header }); // 데이터를 보내는 방식 fetch 하지만 아직 데이터가 안와서 await로 기다려준다
    let data = await response.json(); // response 응답객체와 세트 (json : 서버통신에서 많이쓰이는 자료형 타입)
    // 에러가 발생하면  articles 키 자체가 없어지므로 if 조건을 통해 에러 핸들링을 해준다.
    if (response.status === 200) {
      if (data.total_hits === 0) {
        // total_hits 데이터 즉 찾은 몇개의 데이터 값이 0이므로 에러메시지 발생.
        throw new Error("검색된 결과 값이 없습니다.");
      }
      news = data.articles;
      console.log(news);
      render();
      // render ui에 뿌려진 뉴스를 호이스팅을 이용해 호출한다.
    } else {
      throw new Error(data.message); // throw 강제 에러 메세지 발생
    }
  } catch (error) {
    errorRender(error.message);
  }
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
