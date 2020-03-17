(function () {
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'
  const data = []
  const searchForm = document.getElementById('search')
  const searchInput = document.getElementById('search-input')
  const dataPanel = document.getElementById('data-panel')
  const viewMode = document.getElementById('view-mode')
  const paginaiton = document.getElementById('pagination')
  let currentPage = 1
  let currentMode = 0
  const ITEM_PER_PAGE = 12

  searchForm.addEventListener('submit', event =>{ //表單資料被傳送時觸發
    event.preventDefault()
    let input = searchInput.value
    // let results = data.filter(movie => movie.title.toLowerCase().includes(input))
    // console.log(results)
    
    let results = []
    const regex = new RegExp(searchInput.value, 'i')
    results = data.filter(movie => movie.title.match(regex))
    console.log(results)
    // displayDataList(results)
    getTotalPages(results)
    getPageData(currentPage,results,currentMode)
  })

  axios.get(INDEX_URL).then((response) => {
    data.push(...response.data.results)
    // displayDataList(data)
    getTotalPages(data)
    getPageData(currentPage,data,0)
  }).catch((err) => console.log(err))

  viewMode.addEventListener('click', (event) => {
    if (event.target.matches('#list-mode')){
      currentMode = 1
      getPageData(currentPage,data,currentMode)
    } 
    else if(event.target.matches('#card-mode')){
      currentMode = 0
      getPageData(currentPage,data,currentMode)
    }
  })

  // listen to data panel
  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      showMovie(event.target.dataset.id)
    }else if(event.target.matches('.btn-add-favorite')){
      addFavoriteItem(event.target.dataset.id)
    }
  })

  function listData (data){
    let htmlContent = ''
    data.forEach(function(item,index){
      htmlContent += `
      <div class="col-12">
        <hr>
        ${item.title}
        <button class="ml-2 btn pull-right btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
        <button class="btn pull-right btn-info btn-add-favorite" data-id="${item.id}">+</button>
      </div>
      `
    })
    dataPanel.innerHTML = htmlContent
  }

  function displayDataList (data) {
    let htmlContent = ''
    data.forEach(function (item, index) {
      htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h5 class="card-title">${item.title}</h5>
            </div>

            <!-- "More" button -->
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      `
    })
    dataPanel.innerHTML = htmlContent
  }

  function showMovie (id) {
    // get elements
    const modalTitle = document.getElementById('show-movie-title')
    const modalImage = document.getElementById('show-movie-image')
    const modalDate = document.getElementById('show-movie-date')
    const modalDescription = document.getElementById('show-movie-description')

    // set request url
    const url = INDEX_URL + id
    console.log(url)

    // send request to show api
    axios.get(url).then(response => {
      const data = response.data.results
      console.log(data)

      // insert data into modal ui
      modalTitle.textContent = data.title
      modalImage.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`
      modalDate.textContent = `release at : ${data.release_date}`
      modalDescription.textContent = `${data.description}`
    })
  }
  function addFavoriteItem(id){
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = data.find(item => item.id === Number(id))

    if(list.some(item => item.id === Number(id))){
      alert(`${movie.title} is already in your favorite list.`)
    } else {
      list.push(movie)
      alert(`Added ${movie.title} to your favorite list!`)
    }
    localStorage.setItem('favoriteMovies',JSON.stringify(list))
    console.log(list)
  }

  let paginationData = []
  function getPageData (pageNum, data, mode) {
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)

    if(mode === 0) displayDataList(pageData)
    else{listData(pageData)}
  }

  function getTotalPages (data){
      let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
      let pageItemContent = ``
      for(let i=0; i<totalPages; i++){
          pageItemContent += `
          <li class = "page-item">
              <a class="page-link" href="javascript:;" data-page="${i+1}">${i+1}</a>
          </li>
          `
      }
      paginaiton.innerHTML = pageItemContent
  }

  
  pagination.addEventListener('click', event => {
    console.log(event.target.dataset.page)
    if (event.target.tagName === 'A') {
      currentPage = event.target.dataset.page
      getPageData(currentPage,data,currentMode)
    }
  })



})()
