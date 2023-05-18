import PrivateChat from "./Pages/PrivateChat";
import GroupChat from "./Pages/GroupChat";
import Stats from "./Pages/Stats";
import FAQ from "./Pages/FAQ";
import Account from "./Pages/Account";

const AppRoutes = [
    {
        path: '/PrivateChat',
        element: <PrivateChat/>
    },
    {
        path: '/GroupChat',
        element: <GroupChat/>
    },
    {
        path: '/Stats',
        element: <Stats/>
    },
    {
        path: '/FAQ',
        element: <FAQ/>
    },
    {
        path: '/Account',
        element: <Account/>
    },
];

export default AppRoutes;