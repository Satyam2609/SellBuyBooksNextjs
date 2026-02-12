import {initializeApp} from "firebase/app"
import {getAuth} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "XXXX",
  authDomain: "XXXX",
  projectId: "XXXX",
  appId: "XXXX"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)