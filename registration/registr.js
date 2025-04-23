$('.message a').click(function(){
    $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
 });

 const userName = document.getElementById("userName");
 const password = document.getElementById("password");
 const btnLogin = document.getElementById("btnLogin");


 btnLogin.addEventListener("click", function(event) {
    const userNameValue = userName.value;
    const passwordValue = password.value;

    if (userNameValue === "" || passwordValue === "") {
        alert("Пожалуйста, заполните все поля.");
        return;
    }
    const userNamePassword = {
        userName: userNameValue,
        password: passwordValue
    }

    fetch("https://your-backend-url.com/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userNamePassword)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Ошибка при входе. Проверьте свои данные.");
        }
        return response.json();
    })
    .then(data => {
        alert("Успешный вход!");
        window.location.href = "/mainPage";
        console.log("Ответ от сервера:", data);
        // Здесь можно обработать данные, полученные от сервера
    })
    .catch(error => {
        alert(error.message);
        console.error("Ошибка:", error);
    });



 })