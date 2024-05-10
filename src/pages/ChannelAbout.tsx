import { useParams } from "react-router-dom";

function ChannelAbout() {
  const { channelId } = useParams();

  return <>ChannelAbout {channelId}</>;
}

export default ChannelAbout;
