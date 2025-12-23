"use client";
import { CarbonLink } from "@/app/components/CarbonLink";
import { CircleDash, Incomplete } from "@carbon/icons-react";
import {
    Accordion,
    AccordionItem,
    Button,
    Form,
    InlineLoading,
    PasswordInput,
    Stack,
    TextInput,
    Theme,
} from "@carbon/react";
import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useRegister } from "./hooks";

export const Register = () => {
    const { mutateAsync: RegisterPOST, isPending } = useRegister();

    const form = useForm({
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            confirm_password: "",
        },
        onSubmit: async ({ value }) => {
            RegisterPOST(value, {
                onSuccess: (data) => {
                    console.log("data", data);
                },
                onError: (err) => console.log(err),
            });
        },
    });

    return (
        <Theme theme="g100" className="min-h-screen p-5! flex gap-2">
            <div className="w-1/2"></div>

            <div className="w-1/2 py-16!">
                <Form
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                >
                    <Stack gap={3} className="pb-5!">
                        <h1 className="register__heading">Register</h1>
                        <p className="">
                            Already have an account?{" "}
                            <CarbonLink href="/login" as={Link} inline>
                                Log in
                            </CarbonLink>
                        </p>
                    </Stack>

                    <Accordion size="lg">
                        <AccordionItem
                            open
                            title={
                                <div className="flex items-center gap-2">
                                    <Incomplete />
                                    <p>Account information</p>
                                </div>
                            }
                            className="[&>div]:p-0"
                        >
                            <div className="w-full flex flex-col gap-4">
                                <div className="flex items-center gap-4">
                                    <form.Field
                                        name="first_name"
                                        validators={{
                                            onChange: ({ value }) => {
                                                if (!value)
                                                    return "First name is required.";
                                            },
                                        }}
                                    >
                                        {(field) => (
                                            <TextInput
                                                id="firstname"
                                                labelText="First Name"
                                                className="w-1/2"
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) =>
                                                    field.handleChange(
                                                        e.target.value,
                                                    )
                                                }
                                                invalid={
                                                    !field.state.meta.isValid
                                                }
                                                invalidText={field.state.meta.errors.join(
                                                    ", ",
                                                )}
                                            />
                                        )}
                                    </form.Field>

                                    <form.Field
                                        name="last_name"
                                        validators={{
                                            onChange: ({ value }) =>
                                                !value
                                                    ? "Last name is required."
                                                    : undefined,
                                        }}
                                    >
                                        {(field) => (
                                            <TextInput
                                                id="lastname"
                                                labelText="Last Name"
                                                className="w-1/2"
                                                name={field.name}
                                                onBlur={field.handleBlur}
                                                onChange={(e) =>
                                                    field.handleChange(
                                                        e.target.value,
                                                    )
                                                }
                                                invalid={
                                                    !field.state.meta.isValid
                                                }
                                                invalidText={field.state.meta.errors.join(
                                                    ", ",
                                                )}
                                            />
                                        )}
                                    </form.Field>
                                </div>

                                <div className="flex items-center gap-2">
                                    <form.Field
                                        name="email"
                                        validators={{
                                            onChange: ({ value }) =>
                                                !value
                                                    ? "Email is required."
                                                    : undefined,
                                        }}
                                    >
                                        {(field) => (
                                            <TextInput
                                                id="email"
                                                type="email"
                                                labelText="Email"
                                                name={field.name}
                                                onBlur={field.handleBlur}
                                                value={field.state.value}
                                                onChange={(e) =>
                                                    field.handleChange(
                                                        e.target.value,
                                                    )
                                                }
                                                invalid={
                                                    !field.state.meta.isValid
                                                }
                                                invalidText={field.state.meta.errors.join(
                                                    ", ",
                                                )}
                                            />
                                        )}
                                    </form.Field>
                                </div>

                                <div className="w-full flex gap-4">
                                    <form.Field
                                        name="password"
                                        validators={{
                                            onChange: ({ value }) =>
                                                !value
                                                    ? "Password is required."
                                                    : undefined,
                                        }}
                                    >
                                        {(field) => (
                                            <PasswordInput
                                                id="password"
                                                labelText="Password"
                                                className="w-full md:w-1/2"
                                                size="lg"
                                                name={field.name}
                                                onBlur={field.handleBlur}
                                                value={field.state.value}
                                                onChange={(e) =>
                                                    field.handleChange(
                                                        e.target.value,
                                                    )
                                                }
                                                invalid={
                                                    !field.state.meta.isValid
                                                }
                                                invalidText={field.state.meta.errors.join(
                                                    ", ",
                                                )}
                                            />
                                        )}
                                    </form.Field>

                                    <form.Field
                                        name="confirm_password"
                                        validators={{
                                            onChange: ({ value }) =>
                                                !value
                                                    ? "Confirm password is required."
                                                    : undefined,
                                        }}
                                    >
                                        {(field) => (
                                            <PasswordInput
                                                id="confirm_password"
                                                labelText="Confirm Password"
                                                className="w-full md:w-1/2"
                                                size="lg"
                                                name={field.name}
                                                onBlur={field.handleBlur}
                                                value={field.state.value}
                                                onChange={(e) =>
                                                    field.handleChange(
                                                        e.target.value,
                                                    )
                                                }
                                                invalid={
                                                    !field.state.meta.isValid
                                                }
                                                invalidText={field.state.meta.errors.join(
                                                    ", ",
                                                )}
                                            />
                                        )}
                                    </form.Field>
                                </div>

                                {isPending ? (
                                    <InlineLoading
                                        description="Loading"
                                        iconDescription="Submitting form..."
                                    />
                                ) : (
                                    <Button
                                        type="submit"
                                        title="register"
                                        kind="primary"
                                    >
                                        Register
                                    </Button>
                                )}
                            </div>
                        </AccordionItem>
                        <AccordionItem
                            title={
                                <div className="flex items-center gap-2">
                                    <CircleDash />
                                    <p>Verify Email</p>
                                </div>
                            }
                            disabled
                        >
                            <p>
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua. Ut
                                enim ad minim veniam, quis nostrud exercitation
                                ullamco laboris nisi ut aliquip ex ea commodo
                                consequat.
                            </p>
                        </AccordionItem>
                    </Accordion>
                </Form>
            </div>
        </Theme>
    );
};
