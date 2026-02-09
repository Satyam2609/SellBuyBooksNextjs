import HomeCrousal from "./components/HomeCrousal";
import HomePageCart from "./components/HomePageCart";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"
import MedicalBook from "./components/MedicalBook";
import EnginerringBook from "./components/EnginerringBook";


export default function Home() {
  return (
   <>
   <div className="bg-white text-black">
   <Navbar/>
   <HomeCrousal/>
   <HomePageCart/>
   <MedicalBook/>
   <EnginerringBook/>
   <Footer/>
   </div>
   </>
  );
}
