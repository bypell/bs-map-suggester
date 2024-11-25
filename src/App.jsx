import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SelectPlayerPage from './components/pages/SelectPlayerPage';
import ErrorPage from './components/pages/errorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <SelectPlayerPage />,
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