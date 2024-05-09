import { useParams } from "react-router-dom";

function Playlist() {
  const { playlistId } = useParams();

  return <>Playlist {playlistId}</>;
}

export default Playlist;
