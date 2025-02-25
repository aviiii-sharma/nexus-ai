import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import './root.css'


const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key")
}

const RootLayout = () => {
    return (
        <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">

            <div className="rootLayout">
                <header>
                    <Link to="/" className="logo">
                        <span className='heading'>AI NEXUS</span>
                    </Link>
                    <div className="user">
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </div>
                </header>
                <main>
                    <Outlet />
                </main>
            </div>

        </ClerkProvider>
    );
};

export default RootLayout;
