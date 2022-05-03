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
};
getElNews();
