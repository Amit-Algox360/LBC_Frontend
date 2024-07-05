import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Home from "./Pages/Home";
import Main from "./Dashboard/Main";
import Play from "./Dashboard/Play";
import Activity from "./Dashboard/Activity";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Upadate from "./Dashboard/Upadate";
import Cpassword from "./Dashboard/Cpassword";
import AdminHome from "./Admin";
import Adminlogin from "./Admin/AminLogin";
import AddMoney from "./Dashboard/AddMoney";
import Withdrawl from "./Dashboard/Withdrawl";
import Data from "./Admin/data";
import Car from "./prac";
import Createticket from "./Admin/createticket";
import Timer from "./Dashboard/Timer";
import Result from "./Dashboard/Result";
function App() {
  return (
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<Home />}/>
      <Route path="/login" element={<Login />}/>
      <Route path="register" element={<Register />}/>
      <Route path="main" element={<Main />}/>
      <Route path="play" element={<Play />}/>
      <Route path="activity" element={<Activity />}/>
      <Route path="update" element={<Upadate />}/>
      <Route path="cpass" element={<Cpassword />}/>
      <Route path="admin" element={<AdminHome />}/>
      <Route path="adminlogin" element={<Adminlogin />}/>
      <Route path="addMoney" element={<AddMoney />}/>
      <Route path="withdrawl" element={<Withdrawl />}/>
      <Route path="data" element={<Data />}/>
      <Route path="car" element={<Car />}/>
      <Route path="createticket" element={<Createticket />}/>
      <Route path="timer" element={<Timer />}/>
      <Route path="result" element={<Result />}/>
    </Routes>
  </BrowserRouter>
  );
}

export default App;






// import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
// import { useLocation } from "react-router-dom";
// import Header from "./Common/Header";
// import Footer from "./Common/Footer";
// import { UserContextProvider } from "./Context/userContext";
// import Error from "./Component/Error";
// import ScrollToTop from "./Component/ScrollToTop";
// import Login from "./Pages/Login";
// import Register from "./Pages/Register";
// import Adminform from "./Dashboardcomponent/Adminform";
// import Admin from "./Dashboardcomponent/Admin";
// import Userpanel from "./Dashboardcomponent/Userpanel";
// import Userpanelform from "./Dashboardcomponent/Userpanelform";
// import Userpanelprofile from "./Dashboardcomponent/Userpanelprofile";
// import Agentpanel from "./Dashboardcomponent/Agentpanel";
// import Agentpanelform from "./Dashboardcomponent/Agentpanelform";
// import Agentpanelprofile from "./Dashboardcomponent/Agentpanelprofile";
// import Adminlogin from "./Dashboardcomponent/Adminlogin";
// const App = () => {
//   const location = useLocation();
//   const pathsWithoutHeaderFooter = [
//     "/admin",
//     "/adminform",
//     "/userpanel",
//     "/userpanelform",
//     "/agentpanel",
//     "/agentpanelform",
//     "/userpanelprofile",
//     "/agentpanelprofile",
//   ];
//   const shouldExcludeHeaderFooter = pathsWithoutHeaderFooter.includes(
//     location.pathname
//   );

//   return (
//     <UserContextProvider>
//       {!shouldExcludeHeaderFooter && <Header />}
//       <Outlet />
//       <ScrollToTop />
//       {!shouldExcludeHeaderFooter && <Footer />}
//     </UserContextProvider>
//   );
// };

// const appRouter = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,

//     errorElement: <Error />,
//     children: [
//       { path: "/admin", element: <Admin /> },
//       { path: "/adminlogin", element: <Adminlogin /> },
//       { path: "/userpanel", element: <Userpanel /> },
//       { path: "/userpanelform", element: <Userpanelform /> },
//       { path: "/userpanelprofile", element: <Userpanelprofile /> },
//       { path: "/agentpanel", element: <Agentpanel /> },
//       { path: "/agentpanelform", element: <Agentpanelform /> },
//       { path: "/agentpanelprofile", element: <Agentpanelprofile /> },
//       { path: "/adminform", element: <Adminform /> },
//       { path: "/register", element: <Register /> },
//       { path: "/login", element: <Login /> },
//     ],
//   },
// ]);

// const Root = () => {
//   return <RouterProvider router={appRouter} />;
// };

// export default Root;
