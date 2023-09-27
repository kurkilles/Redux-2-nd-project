import Cart from './components/Cart/Cart';
import Layout from './components/Layout/Layout';
import Products from './components/Shop/Products';
import Notification from './components/UI/Notification';
import { useEffect } from 'react';
import { uiActions } from './store/ui-slice';

import { useSelector, useDispatch } from 'react-redux';

let isInitial = true;

function App() {
  const showCart = useSelector(state => state.ui.cartIsVisible);
  const cart = useSelector(state => state.cart);
  const notification = useSelector(state => state.ui.notification);
  const dispatch = useDispatch();

  useEffect(() => {
    const sendCartData = async () => {
      dispatch(uiActions.showNotification({
        status: 'pending',
        title: "Sending...",
        message: "Sending cart data!"
      }))
      const response = fetch('https://hooks-test-6e0e4-default-rtdb.europe-west1.firebasedatabase.app/cart.json', { method: "PUT", body: JSON.stringify(cart) });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      dispatch(uiActions.showNotification({
        status: 'sucess',
        title: "Success",
        message: "Data send successfully!"
      }));

    };

    if (isInitial) {
      isInitial = false;
      return;
    }

    sendCartData().catch(error => {
      dispatch(uiActions.showNotification({
        status: 'error',
        title: "Error",
        message: "Something is not yes!"
      }));
    });
  }, [cart, dispatch]);


  return (
    <>
    {notification && <Notification status={notification.status} title={notification.title} message={notification.message} />}
      <Layout>
        {showCart && <Cart />}
        <Products />
      </Layout>
    </>
  );
}

export default App;
