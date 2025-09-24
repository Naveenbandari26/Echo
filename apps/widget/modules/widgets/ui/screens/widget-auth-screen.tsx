import { Form,FormControl,FormField,FormItem,FormMessage } from '@workspace/ui/components/form';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';

import {useForm} from "react-hook-form"
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

import WidgetHeader from '../components/widget-header';

const formSchema=z.object({
    name:z.string().min(1,"Name is Required"),
    email:z.string().email("Invalid Email Address")
})
const WidgetAuthScreen=()=>{
    const form=useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            name:"",
            email:""
        }
    })

    const onSubmit=async(values: z.infer<typeof formSchema>){
        console.log(values);
    }

    return(
        <>
         <WidgetHeader className="rounded-t-xl">
                <div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
                    <p className=" text-3xl">Hey there </p>
                    <p className="text-lg">Let&apos;s get you started!</p>
                </div>
            </WidgetHeader>
            <Form {...form}>
                <form className='flex flex-1 flex-col gap-y-4 p-4' onSubmit={form.handleSubmit(onSubmit)}>

                    <FormField control={form.control} name="name" render={({ field })=>(
                        <FormItem>
                            <FormControl>
                                <Input className='h-10 bg-background' placeholder='eg. john doe' type='text' {...field}/>
                            </FormControl>
                        </FormItem>
                     )}/>

                </form>
            </Form>
        </>
    )
}
export default WidgetAuthScreen;