import { SnackbarProvider } from "notistack";
import { Provider } from "react-redux";
import AppRouter from "./router";
import { store } from "./store";

const App = () => {
  return (
    <Provider store={store}>
      <SnackbarProvider>
        <AppRouter />
      </SnackbarProvider>
    </Provider>
  );
};

export default App;
