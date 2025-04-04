importScripts('https://www.gstatic.com/firebasejs/11.5.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.5.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCseXT0j5-qAGmOZrmnAWEuF3uK6l4QpHg",
  authDomain: "job-board-web.firebaseapp.com",
  projectId: "job-board-web",
  storageBucket: "job-board-web.appspot.com",
  messagingSenderId: "347576977073",
  appId: "1:347576977073:web:43d1217e5329c7a352c490"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/vite.svg',
    badge: '/vite.svg'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});