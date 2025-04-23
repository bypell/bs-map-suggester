import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import PlayerSelectPage from './components/pages/PlayerSelectPage';
import ErrorPage from './components/pages/ErrorPage';
import MapSuggestionsPage from './components/pages/MapSuggestionsPage';
import { SuggestionsProvider } from './context/suggestionsContext';

const router = createBrowserRouter([
  {
    path: '/bs-map-suggester/',
    element: <PlayerSelectPage />,
    errorElement: <ErrorPage />
  },
  {
    path: '/bs-map-suggester/suggestions/',
    element: <MapSuggestionsPage />,
    errorElement: <ErrorPage />
  }
]);

export default function App() {
  return (
    <SuggestionsProvider>
      <div className='bg-dark min-h-screen'>
        <RouterProvider router={router} />
      </div>
    </SuggestionsProvider>
  );
}