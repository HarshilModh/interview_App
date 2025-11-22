import {initializeApp, getApps, cert} from 'firebase-admin/app';
import {getAuth} from "firebase-admin/auth";
import {getFirestore} from "firebase-admin/firestore";

let auth: any = null;
let db: any = null;

const initFirebaseAdmin = () => {
    // Only initialize if we're in runtime (not during build)
    if (typeof window === 'undefined' && process.env.FIREBASE_PROJECT_ID) {
        const apps = getApps();

        if(!apps.length) {
            try {
                initializeApp({
                    credential: cert({
                        projectId: process.env.FIREBASE_PROJECT_ID,
                        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
                    })
                });
                
                auth = getAuth();
                db = getFirestore();
            } catch (error) {
                console.error('Failed to initialize Firebase Admin:', error);
            }
        } else {
            auth = getAuth();
            db = getFirestore();
        }
    }
}

// Initialize on module load
initFirebaseAdmin();

export { auth, db };