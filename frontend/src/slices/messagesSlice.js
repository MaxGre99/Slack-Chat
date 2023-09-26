import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const messagesAdapter = createEntityAdapter();
// По умолчанию: { ids: [], entities: {} }
const initialState = messagesAdapter.getInitialState();

const messagesSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addMessage: messagesAdapter.addOne,
    addMessages: messagesAdapter.addMany,
    // Если нужна дополнительная обработка, то создаем свою функцию
    removeMessage: (state, { payload }) => {
      // ...
      // Внутри можем вызвать метод адаптера
      messagesAdapter.removeOne(state, payload);
    },
    updateMessage: messagesAdapter.updateOne,
  },
});

export const selectors = messagesAdapter.getSelectors((state) => state.messagesReducer);
export const { actions } = messagesSlice;
export default messagesSlice.reducer;
