import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import storage from "redux-persist/lib/storage";

import { persistStore, persistReducer } from "redux-persist";

const middleware = [thunk];

const persistConfig = {
	key: "root",
	storage: storage
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(
	persistedReducer,
	{},
	composeWithDevTools(applyMiddleware(...middleware))
);
export const persistor = persistStore(store);
// const store = createStore(
// 	rootReducer,
// 	initialState,
// 	composeWithDevTools(applyMiddleware(...middleware), autoRehydrate())
// );

// export default store;
