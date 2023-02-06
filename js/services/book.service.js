'use strict'

const STORAGE_KEY = 'booksDB'
var gBooks

const PAGE_SIZE = 4
var gPageIdx = 0

var gFilterBy = {name: '', maxPrice: 1000, minRating: 0 }

// localStorage.clear()
_createBooks()

function _createBooks() {
    var books = loadFromStorage(STORAGE_KEY)

    if (!books || !books.length) {
        books = [
            _createBook('Tanach', 26),
            _createBook('Siddour', 18),
            _createBook('Talmud', 555),
            _createBook('Hinouh', 55),
            _createBook('Michna', 120)
        ]
    }
    gBooks = books
    saveBooksToStorage()
}

function saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}

function _createBook(name, price) {
    return {
        id: makeId(),
        name,
        price,
        imgUrl: '',
        rate: 0
    }
}

function addBook(name, price) {
    var newBook = _createBook(name, price)
    gBooks.push(newBook)
    saveBooksToStorage()
    return newBook
}

function changeRating(bookId, param) {
    const book = getBookById(bookId)
    if (book.rate + param < 0 || book.rate + param > 10) return
    book.rate += param

    saveBooksToStorage()
    return book
}

function updateBook(bookId, newPrice) {
    const book = getBookById(bookId)
    book.price = newPrice
    saveBooksToStorage()
    return book
}

function removeBook(bookId) {
    var idx = gBooks.findIndex(book => book.id === +bookId)
    gBooks.splice(idx, 1)
    if (gPageIdx + 1 > getPageCount()) gPageIdx--
    saveBooksToStorage()
}

function getBookById(bookId) {
    var bookIdx = gBooks.findIndex(book => bookId === +book.id)
    return gBooks[bookIdx]
}

function getDisplay() {
    if (!gDisplay) gDisplay = loadFromStorage(DISPLAY_KEY) || 'table';
    return gDisplay;
}

function getBooks() {
    var books = getFilteredBooks()
    const startIdx = gPageIdx * PAGE_SIZE
    books = books.slice(startIdx, startIdx + PAGE_SIZE)
    return books
}

function getFilteredBooks() {
    // console.log(gBooks)
    
    var books=  gBooks.filter((book) => {
        return (
        book.price <= gFilterBy.maxPrice &&
        book.rate >= gFilterBy.minRating &&
        book.name.includes(gFilterBy.name) 
    )})
        // console.log(books)
        return books
}

function setBookFilter(filterBy) {
    if (filterBy.title !== undefined) gFilterBy.title = filterBy.title;
    else if (filterBy.maxPrice !== undefined) gFilterBy.maxPrice = +filterBy.maxPrice
    else if (filterBy.minRating !== undefined) gFilterBy.minRating = +filterBy.minRating;
    return gFilterBy
}

function setBookSort(sortBy = {}) {
    if (sortBy.price !== undefined) {
        gBooks.sort((b1, b2) => (b1.price - b2.price) * sortBy.price)
    } else if (sortBy.rate !== undefined) {
        gBooks.sort((b1, b2) => (b1.rate - b2.rate) * sortBy.rate)
    }
}

function getPageIdx() {
    return gPageIdx;
}

function getPageCount() {
    var books = getFilteredBooks();
    return Math.ceil(books.length / PAGE_SIZE);
}

function nextPage() {
    gPageIdx++
    if (gPageIdx * PAGE_SIZE >= gBooks.length) {
        gPageIdx = 0
    }
}

function prevPage(){
    gPageIdx--
    if (gPageIdx * PAGE_SIZE <= 0) {
        gPageIdx = 0
    }
}