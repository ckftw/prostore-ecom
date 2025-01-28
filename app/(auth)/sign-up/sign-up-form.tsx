"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpUser } from "@/lib/actions/user.actions";
import { signUpDefaultValues } from "@/lib/constants";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

const SignUpForm = () => {
    const [data, action] = useActionState(signUpUser, {
        success: false,
        message: ''
    })

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/'

    const SignUpButton = () => {
        const { pending } = useFormStatus();
        return (
            <Button variant='default' disabled={pending} className="w-full">
                {pending ? 'Submitting...' : 'Sign Up'}
            </Button>
        )
    }
    return (
        <div>
            <form action={action}>
                <input type="hidden" name="callbackUrl" value={callbackUrl} />
                <div className="space-y-6">
                    <div>
                        <Label htmlFor="email">Name</Label>
                        <Input
                            defaultValue={signUpDefaultValues.name}
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                        />
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            defaultValue={signUpDefaultValues.email}
                            id="email"
                            name="email"
                            type="email"
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            defaultValue={signUpDefaultValues.password}
                            id="password"
                            name="password"
                            type="password"
                            required
                            autoComplete="password"
                        />
                    </div>

                    <div>
                        <Label htmlFor="password">Confirm Password</Label>
                        <Input
                            defaultValue={signUpDefaultValues.confirmPassword}
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required
                            autoComplete="confirmPassword"
                        />
                    </div>

                    <SignUpButton />

                    {data && !data.success && <div className="text-center text-destructive">
                        {data.message}
                    </div>}

                    <div className="text-sm text-center text-muted-foreground">
                        Already have an account?{' '}
                        <Link href='/sign-in' target="_self" className="link">
                            Sign In
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SignUpForm;
