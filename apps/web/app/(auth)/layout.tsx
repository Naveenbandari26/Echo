const layout=({children}:{children: React.ReactNode})=>{

    return(
        <>
            <div className="flex min-h-screen flex-col items-center justify-center py-2">
                {children}
            </div>
        </>
    )
}
export default layout;