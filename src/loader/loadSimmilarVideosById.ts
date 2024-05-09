import getCookie from '../components/getCookie';

const loadSimmilarVideosById = async (youtubeId: string) => {
    const headers = new Headers();

    const csrfCookie = getCookie('csrftoken');
    if (csrfCookie) {
        headers.append('X-CSRFToken', csrfCookie);
    }

    const response = await fetch(`/api/video/${youtubeId}/similar/`, {
        headers,
        credentials: 'include',
    });

    const videos = await response.json();
    console.log('loadSimmilarVideosById', videos);

    return videos;
};

export default loadSimmilarVideosById;
