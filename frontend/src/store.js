import { createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

const middleware = [thunk];

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const composeEnhancers =
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || composeWithDevTools;

// const store = createStore(
//   rootReducer,
//   composeEnhancers(applyMiddleware(...middleware))
// );

const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(...middleware))
);

export const persistor = persistStore(store);

export default store;
