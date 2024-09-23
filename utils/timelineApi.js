import apiClient from "./axios";

export const getTimeline = (page = 1) => {
    return apiClient.get('/timeline', {
        params: {
            page,
        },
    });
};

export const likePost = (post_id) => {
    console.log("post_id", post_id);
    const formData = new FormData();
    formData.append('post_id', post_id);

    return apiClient.post('/like', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const unlikePost = (post_id) => {
    console.log("post_id", post_id);
    const formData = new FormData();
    formData.append('post_id', post_id);

    return apiClient.post('/unlike', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};