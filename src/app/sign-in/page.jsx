'use client'
import { useToast } from "@/hooks/use-toast.js"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { signIn } from "next-auth/react"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import { Loader2 } from "lucide-react"


const LoginPage = () => {
    const router = useRouter()
    const [isSubmiting,setIsSubmiting] = useState(false)
    const {toast} = useToast()
    const form = useForm({
      defaultValues:{
        email: '',
        password: '',
      }
    })

    const onSubmit = async (data) => {
      setIsSubmiting(true)
      const result = await signIn('credentials',{
              redirect: false,
              email: data.email,
              password: data.password
      });
      // console.log(result)
      if(result?.error){
        toast({
          title: 'Sign in failed',
          description: result.error,
          variant: 'destructive'
        })
        setIsSubmiting(false)
      }
      if(result?.ok){
        toast({
          title:'Sign in successfully',
          description: result.status,
          variant: 'default'
        })
        setIsSubmiting(false)
        router.replace('/search')
      }

}



  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back 
          </h1>
          <p className="mb-4">Sign in </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='w-full' type="submit">{isSubmiting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ):('Sign In')}</Button>
          </form>
        </Form>
      
        <div className="text-center mt-4">
          <p>
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
      </div> 
    </div>
    
    </div>
  )
}


export default LoginPage
