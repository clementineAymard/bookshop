'use strict'

var gDisplay
const DISPLAY_KEY = 'favLayout'

function onInit() {
    renderFilterByQueryStringParams()
    renderBooks()
    renderModalByQueryStringParams()
}

function renderFilterByQueryStringParams() {
    const filterBy = {
        title: getValFromParam('title') || '',
        maxPrice: +getValFromParam('maxPrice') || 100,
        minRating: +getValFromParam('minRating') || 0,
    };
    if (!filterBy.minRating && !filterBy.maxPrice && !filterBy.title) return;

    document.querySelector('.filter-title-select').value = filterBy.title;
    document.querySelector('.filter-price-range').value = filterBy.maxPrice;
    document.querySelector('.filter-rate-range').value = filterBy.minRating;
    setBookFilter(filterBy);
}

function renderBooks() {
    var display = getDisplay();
    if (display === 'table') renderBookTable();
    else if (display === 'grid') renderBooksCards();
    // renderPagination();
}

function renderBookTable() {
    var books = getBooks()
    var strHTML = `<table>
                    <thead>
                    <tr>
                        <th class="col-id">Id</th>
                        <th class="col-title">Title</th>
                        <th class="col-price">Price</th>
                        <th class="col-actions" colspan="3">Actions</th>    
                    </tr>
                    </thead>
                    <tbody>`

    strHTML += books.map(book => `<tr>
                            <td>${book.id}</td>
                            <td>${book.name}</td>
                            <td>${book.price}</td>
                            <td>${book.rating}</td>
                            <td><button class="btn btn-read" onclick="onReadBook(${book.id})">Read</button></td>   
                            <td><button class="btn btn-update" onclick="onUpdateBook(${book.id})">Update</button></td>
                            <td><button class="btn btn-delete" onclick="onRemoveBook(${book.id})">Delete</button></td>
                        </tr>`)
                        .join('') + '</tbody></table>'

    document.querySelector('.books-container').innerHTML = strHTML
}

function renderBooksCards() {
    var books = getBooks()
    var strHtmls = books.map((book) => `
        <article class="book-preview">
            <button class="btn-remove" onclick="onDeleteBook('${book.id}')">X</button>
            <h5>${book.title}</h5>
            <h6>Price: <span>${book.price}</span>$</h6>
            <button onclick="onReadBook('${book.id}')">Details</button>
            <button onclick="onUpdateBook('${book.id}')">Update</button>
            <img title="Photo of ${book.title}" onerror="this.src='img/default.png'" src="img/${book.title}.jpeg" alt="${book.title}">
        </article>`)

    document.querySelector('.books-container').innerHTML = strHtmls.join('')
}

// // function renderPagination() {
//     const pageIdx = getPageIdx();
//     const pageCount = getPageCount();
//     var strHtml =  getPageBtnStr(pageIdx === 0,pageIdx - 1 , '◀️')
//     for (let i = 0; i < pageCount; i++) {
//         strHtml +=  getPageBtnStr( i === pageIdx,i , i+1) 
//     }
//     strHtml += getPageBtnStr(  pageIdx === pageCount - 1,pageIdx + 1 , '▶️') 
//     var elContainer = document.querySelector('.pagination');
//     elContainer.innerHTML = strHtml;
// }

function renderModalByQueryStringParams() {
    var bookId = getValFromParam('id');
    if (bookId) onReadBook(bookId);
}

function onSetFilterBy(filterBy) {
    filterBy = setBookFilter(filterBy)
    renderBooks()

    setQueryParams(filterBy)
}

function onSetSortBy() {
    const prop = document.querySelector('.sort-by').value
    const isDesc = document.querySelector('.sort-desc').checked

    const sortBy = {}
    sortBy[prop] = (isDesc) ? -1 : 1

    setBookSort(sortBy)
    renderBooks()
}
function onChangeDisplay(display) {
    gDisplay = display
    saveToStorage(DISPLAY_KEY, gDisplay)
    renderBooks()
}
//---------------------------------------------------------------------------------------------//

function onAddBook() {
    const bookName = prompt('Please enter the name of the book you want to add:')
    const bookPrice = prompt('Please enter the price of the book you want to add:')
    if (!bookName || !bookPrice) return
    addBook(bookName, bookPrice)
    renderBooks()
}

function onReadBook(id) {
    const book = getBookById(id)
    renderModal(book)
    setQueryParams({ id: book.id })
}

function renderModal(book) {
    const strHTMLs = `
        <button class="btn-close" onclick="onCloseModal()">X</button>
        <h1>Book Title : <span>${book.name}</span></h1>
        <h2>id: ${book.id}</h2>
        <div class="price-modal">Price : $<span>${book.price}</span></div>
        <div class="img-modal">Book Preview : <img src="${book.imgUrl}" onerror="this.src='img/default.png'" alt="${book.name} preview"></div>
        <div class="rating"><button onclick="onChangeRating(event, ${book.id}, 1)">-</button>${book.rate}<button onclick="onChangeRating(event, ${book.id}, 1)">+</button></div>
        `
    document.querySelector('.modal-read').innerHTML = strHTMLs
    document.querySelector('.modal-read').style.visibility = 'visible'
}

function onCloseModal() {
    deleteQueryParam('id');
    document.querySelector('.modal-read').style.visibility = 'hidden'
}

function onChangeRating(ev, bookId, param) {
    ev.preventDefault();
    var bookId = getValFromParam('id');
    changeRating(bookId, param)
    renderBooks()
    renderModal(getBookById(bookId))
}

function onUpdateBook(id) {
    const book = getBookById(id);
    var newPrice = +prompt('Price?', book.price);
    if (!newPrice || book.price === newPrice) return
    updateBook(id, newPrice)
    renderBooks()
}

function onRemoveBook(id) {
    removeBook(id)
    renderBooks()
}

//-------------------------------------------------------------------------------------------------------------------------//

function onNextPage() {
    nextPage()
    renderBooks()
}
function onPrevPage() {
    prevPage()
    renderBooks()
}
