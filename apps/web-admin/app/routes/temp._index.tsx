import { Button } from '@workspace/ui/components/button'
import React from 'react'

const CreateAdmin = () => {
  async function onSubmit() {
    const { authClient } = await import("~/libs/auth-client")
    await authClient.signUp.email({
      email: 'admin@servemed.co',
      name: 'Admin',
      password: 'password',
      username: 'admin',
    })
  }

  return (
    <div>
      <Button onClick={() => onSubmit()} className="w-full">
        Create Admin
      </Button>
    </div>
  )
}

export default CreateAdmin
