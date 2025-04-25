document.getElementById('addQuestionBtn').addEventListener('click', function() {
    const questionsContainer = document.getElementById('questionsContainer');

    // Создаем новый контейнер для вопроса
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question');

    // Поле для текста вопроса
    const questionLabel = document.createElement('label');
    questionLabel.textContent = "Текст вопроса:";
    const questionInput = document.createElement('input');
    questionInput.type = 'text';
    questionInput.name = 'questionText';
    questionInput.required = true;

    // Тип вопроса (выпадающий список)
    const questionTypeLabel = document.createElement('label');
    questionTypeLabel.textContent = "Тип вопроса:";
    const questionTypeSelect = document.createElement('select');
    questionTypeSelect.name = 'questionType';
    questionTypeSelect.innerHTML = `
        <option value="text">Ответ текстом</option>
        <option value="multiple">Множественный выбор</option>
        <option value="single">Один выбор</option>
        <option value="scale">Шкала от 1 до 10</option>
    `;

    // Поле для вариантов ответа (появляется в зависимости от типа вопроса)
    const answerFieldDiv = document.createElement('div');
    answerFieldDiv.classList.add('answerField');

    // Обработчик изменений типа вопроса
    questionTypeSelect.addEventListener('change', function() {
        const selectedType = questionTypeSelect.value;
        answerFieldDiv.innerHTML = '';  // Очищаем предыдущие поля

        if (selectedType === 'text') {
            // const textarea = document.createElement('textarea');
            // textarea.placeholder = 'Введите ваш ответ';
            // answerFieldDiv.appendChild(textarea);
        } else if (selectedType === 'multiple') {
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'Введите варианты через запятую';
            answerFieldDiv.appendChild(input);
        } else if (selectedType === 'single') {
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'Введите варианты через запятую';
            answerFieldDiv.appendChild(input);
        } else if (selectedType === 'scale') {
            // const input = document.createElement('input');
            // input.type = 'number';
            // input.placeholder = 'Оценка от 1 до 10';
            // input.min = 1;
            // input.max = 10;
            // answerFieldDiv.appendChild(input);
        }
    });

    // Добавление элементов в контейнер
    questionDiv.appendChild(questionLabel);
    questionDiv.appendChild(questionInput);
    questionDiv.appendChild(questionTypeLabel);
    questionDiv.appendChild(questionTypeSelect);
    questionDiv.appendChild(answerFieldDiv);
    questionsContainer.appendChild(questionDiv);
});

const createSurveyBtn = document.getElementById('createSurveyBtn');

createSurveyBtn.addEventListener('click', function() {
    //event.preventDefault();


    const surveyTitle = document.getElementById('surveyTitle').value;
    const questionsContainer = document.getElementById('questionsContainer');
    const questionDivs = questionsContainer.querySelectorAll('.question');

    if (!surveyTitle) {
        alert('Пожалуйста, введите название опроса.');
        return;
    }
    if (questionDivs.length === 0) {
        alert('Пожалуйста, добавьте хотя бы один вопрос.');
        return;
    }
    // Проверка на наличие текста вопроса
    for (let i = 0; i < questionDivs.length; i++) {
        const questionText = questionDivs[i].querySelector('input[name="questionText"]').value;
        if (!questionText) {
            alert(`Пожалуйста, введите текст для вопроса ${i + 1}.`);
            return;
        }
    }


    const surveyData = {
        name: surveyTitle,
        description: "Описание опроса",
        count_questions: questionDivs.length,
        questions: []
    };
    questionDivs.forEach((questionDiv, index) => {
        const questionText = questionDiv.querySelector('input[name="questionText"]').value;
        const questionType = questionDiv.querySelector('select[name="questionType"]').value;
        const answerField = questionDiv.querySelector('.answerField');

        const questionData = {
            id: index + 1,
            type: questionType,
            question: questionText,
            required: true,
        };

        //для вопросов с ответами
        if (questionType === 'multiple' || questionType === 'single') {
            const optionsInput = answerField.querySelector('input[type="text"]');
            if (optionsInput) {
                const options = optionsInput.value.split(',').map(option => option.trim());
                questionData.options = options;

            }
        

            // if (questionType === 'multiple') { для ограничение по количеству ответов
        }        
            
            if (questionType === 'scale') {
                questionData.scale_min = 1;
                questionData.scale_max = 10;
            }
            // if (questionType === 'text') {
            //     questionData.answer_type = 'text';
            // }

            surveyData.questions.push(questionData);
        
    })
const surveyJSON = JSON.stringify(surveyData, null, 2);
console.log(surveyJSON);

fetch("http://api:8080/survey", {
    method: 'POST',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json'
    },
    body: surveyJSON

})
.then(response => {
    if  (response.ok) {
        return response.json();
    }
    if (response.status === 204){
        console.log('CORS preflight прошел успешно');
        return {};
    }
    else {
        throw new Error('Ошибка при создании опроса');
    }
})
.then(data => {
    console.log('Успешно создано:', data);
    alert('Опрос успешно создан!');
    window.location.href = "/index.html"; // Перенаправление на главную страницу через 3 секунды

})
.catch(error => {
    console.error('Ошибка:', error);
    alert('Произошла ошибка при создании опроса.');
});
});



