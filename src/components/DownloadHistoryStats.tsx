import humanFileSize from "./humanFileSize";
import formatDate from "./formatDates";
import formatNumbers from "./formatNumbers";
import { DownloadHistoryStatsType } from "../pages/SettingsDashboard";

type DownloadHistoryStatsProps = {
  downloadHistoryStats?: DownloadHistoryStatsType;
  useSI: boolean;
};

const DownloadHistoryStats = ({
  downloadHistoryStats,
  useSI,
}: DownloadHistoryStatsProps) => {
  if (!downloadHistoryStats) {
    return <p id="loading">Loading...</p>;
  }

  return downloadHistoryStats.map(({ date, count, media_size }, index) => {
    const videoText = count === 1 ? "Video" : "Videos";
    const intlDate = formatDate(date);

    return (
      <div key={index} className="info-box-item">
        <h3>{intlDate}</h3>
        <p>
          +{formatNumbers(count)} {videoText}
          <br />
          {humanFileSize(media_size, useSI)}
        </p>
      </div>
    );
  });
};

export default DownloadHistoryStats;
