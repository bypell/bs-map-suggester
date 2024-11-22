
function App() {

  return (
    <>
      <div className="h-screen w-screen bg-dark flex justify-center items-center">
        <div className="relative inline-flex group">
          {/* button background */}
          {/* <div
            className="absolute transition-all duration-100 opacity-70 -inset-px 
            bg-main rounded-xl blur-md group-hover:opacity-100 
            group-hover:-inset-1 group-hover:duration-100 animate-tilt">
          </div> */}
          {/* button */}
          <a href="#"
            className="relative px-6 py-3 bg-less-dark text-white
            rounded-xl shadow-md text-lg font-semibold
            transition-all duration-100 group-hover:shadow-lg
            group-hover:duration-100 group-hover:px-7 group-hover:py-4
            group-hover:text-xl"
            role="button">Get
          </a>
        </div>
      </div>
    </>
  )
}

export default App
