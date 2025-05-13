let surveysName = ["какой чай вы предпочитаете?", "какой кофе вы предпочитаете?", "какой сок вы предпочитаете?"];

const surveyContainer = document.getElementById('surveyList');

fetch("/api/survey", {
    method: "GET",
    mode: 'cors',
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
})
.then(response => {
    if (!response.ok) {
        throw new Error("Ошибка при загрузке опросов.");
    }
    return response.json();
}
)
.then(surveys => {
    surveys.forEach(survey => {
        const btnOpen = document.createElement('buttonOpen');
        btnOpen.textContent = 'Открыть';

        const listItem = document.createElement('div');
        listItem.classList.add('survey-item');
        listItem.textContent = survey.name;

        listItem.appendChild(btnOpen);
        surveyContainer.appendChild(listItem);

        btnOpen.addEventListener('click', () => {
            window.location.href = `/survey-details.html?id=${survey.id}`;
        });
    })
})
.catch(error => {
    console.error("ошибка при загрузке опросов:", error);
});



