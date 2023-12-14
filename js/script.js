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
    header.innerHTML = "Tambah Buku";
    saveButton.innerHTML = "Tambah";
    
});
addBookButtonOpen.addEventListener('click', ()=> {
    addBookForm.classList.add('open-popup');
    homeSection.classList.add('blur');
    header.innerHTML = "Tambah Buku";
    saveButton.innerHTML = "Tambah";
});
closeBookButton.addEventListener('click', ()=> {
    addBookForm.classList.remove('open-popup');
    homeSection.classList.remove('blur');
    form.reset();
});

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    const activeTab = localStorage.getItem('activeTab') || 'panel_one';
    renderBooks(activeTab);
    countBooks();
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
    countBooks();
    if (isEditMode) {
        editBook();
    } else {
        addBook();
    }
    form.reset();
});

// Render Book or Default Page
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
                return !book.isComplete; 
            } else if (tab === 'panel_two') {
                return book.isComplete;
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
                        ${book.isComplete ? `<img class='restore-icon' src="assets/restore icon.png" alt="Selesai" class="complete-icon">` : `<img class='complete-icon' src="assets/checklist icon.svg" alt="Selesai" class="complete-icon">`}
                    </div>
                `;
                booksContainer.appendChild(bookElement);
                defaultPage.style.display = 'none';

                const deleteIcon = bookElement.querySelectorAll('.delete-icon');
                const editIcon = bookElement.querySelectorAll('.edit-icon');
                const restoreIcon = bookElement.querySelectorAll('.restore-icon');
                const completeIcon = bookElement.querySelectorAll('.complete-icon');
                deleteIcon.forEach((icon) => {
                    icon.addEventListener('click', () => {
                        deleteAlert(book);
                    });
                });
                editIcon.forEach((icon) => {
                    icon.addEventListener('click', () => {
                        editBook(book, tab);
                    });
                });
                restoreIcon.forEach((icon) => {
                    icon.addEventListener('click', () => {
                        restoreBook(book, tab);
                    });
                });
                completeIcon.forEach((icon) => {
                    icon.addEventListener('click', () => {
                        completeBook(book, tab);
                    });
                });
            });
        } else {
            defaultPage.innerHTML = `
            <img src="assets/warn icon.svg" alt="" width="30px">
            <div class="default-page-text">Kamu belum menambahkan buku.</div>
            `;
            defaultPage.style.display = 'flex';
        }
    }
    countBooks();
}

// Delete book
const deleteAlert = (book, tab) => {
    const bookId = book.idBook;
    const deleteModal = document.getElementById("delete-modal");
    const backButton = document.getElementById('back-button');
    const deleteButton = document.getElementById('delete-button');
    deleteModal.classList.add('open-popup')
    backButton.addEventListener('click', () => {
        deleteModal.classList.remove('open-popup')
    })
    deleteButton.addEventListener('click', () => {
        const storedBooks = getStoredBooks() || [];
        const updatedBooks = storedBooks.filter((storedBook) => storedBook.idBook !== bookId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBooks));
        const booksContainer = document.getElementById('content-container');
        const bookElements = booksContainer.querySelectorAll('.books-container');
        bookElements.forEach((element) => {
            const elementId = element.dataset.idBook;
            if (elementId === bookId) {
                element.remove();
            }
        });
        renderBooks(tab);
        countBooks();
        deleteModal.classList.remove('open-popup')
    });
}

//Edit book
let isEditMode = false;
const editBook = (book, tab) => {
    const bookId = book.idBook;
    const title = document.getElementById("book-title");
    const author = document.getElementById("book-author");
    const year = document.getElementById("book-year");
    const isComplete = document.getElementById("selesai-baca");
    
    title.value = book.title;
    author.value = book.author;
    parseInt(year.value, 10) = book.year;
    isComplete.checked = book.isComplete;

    addBookForm.classList.add('open-popup');
    homeSection.classList.add('blur');
    header.innerHTML = "Edit Buku";
    saveButton.innerHTML = "Simpan";

    saveButton.addEventListener('click', () => {
        const storedBook = getStoredBooks() || [];
        const updatedBooks = storedBook.map((bookItem) => {
            if (bookItem.idBook === bookId) {
                return {
                    ...bookItem,
                    title: title.value,
                    author: author.value,
                    year: year.value,
                    isComplete: isComplete.checked,
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
    countBooks();
};

// Restore book from done to undone
const restoreBook = (book, tab) => {
    const bookId = book.idBook;
    const storedBook = getStoredBooks() || [];
    const filteredBooks = storedBook.filter(bookItem => bookItem.idBook !== bookId);
    const updateItem = {
        ...book,
        isComplete: false
    }
    const updatedBooks = [...filteredBooks, updateItem]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBooks));
    renderBooks(tab);
    countBooks();
}

// Move book from undone to done
const completeBook = (book, tab) => {
    const bookId = book.idBook;
    const storedBook = getStoredBooks() || [];
    const filteredBooks = storedBook.filter(bookItem => bookItem.idBook !== bookId);
    const updateItem = {
        ...book,
        isComplete: true
    }
    const updatedBooks = [...filteredBooks, updateItem]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBooks));
    renderBooks(tab);
    countBooks();
}

// Get book data from local storage
const getStoredBooks = () => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : [];
}

// Add book to local storage
const addBook = () => {
    const idBook = `book_${Date.now()}`;
    const title = document.getElementById("book-title").value;
    const author = document.getElementById("book-author").value;
    const year = parseInt(document.getElementById("book-year").value, 10);
    const isComplete = document.getElementById("selesai-baca").checked;
    const bookObject = {idBook, title, author, year, isComplete};
   
    const headerContent = document.getElementById('title-form').textContent;
    if (headerContent === "Edit Buku") {
        editBook(bookObject);
    } else {
        if (isComplete) {
            addBookToPanel(bookObject, 'two');
        } else {
            addBookToPanel(bookObject, 'one');
        }
        isComplete.checked = false;
        const activeTab = document.querySelector('.tabs li.active');
        const currentPanel = activeTab ? activeTab.dataset.target : 'panel_one';

        renderBooks(currentPanel);
        addBookForm.classList.remove('open-popup');
        homeSection.classList.remove('blur');
    };
    countBooks();
}

// Add book to panel
const addBookToPanel = (book, panelId) => {
    const storedBooks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    storedBooks.push(book);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedBooks));
    renderBooks(panelId);
};

// Count unread and read books
const countBooks = () => {
    const storedBook = getStoredBooks() || [];
    const unreadTotal = storedBook.filter(bookItem => !bookItem.isComplete).length;
    const readTotal = storedBook.filter(bookItem => bookItem.isComplete).length;
    const unreadBooks = document.getElementById('count-unread');
    const readBooks = document.getElementById('count-read');
    if (unreadTotal > 0) {
        unreadBooks.innerHTML = unreadTotal;
    } else {
        unreadBooks.innerHTML = 0;
    }
    if (readTotal > 0) {
        readBooks.innerHTML = readTotal;
    } else {
        readBooks.innerHTML = 0;
    }
}

// Search books by name, author, or year
const search = document.getElementById('search');
search.addEventListener('input', handleSearch);
function handleSearch() {
    const searchTerm = search.value.toLowerCase();
    const storedBooks = getStoredBooks() || [];
    if (searchTerm === '' && storedBooks.length === 0) {
        renderBooks();
    } else if (searchTerm === '' && storedBooks.length > 0) {
        const activeTab = document.querySelector('.tabs li.active');
        const currentPanel = activeTab ? activeTab.dataset.target : 'panel_one';
        const defaultPage = document.getElementById('default-page');
    const contentContainer = document.getElementById('content-container');
        renderBooks(currentPanel);
        defaultPage.style.display ='none';
        contentContainer.style.display = 'grid';
    } else {
        searchResult(searchTerm);
    }
}
function searchResult(searchTerm) {
    const storedBooks = getStoredBooks() || [];
    const filteredBooks = storedBooks.filter(bookItem => {
        const titleMatch = bookItem.title.toLowerCase().includes(searchTerm);
        const authorMatch = bookItem.author.toLowerCase().includes(searchTerm);
        const yearMatch = bookItem.year.toLowerCase().includes(searchTerm);
        return titleMatch || authorMatch || yearMatch;
    });
    const activeTab = document.querySelector('.tabs li.active');
    const currentPanel = activeTab ? activeTab.dataset.target : 'panel_one';
    const defaultPage = document.getElementById('default-page');
    const contentContainer = document.getElementById('content-container');
    if (filteredBooks.length > 0) {
        renderBooks(currentPanel, filteredBooks);
        defaultPage.style.display = 'none';
        contentContainer.style.display = 'grid';
    } else {
        defaultPage.innerHTML = `
            <img src="assets/warn icon.svg" alt="" width="30px">
            <div class="default-page-text">Buku tidak ditemukan. Coba cari lagi, ya.</div>
        `;
        defaultPage.style.display = 'flex';
        contentContainer.style.display = 'none';
    }
}