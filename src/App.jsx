import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import PlayerSelectPage from './components/pages/PlayerSelectPage';
import ErrorPage from './components/pages/errorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PlayerSelectPage />,
    errorElement: <ErrorPage />
  },
  {
    path: '/suggestions',
    element: <div></div>
  }
]);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}