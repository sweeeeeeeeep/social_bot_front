// Получаем ID из URL
const urlParams = new URLSearchParams(window.location.search);
const surveyId = urlParams.get('id');

// Проверяем, если ID существует
if (surveyId) {
    // Делаем запрос к серверу, чтобы получить данные для этого опроса
    fetch("/api/survey/${surveyId}", {
        method: "GET",
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Ошибка при загрузке данных опроса.");
        }
        return response.json();
    })
    .then(surveyData => {
        // Отображаем данные опроса на странице
        document.title = surveyData.name; // Устанавливаем название страницы как название опроса
        const chartContainer = document.querySelector('.chart');

        // Отображаем график для каждого вопроса
        surveyData.questions.forEach((item, index) => {
            const { question, type: questionType, answers } = item;

            // Определяем тип графика
            let chartType = '';
            if (questionType === 'single' || questionType === 'text') {
                chartType = 'doughnut';
            } else if (questionType === 'multiple' || questionType === 'scale') {
                chartType = 'bar';
            }

            // Создаём контейнер для графика
            createChart(question, answers, chartType, index);
        });
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert("Ошибка при загрузке данных опроса.");
    });
} else {
    alert("ID опроса не найден в URL.");
}

// Функция для создания графика
function createChart(question, answers, chartType, index) {
    const canvas = document.createElement('canvas');
    canvas.id = `chart-${index}`;
    document.querySelector('.chart').appendChild(canvas);

    const ctx = canvas.getContext('2d');
    
    // Создаём график
    new Chart(ctx, {
        type: chartType, // Используем тип графика: 'doughnut' или 'bar'
        data: {
            labels: answers.map(item => item.answer), // Метки оси X из JSON
            datasets: [{
                label: question, // Название вопроса как label
                data: answers.map(item => item.count), // Данные для графика
                borderWidth: 1
            }]
        },
        options: {
            responsive: true, // Сделать график отзывчивым
            scales: {
                y: {
                    beginAtZero: true // Ось Y начинается с 0
                }
            }
        }
    });
}