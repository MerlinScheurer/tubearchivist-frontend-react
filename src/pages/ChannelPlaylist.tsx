import { useParams } from "react-router-dom";

const ChannelPlaylist = () => {
  const { channelId } = useParams();

  return <>ChannelPlaylist {channelId}</>;
};

export default ChannelPlaylist;
