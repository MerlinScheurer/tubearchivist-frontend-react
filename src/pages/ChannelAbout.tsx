import { useParams } from "react-router-dom";

const ChannelAbout = () => {
  const { channelId } = useParams();

  return <>ChannelAbout {channelId}</>;
};

export default ChannelAbout;
