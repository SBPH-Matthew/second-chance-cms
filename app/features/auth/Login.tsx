"use client";
import { ArrowRight } from "@carbon/icons-react";
import { Button, Form, PasswordInput, TextInput, Theme } from "@carbon/react";

export const Login = () => {
    return (
        <Theme
            theme="g100"
            className="py-16! flex flex-col justify-center min-h-screen w-full"
        >
            <Form className="flex flex-col gap-10 w-full md:w-1/3 px-16! ">
                <div className="pb-5! border-b! border-[#525252]!">
                    <h1 className="font text-[52px]! pb-2">Login</h1>
                    <p className="text-sm!">
                        Enter your login credentials below.
                    </p>
                </div>

                <TextInput
                    id="Email"
                    labelText="Email"
                    size="lg"
                    helperText="Enter your registered email."
                />

                <PasswordInput
                    id="password"
                    labelText="Password"
                    size="lg"
                    helperText="Enter your password."
                />

                <Button kind="primary">Sign In</Button>

                <div className="-mt-2! border-b! border-[#525252]!"></div>
            </Form>
            <div className="pt-5! px-16! flex flex-col gap-4">
                <p className="text-sm! text-[#e0e0e0]">{`Don't have an account?`}</p>
                <Button
                    kind="primary"
                    className="w-1/2!"
                    renderIcon={(props) => <ArrowRight size={20} {...props} />}
                >
                    Create an account
                </Button>
            </div>
        </Theme>
    );
};
