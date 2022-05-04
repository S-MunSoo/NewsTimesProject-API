// api : 3kuPZHI0QFA2W3JFflmZezQxiKlQzLcbFCWaNQtd9iQ
// js에서 api부르는 함수
// url 준비->헤더 준비->서버에 요청->데이터 보여짐.
// 뉴스 뽑아내기(보여주기) let news [] = articles

let news = [];

const getElNews = async () => {
  // js url 클래스
  let url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=sport&page_size=10`
  );
  let header = new Headers({
    "x-api-key": "3kuPZHI0QFA2W3JFflmZezQxiKlQzLcbFCWaNQtd9iQ",
  });
  let response = await fetch(url, { headers: header }); // 데이터를 보내는 방식 fetch 하지만 아직 데이터가 안와서 await로 기다려준다
  let data = await response.json(); // response 응답객체와 세트 (json : 서버통신에서 많이쓰이는 자료형 타입)
  news = data.articles;
  console.log(news);

  render(); // render ui에 뿌려진 뉴스를 호이스팅을 이용해 호출한다.
};
// for문 대신 array 배열(news) map을 사용하여 새로운 배열데이터를 html에 뿌려준다.
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
getElNews();
