import { useEffect, useState } from "react";
import SettingsNavigation from "../components/SettingsNavigation";
import loadStatsVideo from "../api/loader/loadStatsVideo";
import loadStatsChannel from "../api/loader/loadStatsChannel";
import loadStatsPlaylist from "../api/loader/loadStatsPlaylist";
import loadStatsDownload from "../api/loader/loadStatsDownload";
import loadStatsWatchProgress from "../api/loader/loadStatsWatchProgress";
import loadStatsDownloadHistory from "../api/loader/loadStatsDownloadHistory";
import loadStatsBiggestChannels from "../api/loader/loadStatsBiggestChannels";
import OverviewStats from "../components/OverviewStats";
import VideoTypeStats from "../components/VideoTypeStats";
import ApplicationStats from "../components/ApplicationStats";
import WatchProgressStats from "../components/WatchProgressStats";
import DownloadHistoryStats from "../components/DownloadHistoryStats";
import BiggestChannelsStats from "../components/BiggestChannelsStats";

export type VideoStatsType = {
  doc_count: number;
  media_size: number;
  duration: number;
  duration_str: string;
  type_videos: {
    doc_count: number;
    media_size: number;
    duration: number;
    duration_str: string;
  };
  type_shorts: {
    doc_count: number;
    media_size: number;
    duration: number;
    duration_str: string;
  };
  active_true: {
    doc_count: number;
    media_size: number;
    duration: number;
    duration_str: string;
  };
  active_false: {
    doc_count: number;
    media_size: number;
    duration: number;
    duration_str: string;
  };
  type_streams: {
    doc_count: number;
    media_size: number;
    duration: number;
    duration_str: string;
  };
};

export type ChannelStatsType = {
  doc_count: number;
  active_true: number;
  subscribed_true: number;
};

export type PlaylistStatsType = {
  doc_count: number;
  active_false: number;
  active_true: number;
  subscribed_true: number;
};

export type DownloadStatsType = {
  pending: number;
  pending_videos: number;
  pending_shorts: number;
  pending_streams: number;
};

export type WatchProgressStatsType = {
  total: {
    duration: number;
    duration_str: string;
    items: number;
  };
  unwatched: {
    duration: number;
    duration_str: string;
    progress: number;
    items: number;
  };
  watched: {
    duration: number;
    duration_str: string;
    progress: number;
    items: number;
  };
};

type DownloadHistoryType = {
  date: string;
  count: number;
  media_size: number;
};

export type DownloadHistoryStatsType = DownloadHistoryType[];

type BiggestChannelsType = {
  id: string;
  name: string;
  doc_count: number;
  duration: number;
  duration_str: string;
  media_size: number;
};

export type BiggestChannelsStatsType = BiggestChannelsType[];

type DashboardStatsReponses = {
  videoStats?: VideoStatsType;
  channelStats?: ChannelStatsType;
  playlistStats?: PlaylistStatsType;
  downloadStats?: DownloadStatsType;
  watchProgressStats?: WatchProgressStatsType;
  downloadHistoryStats?: DownloadHistoryStatsType;
  biggestChannelsStats?: BiggestChannelsStatsType;
};

const SettingsDashboard = () => {
  const [useSi, setUseSi] = useState(false);

  const [response, setResponse] = useState<DashboardStatsReponses>({
    videoStats: undefined,
  });

  const videoStats = response?.videoStats;
  const channelStats = response?.channelStats;
  const playlistStats = response?.playlistStats;
  const downloadStats = response?.downloadStats;
  const watchProgressStats = response?.watchProgressStats;
  const downloadHistoryStats = response?.downloadHistoryStats;
  const biggestChannelsStats = response?.biggestChannelsStats;

  const biggestChannelsStatsByCount = biggestChannelsStats?.toSorted((a, b) => {
    if (a.doc_count > b.doc_count) {
      return -1;
    } else if (a.doc_count < b.doc_count) {
      return 1;
    }

    return 0;
  });
  const biggestChannelsStatsByDuration = biggestChannelsStats?.toSorted(
    (a, b) => {
      if (a.duration > b.duration) {
        return -1;
      } else if (a.duration < b.duration) {
        return 1;
      }

      return 0;
    },
  );
  const biggestChannelsStatsByMediaSize = biggestChannelsStats?.toSorted(
    (a, b) => {
      if (a.media_size > b.media_size) {
        return -1;
      } else if (a.media_size < b.media_size) {
        return 1;
      }

      return 0;
    },
  );

  useEffect(() => {
    (async () => {
      const all = await Promise.all([
        await loadStatsVideo(),
        await loadStatsChannel(),
        await loadStatsPlaylist(),
        await loadStatsDownload(),
        await loadStatsWatchProgress(),
        await loadStatsDownloadHistory(),
        await loadStatsBiggestChannels(),
      ]);

      const [
        videoStats,
        channelStats,
        playlistStats,
        downloadStats,
        watchProgressStats,
        downloadHistoryStats,
        biggestChannelsStats,
      ] = all;

      setResponse({
        videoStats,
        channelStats,
        playlistStats,
        downloadStats,
        watchProgressStats,
        downloadHistoryStats,
        biggestChannelsStats,
      });
    })();
  }, []);

  return (
    <>
      <div className="boxed-content">
        <SettingsNavigation />
        <div className="title-bar">
          <h1>Your Archive</h1>
        </div>
        <div className="settings-item">
          <h2>Overview</h2>
          <div className="info-box info-box-3">
            <OverviewStats videoStats={videoStats} useSI={useSi} />
          </div>
        </div>
        <div className="settings-item">
          <h2>Video Type</h2>
          <div className="info-box info-box-3">
            <VideoTypeStats videoStats={videoStats} useSI={useSi} />
          </div>
        </div>
        <div className="settings-item">
          <h2>Application</h2>
          <div className="info-box info-box-3">
            <ApplicationStats
              channelStats={channelStats}
              playlistStats={playlistStats}
              downloadStats={downloadStats}
            />
          </div>
        </div>
        <div className="settings-item">
          <h2>Watch Progress</h2>
          <div className="info-box info-box-2">
            <WatchProgressStats watchProgressStats={watchProgressStats} />
          </div>
        </div>
        <div className="settings-item">
          <h2>Download History</h2>
          <div className="info-box info-box-4">
            <DownloadHistoryStats
              downloadHistoryStats={downloadHistoryStats}
              useSI={false}
            />
          </div>
        </div>

        <div className="settings-item">
          <h2>Biggest Channels</h2>
          <div className="info-box info-box-3">
            <BiggestChannelsStats
              biggestChannelsStatsByCount={biggestChannelsStatsByCount}
              biggestChannelsStatsByDuration={biggestChannelsStatsByDuration}
              biggestChannelsStatsByMediaSize={biggestChannelsStatsByMediaSize}
              useSI={useSi}
            />
          </div>
        </div>
      </div>

      <div className="boxed-content">
        <div className="pagination">{/** dummy pagination for padding */}</div>
      </div>
    </>
  );
};

export default SettingsDashboard;
