// !Main функция для работы 
function handleFormSubmit(event){
  event.preventDefault()

  let danyeForSerializeForm=serializeForm(applicantForm)
  let zn=danyeForSerializeForm[0]
  let newId=danyeForSerializeForm[1]
  CreateHabit(zn,newId)

  event.target.reset()
}

// !Получение данных из таблицы
function serializeForm(formNode){
  let newId=StaticID()-1
  const {elements}=formNode
  const data={}

  Array.from(elements).forEach((element)=>{
    if (element.name){
      data[element.name]=element.value
    }
  })
  data.status=false
  saveLocalStorage(data,newId)
  return [data,newId]
}

// !Статическая переменная для Айди Привычки
function CalculatingStaticID(){
  let counter=0;
  return function(){
    counter+=1;
    return counter;
  }
}
let StaticID=CalculatingStaticID()

// !Создание Привычки (DOM)
function CreateHabit(zn,newId){
  let mainZn=zn.main
  let descriptionZn=zn.description
  let status=zn.status

  // ?div
  let fullTrakerItem=document.createElement('li')
  fullTrakerItem.id=`li${newId}`
  
  // ?CheckBox
  const CheckTrakerItem=document.createElement('input')
  CheckTrakerItem.type='checkbox'
  CheckTrakerItem.checked=zn.status
  CheckTrakerItem.id=`checkbox${newId}`

  // ?Название и дополнение
  let newTrakerItem=document.createElement('div')
  newTrakerItem.classList.add('TrakerItem')
  
  if (descriptionZn){
    newTrakerItem.textContent=`${mainZn} - ${descriptionZn}`
  }else{
    newTrakerItem.textContent=`${mainZn}`
  }
  TrakerList.appendChild(fullTrakerItem)

  const info = document.createElement('div');
  info.classList.add('info-actions');

  fullTrakerItem.appendChild(info)
  info.appendChild(CheckTrakerItem)
  info.appendChild(newTrakerItem)

  // ?Удалить
  const actions = document.createElement('div');
  actions.classList.add('habit-actions');

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '🗑';
  deleteBtn.className = 'delete-btn';
  deleteBtn.id=`deleteBtn${newId}`

  actions.appendChild(deleteBtn);
  fullTrakerItem.appendChild(actions);

  if (status) {
    fullTrakerItem.style.backgroundColor = '#45a049';
  }

}


const TrakerList=document.getElementById('habit-list')
const applicantForm=document.getElementById('habit-form')
applicantForm.addEventListener('submit',handleFormSubmit)


// !Удаление функции
TrakerList.addEventListener('click', function (event) {
  const target = event.target;
  const regex = /^deleteBtn(\d+)$/;

  if (target.id && regex.test(target.id)) {
    const match = target.id.match(regex);
    const index = match[1];
    const li = document.getElementById(`li${index}`);
    const idKey = `id${index}`;

    if (li) {
      li.remove(); 
      delete massivLocalSave[idKey]; 
      localStorage.setItem('save', JSON.stringify(massivLocalSave)); 
    } 
  }
});


// !Отметить выполненое
TrakerList.addEventListener('change',function(event){
  const target = event.target;
  const regex = /^checkbox(\d+)$/;

  if (target.id && regex.test(target.id)){
    const match = target.id.match(regex)
    const index = match[1];
    const note = document.getElementById(`li${index}`)
    const idKey = `id${index}`;
    if (target.checked) {
      note.style.backgroundColor = '#45a049';
      massivLocalSave[idKey].status = true;
    } else {
      note.style.backgroundColor = ''; 
      massivLocalSave[idKey].status = false;
    }
    localStorage.setItem('save', JSON.stringify(massivLocalSave))
  }
})


//  !Функция при обновлении сайта, которая делает подргуз всех данных
function loadHabitsFromStorage() {
  for (let key in massivLocalSave) {
    if (massivLocalSave.hasOwnProperty(key)) {
      const habitData = massivLocalSave[key];
      const id = key.replace('id', ''); // убираем "id" из ключа
      CreateHabit(habitData, id);
    }
  }
}



// !Создание записи

function saveLocalStorage(object={},key){
  let id=`id${key}`
  massivLocalSave[id]=object
  console.log(id ,typeof(massivLocalSave))
  return localStorage.setItem('save', JSON.stringify(massivLocalSave))
  
}

let massivLocalSave = JSON.parse(localStorage.getItem('save')) || {};
window.addEventListener('DOMContentLoaded', loadHabitsFromStorage);

