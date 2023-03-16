import Chat from './pages/Chat';
import Group from './pages/Group';
import Channel from './pages/Channel';
import Stats from './pages/Stats';
import Profile from './pages/Profile'

const AppRoutes = [
    {
        path: '/Chat',
        element: <Chat />
    },
    {
        path: '/Group',
        element: <Group />
    },
    {
        path: '/Channel',
        element: <Channel />
    },
    {
        path: '/Stats',
        element: <Stats />
    },
    {
        path: '/Profile',
        element: <Profile />
    }
];

export default AppRoutes;