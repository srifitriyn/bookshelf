const STORAGE_KEY = "MyBookshelf";
const bookList = [];
const RENDER_EVENT = 'render-bookList';
const SAVED_EVENT = 'saved-bookList';
const form = document.getElementById('add-book-form');

document.addEventListener('DOMContentLoaded', function() {
    const submitForm = document.getElementById('form-container');
    submitForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addUncompleteBook();
    });
    if (isStorageExist()) {
        loadDataFromStorage();
    }
})

// sidebar open-close
let closeButton = document.querySelector('#menu-button');
let sideBar = document.querySelector('.sidebar');
let logo = document.querySelector('.logo');
let addButtonClosed = document.querySelector('.add-book-closed');
let profilUser = document.querySelector('.profile-user');
let addButton = document.querySelector('.add-book');
let unreadBookNav = document.querySelector('.unread-books');
let readBookNav = document.querySelector('.read-books');
function menuBtnChange() {
    if(sideBar.classList.contains('open')){
        closeButton.classList.replace('bx-menu', 'bx-menu-alt-right');
    } else {
        closeButton.classList.replace('bx-menu-alt-right','bx-menu');
    }
};
closeButton.addEventListener('click', ()=>{
    sideBar.classList.toggle('open');
    logo.classList.toggle('open');
    addButtonClosed.classList.toggle('open');
    profilUser.classList.toggle('open');
    addButton.classList.toggle('open');
    unreadBookNav.classList.toggle('open');
    readBookNav.classList.toggle('open');
    menuBtnChange();
});

// add form book pop up
let addBookForm = document.getElementById('add-book-form');
let addBookButtonClosed = document.getElementById('add-book-closed');
let addBookButtonOpen = document.getElementById('add-book');
let closeBookButton = document.getElementById('form-close-button')
addBookButtonClosed.addEventListener('click', ()=> {
    addBookForm.classList.toggle('open-popup');
});
addBookButtonOpen.addEventListener('click', ()=> {
    addBookForm.classList.toggle('open-popup');
});
closeBookButton.addEventListener('click', ()=> {
    addBookForm.classList.remove('open-popup')
});

// filter page
const tabs = document.querySelector('.tabs');
const panels = document.querySelectorAll('.panel');
const tabUncomplete = document.querySelector('.tabs li:nth-child(1)');
const tabComplete = document.querySelector('.tabs li:nth-child(2)');
const panelArray = Array.from(panels);
tabs.addEventListener('click', (e)=> {
    const targetPanel = document.querySelector(e.target.dataset.target);
    if (e.target.tagName == 'LI'){
        panelArray.forEach((panel)=>{
            if(panel == targetPanel){
                panel.classList.add('active');
                panel.classList.remove('active');
            }
        });
    }
});
function tabFunctionUncomplete() {
    tabUncomplete.classList.add('active');
    tabComplete.classList.remove('active');
};
function tabFunctionComplete(){
    tabUncomplete.classList.remove('active');
    tabComplete.classList.add('active');
};

// add belum-selesai book
function bookContain(title, author, year){
    const textTitle = document.createElement('.book-name');
    textTitle.innerText = title;
    const textAuthor = document.createElement('.book-author');
    textAuthor.innerText = author;
    const textYear = document.createElement('.book-year');
    textYear.innerText = year;
    const bookContainer = document.createElement('div');
    bookContainer.classList.add('books-container');
    bookContainer.append(textTitle, textAuthor, textYear);
    return bookContainer;
}

function addUncompleteBook(){
    const unCompleteBooks = document.getElementById('one');
    const title = document.getElementById('book-title').value;
    const author = document.getElementById('book-author').value;
    const year = document.getElementById('book-year').value;
    const bookList = bookContain(title, author, year);
    unCompleteBooks.append(bookList);
}