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
        const userRecord = await auth.getUserByEmail(email);
        if(userRecord){
            return {
                success : false,
                error : "User not found, create an account first"
            }
        }
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
    try{
        const cookieStore = await cookies();
        const sessionCookie = await auth.createSessionCookie(idToken, {
            expiresIn : oneWeekInSeconds // 5 days
        });
        cookieStore.set('session', sessionCookie, {
            httpOnly : true,
            secure : process.env.NODE_ENV === 'production',
            maxAge : oneWeekInSeconds,
            sameSite : 'lax',
            path : '/',
        });
    }catch(error){
        console.log(error);
    }
}