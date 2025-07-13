const form=document.getElementById('search-form')
const formInput=document.getElementById('search-input')
const statusMessage=document.getElementById('status-message')
const booksContainer=document.getElementById('books-container')

form.addEventListener('submit',async (event)=>{
    event.preventDefault()

    const formData=new FormData(form)
    const search=formData.get('search')
    form.reset();


    let dotCount=0
    const loadingInterval=setInterval(()=>{
        dotCount=(dotCount+1)%4
        statusMessage.textContent='Загрузка'+'.'.repeat(dotCount)
        },500)

    try{
        const result=await fetch(`https://www.googleapis.com/books/v1/volumes?q=${search}`)
        const data=await result.json()

        if (!data.items || data.items.length===0){
            statusMessage.textContent='Книги Не найдены'
            return
        }
        const delay= setTimeout(()=>{
            clearInterval(loadingInterval)
            statusMessage.textContent=''
            renderBooks(data.items)
        },300)
    } catch(error){
        console.error(error)
        statusMessage.textContent = 'Произошла ошибка при загрузке данных.';
    }
})


function renderBooks(books) {
    booksContainer.innerHTML = '';

    books.forEach(book => {
        const info = book.volumeInfo;
        const title = info.title || 'Без названия';
        const authors = info.authors ? info.authors.join(', ') : 'Автор не указан';
        const description = info.description || 'Описание отсутствует';
        const thumbnail = info.imageLinks?.thumbnail || 'https://via.placeholder.com/150x220?text=No+Image';
        const link=info.canonicalVolumeLink

        const card = document.createElement('div');
        card.className = 'book-card';

        card.innerHTML = `
            <a href="${link}" target="_blank">
            <img src="${thumbnail}" alt="${title}">
            <div class="book-title">${title}</div>
            <div class="book-author">${authors}</div>
            <div class="book-description">${description.slice(0, 200)}...</div>
        `;

        booksContainer.appendChild(card);
        console.log(book)
    });
}
