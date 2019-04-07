const React = {
  createElement(tag,props,childs){      
      const htmlElement = document.createElement(tag);        
      // прокидаємо props
      if (props) {
          Object.keys(props).forEach((item)=>{
              typeof(props[item])!=='object'
                  ?htmlElement[item]=props[item]
                  :(Object.keys(props[item]).forEach((it)=>{htmlElement[item][it]=props[item][it]}))
          })
      }        
      // append childs
      if (typeof(childs)!=='undefined'){ 
          Array.isArray(childs)
              ?childs.forEach((child)=>{
                  typeof(child)==='object'
                      ?htmlElement.appendChild(child)
                      :htmlElement.appendChild(document.createTextNode(child));
              })
              :typeof(childs)==='object'
                  ?htmlElement.appendChild(childs)
                  :htmlElement.appendChild(document.createTextNode(childs));
      }
      return htmlElement ;    
  },
  render(ch,par){
      par.innerHTML='';
      par.appendChild(inputSearch);
      par.appendChild(ch);
  }
}

//сторінка з фільмами (1)
async function mainPage(search){
let data;
!search
  ?await fetch('https://api.themoviedb.org/3/trending/movie/week?api_key=b94083b0255a4374153531dcdbb9fee3')
    .then((res) => res.json())
    .then((json) => {
        data = json.results;
    })
  :await fetch(`https://api.themoviedb.org/3/search/movie?api_key=b94083b0255a4374153531dcdbb9fee3&language=en-US&query=${search}&page=1&include_adult=false`)
    .then((res) => res.json())
    .then((json) => {
        data = json.results;
    });
const main =            
  React.createElement('ul',undefined,
    data.map(it=>React.createElement('li',undefined,
       React.createElement('a',{href:'#',onclick:()=>{filmPage({
          id: `${it.id}`, 
          img: it.poster_path,
          title: it.title,
          overview: it.overview
       })}}
       ,it.title)
    ))
  )
React.render(
  main,
  document.getElementById('root')
)
}

//сторінка фільму(3,4)
async function filmPage(props){
let recomend;
await fetch(`https://api.themoviedb.org/3/movie/${props.id}/recommendations?api_key=b94083b0255a4374153531dcdbb9fee3`)
  .then((res)=>res.json())
  .then((json)=> recomend= json.results)
const moive= React.createElement('div',undefined,[
  React.createElement('img',{width:"420",src:`https://image.tmdb.org/t/p/original${props.img}`}),
  React.createElement('h1',undefined,props.title),
  React.createElement('p',undefined,props.overview),
  React.createElement('h2',undefined,'Recomendations'),
  React.createElement('ul',undefined,
    recomend.map((it)=>(
      React.createElement('li',undefined,
        React.createElement('a',{href:'#'},it.title)
      )                 
    ))
  )            
])
React.render(
  moive,
  document.getElementById('root'),
);
}     

//function onchange
function onChangeInput(){
valueInput= document.getElementById('input').value;  
}

// search input (2)
let valueInput
const inputSearch=  React.createElement('div',undefined,[
React.createElement('input',{placeholder:"Movie name",id:'input', onchange:onChangeInput}),
React.createElement('button',{onclick:()=>mainPage(valueInput)},'search')
])

mainPage();


