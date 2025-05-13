fetch('data.json') // Замените на ваш путь к JSON
    .then(function(response) {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Ошибка при загрузке данных.');
    })
    .then(function(data) {
        // Обрабатываем каждый вопрос из массива
        data.forEach((item, index) => {
            const { question, type: questionType, answers } = item;

            // Определяем тип графика
            let chartType = '';
            if (questionType === 'single' || questionType === 'text') {
                chartType = 'doughnut';
            } else if (questionType === 'multiple' || questionType === 'scale') {
                chartType = 'bar';
            }

            // Создаём контейнер для каждого графика
            createChartContainer(question, answers, chartType, index);
        });
    })
    .catch(function(error) {
        console.error('Ошибка:', error);
    });

// Функция для создания контейнера и графика
function createChartContainer(question, answers, chartType, index) {
    // Создаём контейнер для графика
    const container = document.createElement('div');
    container.classList.add('chart-container');
    container.style.marginBottom = '30px';

    // Добавляем заголовок вопроса
    const questionTitle = document.createElement('h2');
    questionTitle.textContent = question;
    container.appendChild(questionTitle);

    // Создаём элемент canvas для графика
    const canvas = document.createElement('canvas');
    canvas.id = `chart-${index}`;
    container.appendChild(canvas);

    // Добавляем контейнер на страницу
    document.body.appendChild(container);

    // Создаём график
    const ctx = canvas.getContext('2d');
    createChart(ctx, answers, chartType, question);
}

// Функция для создания графика
function createChart(ctx, answers, type, question) {
    new Chart(ctx, {
        type: type, // Используем переменную type
        data: {
            labels: answers.map(item => item.answer), // Метки оси X из JSON
            datasets: [{
                label: question, // Текст вопроса как label
                data: answers.map(item => item.count), // Данные для графика
                //backgroundColor: ['#4CAF50', '#FF5722', '#FFC107', '#2196F3', '#9C27B0'], // Цвета для столбцов
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}