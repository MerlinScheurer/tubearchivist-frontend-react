import { useParams } from "react-router-dom";

function ChannelPlaylist() {
  const { channelId } = useParams();

  return <>ChannelPlaylist {channelId}</>;
}

export default ChannelPlaylist;
