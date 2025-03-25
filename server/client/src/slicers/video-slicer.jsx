import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    Videos: [],
    VideosCount: 0
};

const videoSlicer = createSlice({
    name: 'VideoSlice',
    initialState,
    reducers: {
        addToViewLater: (state, action) => {
            state.Videos.push(action.payload);
            state.VideosCount = state.Videos.length;
        },
        removeFromViewLater: (state, action) => {
            state.Videos = state.Videos.filter(video => video.VideoId !== action.payload);
            state.VideosCount = state.Videos.length;
        },
        setWatchLater: (state, action) => {
            state.Videos = action.payload;
            state.VideosCount = action.payload.length;
        },
        clearWatchLater: (state) => {
            state.Videos = [];
            state.VideosCount = 0;
        }
    }
});

export const { addToViewLater, removeFromViewLater, setWatchLater, clearWatchLater } = videoSlicer.actions;
export default videoSlicer.reducer;
