const LoadForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const booksContainer = document.getElementById('books-container');
const statusMessage = document.getElementById('status-message');

LoadForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const query = searchInput.value.trim();
  if (!query) return;

  statusMessage.textContent = 'Загрузка...';
  booksContainer.innerHTML = '';

  try {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`);
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      statusMessage.textContent = 'Книги не найдены.';
      return;
    }

    statusMessage.textContent = '';
    renderBooks(data.items);
  } catch (error) {
    console.error(error);
    statusMessage.textContent = 'Произошла ошибка при загрузке данных.';
  }
});

function renderBooks(books) {
  books.forEach(book => {
    const info = book.volumeInfo;

    const card = document.createElement('div');
    card.className = 'book-card';

    const title = info.title || 'Без названия';
    const authors = info.authors ? info.authors.join(', ') : 'Автор не указан';
    const description = info.description || 'Нет описания';
    const thumbnail = info.imageLinks?.thumbnail || 'https://via.placeholder.com/150x220?text=No+Cover';

    card.innerHTML = `
      <img src="${thumbnail}" alt="${title}">
      <div class="book-title">${title}</div>
      <div class="book-author">${authors}</div>
      <div class="book-description">${description.substring(0, 200)}...</div>
    `;

    booksContainer.appendChild(card);
  });
}