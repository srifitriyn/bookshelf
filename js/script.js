const STORAGE_KEY = "MyBookshelf";
const books = [];
const form = document.getElementById('form-container');

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
let closeBookButton = document.getElementById('form-close-button');
let homeSection = document.querySelector('.home-section');
const header = document.getElementById("title-form");
const saveButton = document.getElementById("form-submit-button");
addBookButtonClosed.addEventListener('click', ()=> {
    addBookForm.classList.add('open-popup');
    homeSection.classList.add('blur');
    header.textContent = "Tambah Buku";
    saveButton.textContent = "Tambah";
    
});
addBookButtonOpen.addEventListener('click', ()=> {
    addBookForm.classList.add('open-popup');
    homeSection.classList.add('blur');
    header.textContent = "Tambah Buku";
    saveButton.textContent = "Tambah";
});
closeBookButton.addEventListener('click', ()=> {
    addBookForm.classList.remove('open-popup');
    homeSection.classList.remove('blur');
    form.reset();
});

document.addEventListener('DOMContentLoaded', function() {
    const activeTab = localStorage.getItem('activeTab') || 'panel_one';
    renderBooks(activeTab);
    const tabs = document.querySelector('.tabs');
    tabs.addEventListener('click', function(e) {
        if (e.target.tagName === 'LI') {
            const targetTab = e.target;
            setActiveTab(targetTab);
            const targetPanel = targetTab.dataset.target;
            renderBooks(targetPanel);
        }
    });
});

// filter page
const setActiveTab = (tab) => {
    const allTabs = document.querySelectorAll('.tabs li');
    allTabs.forEach(tab => tab.classList.remove('active'));
    tab.classList.add('active');
}

// submit form
form.addEventListener('submit', function(event) {
    event.preventDefault();
    getStoredBooks();
    if (isEditMode) {
        editBook();
    } else {
        addBook();
    }
    form.reset();
});
const renderBooks = (tab) => {
    const defaultPage = document.getElementById('default-page')
    const booksContainer = document.getElementById('content-container');
    booksContainer.innerHTML = '';
    const storedBooks = getStoredBooks();
    if (!storedBooks || storedBooks.length === 0) {
        defaultPage.innerHTML = `
            <img src="assets/warn icon.svg" alt="" width="30px">
            <div class="default-page-text">Kamu belum menambahkan buku.</div>
        `;
        defaultPage.style.display = 'flex';
        return; 
    }
    if (storedBooks && storedBooks.length > 0) {
        const filteredBooks = storedBooks.filter(book => {
            if (tab === 'panel_one') {
                return !book.isDone; 
            } else if (tab === 'panel_two') {
                return book.isDone;
            }
        });

        if (filteredBooks.length > 0) {
            filteredBooks.forEach((book) => {
                const bookElement = document.createElement('div');
                bookElement.classList.add('books-container');
                bookElement.innerHTML = `
                    <div class="book-details">
                        <div class="book-name">${book.title}</div>
                        <div class="book-author">${book.author}</div>
                        <div class="book-year">${book.year}</div>
                    </div>
                    <div class="icons">
                        <img class='delete-icon' src="assets/trash icon.svg" alt="Hapus">
                        <img class='edit-icon' src="assets/edit icon.svg" alt="Edit">
                        ${book.isDone ? '' : `<img src="assets/checklist icon.svg" alt="Selesai" class="complete-icon">`}
                    </div>
                `;
                booksContainer.appendChild(bookElement);
                defaultPage.style.display = 'none';
                setTimeout(() => {
                    bookElement.classList.add('show')
                }, 10);
                const deleteIcon = bookElement.querySelectorAll('.delete-icon');
                const editIcon = bookElement.querySelectorAll('.edit-icon');
                deleteIcon.forEach((icon) => {
                    icon.addEventListener('click', () => {
                        deleteBook(book);
                        renderBooks(tab);
                    })
                })
                editIcon.forEach((icon) => {
                    icon.addEventListener('click', () => {
                        editBook(book, tab);
                    })
                })

                // if (!book.isDone) {
                //     completeIcon.addEventListener('click', () => {
                //         // Handle complete action
                //     });
                // }
                // completeIcon.addEventListener('click', () => {

                // })
            });
        } else {
            defaultPage.innerHTML = `
            <img src="assets/warn icon.svg" alt="" width="30px">
            <div class="default-page-text">Kamu belum menambahkan buku.</div>
            `;
            defaultPage.style.display = 'flex';
        }
    }
}
const deleteBook = (book) => {
    const storedBooks = getStoredBooks() || [];
    const updatedBooks = storedBooks.filter((storedBook) => storedBook.idBook !== book.idBook);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBooks));
    const booksContainer = document.getElementById('content-container');
    const bookElements = booksContainer.querySelectorAll('.books-container');
    bookElements.forEach((element) => {
        const elementId = element.dataset.idBook;
        if (elementId === book.idBook) {
            element.remove();
        }
    })
};
let isEditMode = false;
const editBook = (book, tab) => {
    const bookId = book.idBook;
    const title = document.getElementById("book-title");
    const author = document.getElementById("book-author");
    const year = document.getElementById("book-year");
    const isDone = document.getElementById("selesai-baca");
    
    title.value = book.title;
    author.value = book.author;
    year.value = book.year;
    isDone.checked = book.isDone;

    addBookForm.classList.add('open-popup');
    homeSection.classList.add('blur');
    header.textContent = "Edit Buku";
    saveButton.textContent = "Simpan";

    saveButton.addEventListener('click', () => {
        const storedBook = getStoredBooks() || [];
        const updatedBooks = storedBook.map((bookItem) => {
            if (bookItem.idBook === bookId) {
                return {
                    ...bookItem,
                    title: title.value,
                    author: author.value,
                    year: year.value,
                    isDone: isDone.checked,
                }
            }
            return bookItem;
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBooks));
        renderBooks(tab);
        setTimeout(() => {
            addBookForm.classList.remove('open-popup');
            homeSection.classList.remove('blur');
        }, 50);
        isEditMode = false;
    });
};
const getStoredBooks = () => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : [];
}
const addBook = () => {
    const idBook = `book_${Date.now()}`;
    const title = document.getElementById("book-title").value;
    const author = document.getElementById("book-author").value;
    const year = document.getElementById("book-year").value;
    const isDone = document.getElementById("selesai-baca").checked;
    const bookObject = {idBook, title, author, year, isDone};
   
    const headerContent = document.getElementById('title-form').textContent;
    if (headerContent === "Edit Buku") {
        editBook(bookObject);
    } else {
        if (isDone) {
            addBookToPanel(bookObject, 'two');
        } else {
            addBookToPanel(bookObject, 'one');
        }
        isDone.checked = false;
        const activeTab = document.querySelector('.tabs li.active');
        const currentPanel = activeTab ? activeTab.dataset.target : 'panel_one';

        renderBooks(currentPanel);
        addBookForm.classList.remove('open-popup');
        homeSection.classList.remove('blur');
    }
}
const addBookToPanel = (book, panelId) => {
    const storedBooks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    storedBooks.push(book);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedBooks));
    renderBooks(panelId);
};