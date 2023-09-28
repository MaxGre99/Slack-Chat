import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { actions as channelsActions } from './channelsSlice';

const messagesAdapter = createEntityAdapter();
// По умолчанию: { ids: [], entities: {} }
const initialState = messagesAdapter.getInitialState();

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: messagesAdapter.addOne,
    addMessages: messagesAdapter.addMany,
  },
  extraReducers: (builder) => {
    builder.addCase(channelsActions.removeChannel, (state, action) => {
      const channelId = action.payload;
      const restEntities = Object.values(state.entities).filter((e) => e.channelId !== channelId);
      messagesAdapter.setAll(state, restEntities);
    });
  },
});

export const selectors = messagesAdapter.getSelectors((state) => state.messagesReducer);
export const { actions } = messagesSlice;
export default messagesSlice.reducer;
