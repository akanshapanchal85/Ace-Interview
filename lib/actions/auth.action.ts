'use server';

import { auth, db } from '@/firebase/admin';
import { cookies } from 'next/headers';

const oneWeekInSeconds = 60 * 60 * 24 * 7;

type signUpParams = {
    uid : string;
   name : string;
   email : string;
   password : string;
}

type signInParams = {
   email : string;
   idToken : string;
}

function hasErrorCode(error: unknown): error is { code: string } {
    return (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        typeof (error as { code?: unknown }).code === 'string'
    );
}

export async function signUp(params : signUpParams){
    const {uid, name, email, password} = params;
    try{
        const userRecord = await db.collection('users').doc(uid).get();
        if(userRecord.exists){
            return {
                success : false,
                error : "User already exists"
            }
        }
        await db.collection('users').doc(uid).set({
            name,
            email,
            password,
            createdAt : new Date()
        });
        return {
            success : true,
            message : "User created successfully"
        }
    }catch(error){
        console.log(error);
        if(hasErrorCode(error) && error.code === 'auth/email-already-in-use'){
            return {
                success : false,
                error : "Email already in use"
            }
        }
        return {
            success : false,
            error : "Failed to sign up"
        }
    }
}

export async function signIn(params : signInParams){
    const {email, idToken} = params;
    try{
        // `getUserByEmail` returns a user if it exists; otherwise it throws.
        await auth.getUserByEmail(email);

        await setSessionCookie(idToken);
        return {
            success : true,
            message : "Signed in successfully"
        }
    }catch(error){
        console.log(error);
        return {
            success : false,
            error : "Failed to log in"
        }
    }
}

export async function setSessionCookie(idToken : string){
    const cookieStore = await cookies();
    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn : oneWeekInSeconds
    });
    cookieStore.set('session', sessionCookie, {
        httpOnly : true,
        secure : process.env.NODE_ENV === 'production',
        maxAge : oneWeekInSeconds,
        sameSite : 'lax',
        path : '/',
    });
}

export type CurrentUser = {
    id: string;
    name?: string;
    email?: string;
    createdAt?: unknown;
};

export async function getCurrentUser() : Promise<CurrentUser | null>{
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    if(!sessionCookie){
        return null;
    }
    try{
        const decodedClaims = await auth.verifySessionCookie(sessionCookie);
        const userRecord = await db.collection('users').doc(decodedClaims.uid).get();
        if(!userRecord.exists){
            return null;
        }
        const data = userRecord.data();

        // Return only non-sensitive user profile fields.
        return {
            id: userRecord.id,
            name: typeof data?.name === 'string' ? data.name : undefined,
            email: typeof data?.email === 'string' ? data.email : undefined,
            createdAt: data?.createdAt,
        };
    }catch(error){
        console.log(error);
        return null;
    }
}

export async function isAuthenticated(){
    const user = await getCurrentUser();

    return !!user;
}