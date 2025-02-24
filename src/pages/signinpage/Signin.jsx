import { SignIn } from '@clerk/clerk-react'
import React from 'react'

const Signin = () => {
    return (
        <div className=' flex justify-center items-center'>
            <SignIn
                path="/sign-in"
                signUpUrl="/sign-up"
            />
        </div>
    )
}

export default Signin