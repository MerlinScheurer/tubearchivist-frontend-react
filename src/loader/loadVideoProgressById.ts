import getCookie from '../components/getCookie';

const loadVideoProgressById = async (youtubeId: string) => {
    const headers = new Headers();

    const csrfCookie = getCookie('csrftoken');
    if (csrfCookie) {
        headers.append('X-CSRFToken', csrfCookie);
    }

    const response = await fetch(`/api/video/${youtubeId}/progress/`, {
        headers,
        credentials: 'same-origin',
    });

    const videoProgress = await response.json();
    console.log('loadVideoProgressById', videoProgress);

    return videoProgress;
};

export default loadVideoProgressById;
