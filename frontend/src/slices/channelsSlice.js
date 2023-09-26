import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const channelsAdapter = createEntityAdapter();
// По умолчанию: { ids: [], entities: {} }
const initialState = channelsAdapter.getInitialState();

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChannel: channelsAdapter.addOne,
    addChannels: channelsAdapter.addMany,
    // Если нужна дополнительная обработка, то создаем свою функцию
    removeChannel: (state, { payload }) => {
      // ...
      // Внутри можем вызвать метод адаптера
      channelsAdapter.removeOne(state, payload);
    },
    updateChannel: channelsAdapter.updateOne,
  },
});

export const selectors = channelsAdapter.getSelectors((state) => state.channelsReducer);
export const { actions } = channelsSlice;
export default channelsSlice.reducer;
