import HomeCrousal from "./components/HomeCrousal";
import HomePageCart from "./components/HomePageCart";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"


export default function Home() {
  return (
   <>
   <div className="bg-white text-black">
   <Navbar/>
   <HomeCrousal/>
   <HomePageCart/>
   <Footer/>
   </div>
   </>
  );
}
