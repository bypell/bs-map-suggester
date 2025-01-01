import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import PlayerSelectPage from './components/pages/PlayerSelectPage';
import ErrorPage from './components/pages/errorPage';
import MapSuggestionsPage from './components/pages/mapSuggestionsPage';

const basename = '/bs-map-suggester/';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PlayerSelectPage />,
    errorElement: <ErrorPage />
  },
  {
    path: '/suggestions/',
    element: <MapSuggestionsPage />,
  },
  { basename }
]);

export default function App() {
  return (
    <div className='bg-dark min-h-screen'>
      <RouterProvider router={router} />
    </div>
  );
}