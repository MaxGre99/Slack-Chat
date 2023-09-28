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
    removeChannel: channelsAdapter.removeOne,
    upsertChannel: channelsAdapter.upsertOne,
  },
});

export const selectors = channelsAdapter.getSelectors((state) => state.channelsReducer);
export const { actions } = channelsSlice;
export default channelsSlice.reducer;
