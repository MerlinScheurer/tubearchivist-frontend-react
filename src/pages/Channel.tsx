import { useParams } from 'react-router-dom';

function Channel() {
    const { channelId } = useParams();

    return <>Channel {channelId}</>;
}

export default Channel;
