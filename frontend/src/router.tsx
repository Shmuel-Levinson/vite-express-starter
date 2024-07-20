// import React, { StrictMode } from 'react'
// import ReactDOM from 'react-dom/client'
import {
    Outlet,
    // Link,
    createRouter,
    createRoute,
    createRootRoute,
} from '@tanstack/react-router'
import App from "./App.tsx";
import MainContainer from "./MainContainer.tsx";
import LoginRegister from "./LoginRegister.tsx";

// const exampleRootRoute = createRootRoute({
//     component: () => (
//         <>
//             <div className="p-2 flex gap-2">
//                 <Link to="/" className="[&.active]:font-bold">
//                     Home
//                 </Link>{' '}
//                 <Link to="/about" className="[&.active]:font-bold">
//                     About
//                 </Link>
//             </div>
//             <hr/>
//             <Outlet/>
//         </>
//     ),
// })

const rootRoute = createRootRoute({
    component: ()=><MainContainer/>
})
const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: ()=><App/>
})

const loginRoute = createRoute({
    getParentRoute: ()=> rootRoute,
    path: '/login',
    component: ()=> <LoginRegister formType={"login"}/>
})

const joinRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/join',
    component: () => <LoginRegister formType={"join"}/>
})

const aboutRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/about',
    component: function About() {
        return (
            <div style={{width: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                <div style={{paddingInline:400, fontWeight: "", fontSize: 20}}>
                    About ShoppingListPro

                    Welcome to ShoppingListPro, your ultimate shopping companion designed to simplify your shopping
                    experience and ensure you never forget an item again. Whether you're planning a weekly grocery run,
                    organizing a special event, or just keeping track of daily essentials, ShoppingListPro has got you
                    covered.

                    Features:

                    Smart List Creation:

                    Easily create and manage multiple shopping lists for different occasions.
                    Add items manually or use our voice recognition feature for hands-free list creation.
                    Our auto-suggest feature predicts items as you type, making list creation faster and easier.
                    Collaborative Shopping:

                    Share your shopping lists with family and friends.
                    Real-time updates ensure everyone stays on the same page.
                    Assign items to different people and track progress.
                    Personalized Experience:

                    Save your favorite items and categorize them for quick access.
                    Customize your lists with item quantities, notes, and priority levels.
                    Set reminders for regular purchases and receive notifications when it’s time to restock.
                    Smart Recommendations:

                    Get personalized product recommendations based on your shopping habits.
                    Discover new products and deals from your favorite stores.
                    Seamless Integration:

                    Sync your lists across all your devices – smartphone, tablet, and desktop.
                    Integrate with your calendar to schedule your shopping trips.
                    In-Store Assistance:

                    Use our in-app map feature to navigate through stores and find items quickly.
                    Scan barcodes to add items to your list and get product information on the go.
                    Track your spending with our built-in budget tracker.
                    Offline Access:

                    Access your lists even when you’re offline.
                    Any changes made offline will sync automatically once you’re back online.
                    Why Choose ShoppingListPro?

                    ShoppingListPro is designed with your convenience in mind. Our intuitive interface, coupled with
                    powerful features, ensures that you spend less time planning and more time enjoying your shopping.
                    With
                    ShoppingListPro, managing your shopping lists is a breeze, giving you more control and reducing the
                    stress of shopping trips.

                    Download ShoppingListPro Today!

                    Join millions of satisfied users who have made ShoppingListPro their go-to app for all their
                    shopping
                    needs. Available on iOS and Android, ShoppingListPro is your reliable partner for an organized and
                    efficient shopping experience. Download now and take the first step towards smarter shopping!
                </div>
            </div>)
    },
})

const routeTree = rootRoute.
addChildren([indexRoute, aboutRoute, loginRoute, joinRoute])
const router = createRouter({routeTree})
export default router;
