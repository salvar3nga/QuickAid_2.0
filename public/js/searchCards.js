const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const extraSearch = document.getElementById('extra-search');
const cards = document.querySelectorAll('.searchable-card');


searchButton.addEventListener('click', () => {

  search();
});

search();


function search(){
  searchInput.addEventListener("keyup", (evt)=>{
  
    const searchValue = evt.target.value.toLowerCase();
    const cards = document.querySelectorAll('.searchable-card');

    // if(searchValue!= ''){
    //   extraSearch.classList.remove('visually-hidden'); 

    // }else if(searchValue==''){
    //   extraSearch.classList.add('visually-hidden');
      
      
    // }

    cards.forEach(card=>{
        card.style.display= "none";
        if(card.innerText.toLowerCase().indexOf(searchValue) > -1){
          card.style.display= "";
        }

      })
    })

}
