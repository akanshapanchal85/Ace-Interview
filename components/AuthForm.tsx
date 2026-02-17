"use client";

import Image from "next/image";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FormField from "@/components/FormField";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/client";
import { signIn, signUp } from "@/lib/actions/auth.action";


type FormType = "sign-in" | "sign-up";

const authFormSchema = (type: FormType) =>
  z.object({
    name: type === "sign-up" ? z.string().min(3, "Name is required.") : z.string().optional(),
    email: z.string().email("Please enter a valid email."),
    password: z.string().min(3, "Password must be at least 3 characters."),
  });

const AuthForm = ({ type }: { type: FormType }) => {
    const router = useRouter();
  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // UI only for now.
    try{
        console.log(values);
        if(type === "sign-up"){
            const {name, email, password} = values;
            if(!name){
              toast.error("Name is required.");
              return;
            }
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const result = await signUp({
                uid : userCredential.user.uid,
                name,
                email,
                password
            });
            if(!result?.success){
                toast.error(result.error ?? "Failed to sign up.");
                return;
            }
            toast.success("Account created successfully");
            router.push("/sign-in");
        }else{
            const {email, password} = values;
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const idToken = await userCredential.user.getIdToken();
            if(!idToken){
                toast.error("Failed to get ID token.");
                return;
            }
            const result = await signIn({email, idToken});
            if(!result?.success){
              toast.error(result?.error ?? "Failed to log in.");
              return;
            }
            toast.success("Signed in successfully");
            router.push("/");
            router.refresh();
        }
    }catch(error){
        console.log(error);
        toast.error(`Failed to submit form : ${error}`);
    }
  };

  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center items-center">
          <Image src="/logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100 font-semibold">Ace Interview</h2>
        </div>

        <h3 className="text-center">Practice job interviews with AI</h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your name"
                type="text"
              />
            )}

            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your email address"
              type="email"
            />

            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
            />

            <Button className="btn" type="submit">
              {isSignIn ? "Sign In" : "Create an Account"}
            </Button>
          </form>
        </Form>

        <p className="text-center text-light-100">
          {isSignIn ? "No account yet?" : "Have an account already?"}
          <Link
            href={isSignIn ? "/sign-up" : "/sign-in"}
            className="font-bold text-primary-200 ml-1"
          >
            {isSignIn ? "Sign Up" : "Sign In"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;