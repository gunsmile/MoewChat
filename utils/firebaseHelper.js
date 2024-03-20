// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

export const getFirebaseApp = () => {
    const firebaseConfig = {
        apiKey: "AIzaSyDoaxTCLzbTyfQcmJnXi6a3ZAUF4zZ6kvo",
        authDomain: "aiapp-6ef35.firebaseapp.com",
        projectId: "aiapp-6ef35",
        storageBucket: "aiapp-6ef35.appspot.com",
        messagingSenderId: "592410752985",
        appId: "1:592410752985:web:4ff6f9d663f723673b4bc8",
        measurementId: "G-1HJ0EGNXH4",
    }

    // Initialize Firebase
    return initializeApp(firebaseConfig)
}
