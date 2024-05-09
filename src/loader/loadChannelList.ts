import getCookie from '../components/getCookie';

const loadChannelList = async (page: number) => {
    const params = new URL(document.location).searchParams;

    console.log(params);

    const headers = new Headers();

    const csrfCookie = getCookie('csrftoken');
    if (csrfCookie) {
        headers.append('X-CSRFToken', csrfCookie);
    }

    const response = await fetch(`/api/channel/?page=${page}`, {
        headers,
        credentials: 'same-origin',
    });

    const channels = await response.json();
    console.log('loadChannelList', channels);

    return channels;
};

export default loadChannelList;
