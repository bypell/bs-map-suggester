import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import PlayerSelectPage from './components/pages/PlayerSelectPage';
import ErrorPage from './components/pages/errorPage';
import MapSuggestionsPage from './components/pages/mapSuggestionsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PlayerSelectPage />,
    errorElement: <ErrorPage />
  },
  {
    path: '/suggestions/:playerId',
    element: <MapSuggestionsPage />,
  }
]);

export default function App() {
  return (
    <div className='bg-dark min-h-screen'>
      <RouterProvider router={router} />
    </div>
  );
}