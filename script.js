const form = document.querySelector('.todo__form');
const filter = document.querySelector('[data-filter="filter"]');
const data = []

filter.addEventListener('click', () => {
    const menu = document.querySelector('.todo__menu');
    const menuLinks = document.querySelectorAll('.todo__menu-link');
    menu.classList.toggle('active');

    menuLinks.forEach(item => {
        item.addEventListener('click', (e) => {
            const atr = e.target.getAttribute('data-filter');


            menuLinks.forEach(item => item.classList.remove('active'))
            item.classList.add('active');
            menu.classList.remove('active')

            sortSelect(atr)
        })
    });
})

form.addEventListener('submit', function (e) {
    e.preventDefault()

    const input = document.querySelector('.todo__field');
    const btnAdd = document.querySelector('.todo__add');

    if (input.value === '') {
        return false
    }

    if (btnAdd.getAttribute('data-status') === 'true') {

        data.forEach((item, index) => {

            if (item.edit === true) {
                const time = new Date();

                item.edit = 'false';
                item.text = input.value;
                input.value = '';
                data[index].lastChange = time.getHours() + ':' + time.getMinutes()

                addToDom();
            }
        });
        btnAdd.dataset.status = 'false'
    } else {
        const obj = {
            id: +new Date,
            text: input.value,
            checked: false,
            edit: false,
            lastChange: false
        };

        data.push(obj);
        addToDom();
        input.value = '';

    }

})

function sortSelect(mode) {
    if (mode === 'new') {
        data.sort((a, b) => a.id - b.id);
        console.log(data);
        addToDom()
    } else if (mode === 'old') {
        data.sort((a, b) => b.id - a.id);
        console.log(data);
        addToDom()
    } else {
        data.forEach((item, index) => {
            if (item.checked) {
                data.unshift(data.splice(index, 1)[0])
            }
        })
        addToDom()
    }
}

function addToDom() {
    const todoList = document.querySelector('.todo__list');
    todoList.innerHTML = ''
    data.forEach(item => {
        const li = createItem(item.id, item.text, item.checked, item.lastChange);
        console.log(li);
        todoList.append(li)
    })
}


function createItem(id, text, checked, lastChange) {

    const li = document.createElement('li');
    li.className = 'todo__item';
    li.setAttribute('data-id', id);
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo__checkbox';
    checkbox.checked = checked;
    if (checkbox.checked) {
        li.classList.add('checked-item')
    }
    const label = document.createElement('label');
    label.append(checkbox)
    const span = document.createElement('span');
    label.append(span)
    span.textContent = text;
    const btnEdit = document.createElement('button');
    btnEdit.className = 'todo__edit';
    btnEdit.textContent = 'Изменить';
    const btnDelete = document.createElement('button');
    btnDelete.className = 'todo__delete';
    btnDelete.textContent = 'Удалить';
    const date = document.createElement('span');
    date.className = 'todo__date'
    if (lastChange) {
        date.textContent = `Изменено ${lastChange}`
    }

    li.append(label);
    li.append(btnEdit);
    li.append(btnDelete);
    li.append(date)

    btnDelete.addEventListener('click', () => {
        deleteItem(id)
    })
    btnEdit.addEventListener('click', () => {
        editItem(id)
    });
    checkbox.addEventListener('click', () => {
        checkedItem(id)
    })



    return li;

}

function deleteItem(id) {
    data.forEach((item, index) => {
        if (+item.id === +id) {
            data.splice(index, 1);
        }
    })
    addToDom()
}

function editItem(id) {
    const input = document.querySelector('.todo__field');
    const btnAdd = document.querySelector('.todo__add');
    btnAdd.setAttribute('data-status', 'true')
    data.forEach((item, index) => {
        if (+item.id === +id) {
            input.value = item.text
            data[index].edit = true;
        }
    })
}

function checkedItem(id) {
    data.forEach((item, index) => {
        if (+item.id === +id) {
            data[index].checked = !data[index].checked
        }
    })
    addToDom()
}