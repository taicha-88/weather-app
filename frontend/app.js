window.addEventListener('load', ()=> {
    let lon, lat;
    let temperatureDescription = document.querySelector('.temperature-description');
    let temperatureDegree = document.querySelector('.temperature-degree');
    let locationTimezone = document.querySelector('.location-timezone');
    let weatherIcon = document.querySelector('.weather-icon');
    let isCelsius = true; // 温度の単位を管理するフラグ

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(possition => {
            // 経度を取得
            lon = possition.coords.longitude;
            // 緯度を取得
            lat = possition.coords.latitude;

            const apiUrl = `http://localhost:3000/api/weather?lat=${lat}&lon=${lon}&units=metric`;

            
            fetch(apiUrl)
                .then(response =>{
                    return response.json();
                })
                .then(data =>{
                    console.log(data);
                    // 気温と天気の説明を取得
                    const temperatureCelsius = data.main.temp;
                    const summary = data.weather[0].description;
                    const icon = data.weather[0].icon; // アイコンコードを取得

                    // 気温と説明をDOMに反映
                    temperatureDegree.textContent = Math.ceil(temperatureCelsius) + " °C";
                    temperatureDescription.textContent = summary;
                    locationTimezone.textContent = data.name;

                    // アイコンのURLを設定
                    weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;

                     // クリックイベントを設定
                    weatherIcon.addEventListener('click', () => {
                        // rubberBandアニメーションを実行
                        weatherIcon.classList.add('animate__animated', 'animate__rubberBand');

                        // アニメーションが終了したらクラスを削除
                        weatherIcon.addEventListener('animationend', () => {
                            weatherIcon.classList.remove('animate__animated', 'animate__rubberBand');
                        }, { once: true }); // 一度だけ実行されるようにする
                    });

                    // 温度をクリックすると摂氏と華氏を切り替え
                    temperatureDegree.addEventListener('click', () => {
                        if (isCelsius) {
                            const temperatureFahrenheit = (temperatureCelsius * 9/5) + 32; // 摂氏から華氏への変換
                            temperatureDegree.textContent = Math.round(temperatureFahrenheit) + " °F"; // 切り上げた華氏を表示
                        } else {
                            temperatureDegree.textContent = Math.round(temperatureCelsius) + " °C"; // 摂氏に戻す
                        }
                        isCelsius = !isCelsius; // 単位フラグを切り替え
                    });
                });
    });

    
    }
});