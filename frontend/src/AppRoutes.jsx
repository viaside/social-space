import Chat from './pages/Chat';
import GroupChat from './pages/GroupChat';
import Group from './pages/Group';
import Channel from './pages/Channel';
import Stats from './pages/Stats';
import Profile from './pages/Profile'
import Main from './pages/Main';

const AppRoutes = [
    {
        path: '/',
        element: <Main />
    },
    {
        path: '/Chat',
        element: <Chat />
    },
    {
        path: '/GroupChat',
        element: <GroupChat />
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