import './App.css';
import React from 'react';
import Test from './etc/components/Test';
import NotFountPage from './etc/components/NotFoundPage';
import SideBar from './Page/side_bar/SideBar';
import MainPage from './Page/main/MainPage';
import CustomerManagement from './Page/customer_management/CustomerManagement';
import PipeLineMnagement from './Page/pipeline_management/PipeLineMnagement';
import HeadquartersManagement from './Page/headquarters_management/HeadquartersManagement';

const routes = 
[
    {
        path:'/',
        element: <MainPage />
    },
    {
        path:'/test',
        element: <Test />
    },
    {
        path:'/side',
        element: <SideBar />
    },
    {
        path:'/main',
        element: <MainPage />
    },
    {
        path:'/customer',
        element: <CustomerManagement />
    },
    {
        path:'/pipeline',
        element: <HeadquartersManagement />
    },
    {
        path:'/headquarter',
        element: <PipeLineMnagement />
    },
    {
        path:'*',
        element: <NotFountPage />
    }
]

export default routes;
