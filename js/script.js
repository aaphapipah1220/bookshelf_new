const bookshelf = [];
const RENDER_EVENT = 'render-todo';
const SAVED_EVENT = 'saved-todo';
const STORAGE_KEY = 'BOOKSHELF_APPS';

function generateId() {
    return +new Date();
}

function generateTodoObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete
    }
}

function findBook(bookId) {
    for (const bookItem of bookshelf) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    for (const index in bookshelf) {
        if (bookshelf[index].id === bookId) {
            return index;
        }
    }

    return -1;
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(bookshelf);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            bookshelf.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {
    const textTitle = document.createElement('h2');
    textTitle.innerText = bookObject.title;

    const textPenulis = document.createElement('p');
    textPenulis.innerText = bookObject.author;

    const textYear = document.createElement('p');
    textYear.innerText = bookObject.year;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textPenulis, textYear);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `book-${bookObject.id}`);

    if (bookObject.isComplete) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');

        undoButton.addEventListener('click', function () {
            undoTaskFromCompleted(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');

        trashButton.addEventListener('click', function () {
            removeTaskFromCompleted(bookObject.id);
        });

        container.append(undoButton, trashButton);
    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');

        checkButton.addEventListener('click', function () {
            addTaskToCompleted(bookObject.id);
        });

        const trash = document.createElement('button');
        trash.classList.add('trash-button');

        trash.addEventListener('click', function () {
            removeTaskFromCompleted(bookObject.id);
        });

        container.append(checkButton, trash);
    }

    return container;
}

function addBook() {
    const textBook = document.getElementById('title').value;
    const textAuthor = document.getElementById('penulis').value;
    const yearBook = document.getElementById('year').value;

    const generatedID = generateId();
    const bookObject = generateTodoObject(generatedID, textBook, textAuthor, yearBook, false);
    bookshelf.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function addTaskToCompleted (bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeTaskFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    bookshelf.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoTaskFromCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

// START JAVASCRIPT
document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('form');

    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();

        document.getElementById('title').value = '';
        document.getElementById('penulis').value = '';
        document.getElementById('year').value = '';
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener(SAVED_EVENT, () => {
    console.log('Data berhasil di simpan,');
});
// END JAVASCRIPT

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedTODOList = document.getElementById('belum-di-baca');
    uncompletedTODOList.innerHTML = '';

    const completedTODOList = document.getElementById('di-baca');
    completedTODOList.innerHTML = '';

    for (const bookItem of bookshelf) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isComplete)
            uncompletedTODOList.append(bookElement);
        else
            completedTODOList.append(bookElement);
    }
});





