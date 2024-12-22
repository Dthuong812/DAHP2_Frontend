import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Login from '../src/pages/Login.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { UserProvider } from './context/UserContext.jsx';
import "../src/styles/main.css"
import Customer from './pages/Customer.jsx';
import Order from './pages/Order.jsx';
import Warehouse from './pages/Warehouse.jsx';
// import Revenue from './pages/Revenue.jsx';
import Setting from './pages/Setting.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import Overview from './pages/Overview.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Category from './pages/Category.jsx';
import Supplier from './pages/Supplier.jsx';
const router = createBrowserRouter([
  {
    path:"/login",
    element :<Login/>,
  },
  {
    path: "/",
    element:(
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage/>,
    children:[
      {
        path: "/",
        element:<Overview/>
      },
      {
        path: "/order",
        element:<Order/>
      },
      {
        path: "/customer",
        element: <Customer/>,
      },
      {
        path: "/warehouse",
        element: <Warehouse/>,
      },
      // {
      //   path: "/revenue",
      //   element: <Revenue/>,
      // },
      {
        path: "/setting",
        element: <Setting/>,
      },
      {
        path: "category",
        element:<Category/>
      },
      {
        path: "supplier",
        element:<Supplier/>
      },
    ]
  },
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
        <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>,
)
