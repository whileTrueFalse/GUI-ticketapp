document.addEventListener('DOMContentLoaded', () => {
    var socket = io();

    socket.on('connect', () => {
        const input = document.getElementById('user-input');
        const sendButton = document.querySelector('button');

        sendButton.onclick = () => {
            const message = input.value;
            if (message.trim()) {
                addMessageToChatBox('User', message);
                socket.emit('message', {'message': message});
                input.value = '';
            }
        };

        requestLocation();
    });

    socket.on('response', data => {
        addMessageToChatBox('Bot', data.message);
    });

    function addMessageToChatBox(sender, message) {
        const chatBox = document.getElementById('chat-box');
        const messageElement = document.createElement('div');
        messageElement.className = sender.toLowerCase() + '-message';
        messageElement.textContent = message;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function requestLocation() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
                handleLocationSuccess(position);
            }, () => {
                addMessageToChatBox('System', 'Permission to access location was denied or location services are turned off.');
            });
        } else {
            addMessageToChatBox('System', 'Geolocation is not supported by your browser.');
        }
    }

    function handleLocationSuccess(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`)
            .then(response => response.json())
            .then(data => {
                let city = data.city || 'Unknown location';
                if (city === "Sambhaji Nagar") {
                    city = "Aurangabad";
                }
                addLocationDropdown(city);
            }).catch(() => {
                addMessageToChatBox('System', 'Unable to determine your location.');
            });
    }

    function addLocationDropdown(city) {
        const chatBox = document.getElementById('chat-box');
        const messageElement = document.createElement('div');
        messageElement.className = 'system-message';
        messageElement.id = 'location-message';  // Assign an ID for later manipulation
        messageElement.innerHTML = `Detected location: <span id="city-name">${city}</span> &#x25BC;<br>
            <select onchange="updateCity(this.value)" style="margin-top: 5px;">
                <option value="${city}" selected>${city}</option>
                <option value="Delhi">Delhi</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Chennai">Chennai</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Pune">Pune</option>
                <option value="Jaipur">Jaipur</option>
                <option value="Lucknow">Lucknow</option>
                <option value="Kanpur">Kanpur</option>
            </select>`;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    window.updateCity = function(city) {
        const citySpan = document.getElementById('city-name');
        if (citySpan) {
            citySpan.textContent = city;  // Update the city name in the heading directly
        }
        socket.emit('location', {city: city});
    };
});
