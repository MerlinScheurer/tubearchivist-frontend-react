import { Fragment, useEffect, useState } from "react";
import SettingsNavigation from "../components/SettingsNavigation";
import loadStatsVideo from "../api/loader/loadStatsVideo";
import humanFileSize from "../components/humanFileSize";
import loadStatsChannel from "../api/loader/loadStatsChannel";
import loadStatsPlaylist from "../api/loader/loadStatsPlaylist";
import DashboardInfoBoxItem from "../components/DashboardInfoBoxItem";
import loadStatsDownload from "../api/loader/loadStatsDownload";
import loadStatsWatchProgress from "../api/loader/loadStatsWatchProgress";
import loadStatsDownloadHistory from "../api/loader/loadStatsDownloadHistory";
import formatDate from "../components/formatDates";
import formatNumbers from "../components/formatNumbers";
import loadStatsBiggestChannels from "../api/loader/loadStatsBiggestChannels";
import { Link } from "react-router-dom";
import Routes from "../configuration/routes/RouteList";

type VideoStatsType = {
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

type ChannelStatsType = {
  doc_count: number;
  active_true: number;
  subscribed_true: number;
};

type PlaylistStatsType = {
  doc_count: number;
  active_false: number;
  active_true: number;
  subscribed_true: number;
};

type DownloadStatsType = {
  pending: number;
  pending_videos: number;
  pending_shorts: number;
  pending_streams: number;
};

type WatchProgressStatsType = {
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

type DownloadHistoryStatsType = DownloadHistoryType[];

type BiggestChannelsType = {
  id: string;
  name: string;
  doc_count: number;
  duration: number;
  duration_str: string;
  media_size: number;
};

type BiggestChannelsStatsType = BiggestChannelsType[];

const DashboardOverview = ({
  videoStats,
  useSI,
}: {
  videoStats?: VideoStatsType;
  useSI: boolean;
}) => {
  if (!videoStats) {
    return <p id="loading">Loading...</p>;
  }

  const cards = [
    {
      title: "All: ",
      data: {
        Videos: formatNumbers(videoStats?.doc_count || 0),
        ["Media Size"]: humanFileSize(videoStats?.media_size || 0, useSI),
        Duration: videoStats?.duration_str,
      },
    },
    {
      title: "Active: ",
      data: {
        Videos: formatNumbers(videoStats?.active_true?.doc_count || 0),
        ["Media Size"]: humanFileSize(
          videoStats?.active_true?.media_size || 0,
          useSI,
        ),
        Duration: videoStats?.active_true?.duration_str || "NA",
      },
    },
    {
      title: "Inactive: ",
      data: {
        Videos: formatNumbers(videoStats?.active_false?.doc_count || 0),
        ["Media Size"]: humanFileSize(
          videoStats?.active_false?.media_size || 0,
          useSI,
        ),
        Duration: videoStats?.active_false?.duration_str || "NA",
      },
    },
  ];

  return cards.map((card, index) => {
    return (
      <Fragment key={index}>
        <DashboardInfoBoxItem title={card.title} card={card.data} />
      </Fragment>
    );
  });
};

const DashboardVideoType = ({
  videoStats,
  useSI,
}: {
  videoStats?: VideoStatsType;
  useSI: boolean;
}) => {
  if (!videoStats) {
    return <p id="loading">Loading...</p>;
  }

  const cards = [
    {
      title: "Regular Videos: ",
      data: {
        Videos: formatNumbers(videoStats?.type_videos?.doc_count || 0),
        ["Media Size"]: humanFileSize(
          videoStats?.type_videos?.media_size || 0,
          useSI,
        ),
        Duration: videoStats?.type_videos?.duration_str || "NA",
      },
    },
    {
      title: "Shorts: ",
      data: {
        Videos: formatNumbers(videoStats?.type_shorts?.doc_count || 0),
        ["Media Size"]: humanFileSize(
          videoStats?.type_shorts?.media_size || 0,
          useSI,
        ),
        Duration: videoStats?.type_shorts?.duration_str || "NA",
      },
    },
    {
      title: "Streams: ",
      data: {
        Videos: formatNumbers(videoStats?.type_streams?.doc_count || 0),
        ["Media Size"]: humanFileSize(
          videoStats?.type_streams?.media_size || 0,
          useSI,
        ),
        Duration: videoStats?.type_streams?.duration_str || "NA",
      },
    },
  ];

  return cards.map((card, index) => {
    return (
      <Fragment key={index}>
        <DashboardInfoBoxItem title={card.title} card={card.data} />
      </Fragment>
    );
  });
};

const DashboardApplication = ({
  channelStats,
  playlistStats,
  downloadStats,
}: {
  channelStats?: ChannelStatsType;
  playlistStats?: PlaylistStatsType;
  downloadStats?: DownloadStatsType;
}) => {
  if (!channelStats || !playlistStats || !downloadStats) {
    return <p id="loading">Loading...</p>;
  }

  const cards = [
    {
      title: "Channels: ",
      data: {
        Subscribed: formatNumbers(channelStats.subscribed_true || 0),
        Active: formatNumbers(channelStats.active_true || 0),
        Total: formatNumbers(channelStats.doc_count || 0),
      },
    },
    {
      title: "Playlists: ",
      data: {
        Subscribed: formatNumbers(playlistStats.subscribed_true || 0),
        Active: formatNumbers(playlistStats.active_true || 0),
        Total: formatNumbers(playlistStats.doc_count || 0),
      },
    },
    {
      title: `Downloads Pending: ${downloadStats.pending || 0}`,
      data: {
        Videos: formatNumbers(downloadStats.pending_videos || 0),
        Shorts: formatNumbers(downloadStats.pending_shorts || 0),
        Streams: formatNumbers(downloadStats.pending_streams || 0),
      },
    },
  ];

  return cards.map((card, index) => {
    return (
      <Fragment key={index}>
        <DashboardInfoBoxItem title={card.title} card={card.data} />
      </Fragment>
    );
  });
};

const formatProgress = (progress: number) => {
  return (Number(progress) * 100).toFixed(2) ?? "0";
};

const formatTitle = (
  title: string,
  progress: number,
  progressFormatted: string,
) => {
  const hasProgess = !!progress;

  return hasProgess ? `${progressFormatted}% ${title}` : title;
};

const DashboardWatchProgress = ({
  watchProgressStats,
}: {
  watchProgressStats?: WatchProgressStatsType;
}) => {
  if (!watchProgressStats) {
    return <p id="loading">Loading...</p>;
  }

  const titleWatched = formatTitle(
    "Watched",
    watchProgressStats?.watched?.progress,
    formatProgress(watchProgressStats?.watched?.progress),
  );

  const titleUnwatched = formatTitle(
    "Unwatched",
    watchProgressStats?.unwatched?.progress,
    formatProgress(watchProgressStats?.unwatched?.progress),
  );

  const cards = [
    {
      title: titleWatched,
      data: {
        Videos: formatNumbers(watchProgressStats?.watched?.items ?? 0),
        Seconds: formatNumbers(watchProgressStats?.watched?.duration ?? 0),
        Duration: watchProgressStats?.watched?.duration_str ?? "0s",
      },
    },
    {
      title: titleUnwatched,
      data: {
        Videos: formatNumbers(watchProgressStats?.unwatched?.items ?? 0),
        Seconds: formatNumbers(watchProgressStats?.unwatched?.duration ?? 0),
        Duration: watchProgressStats?.unwatched?.duration_str ?? "0s",
      },
    },
  ];

  return cards.map((card, index) => {
    return (
      <Fragment key={index}>
        <DashboardInfoBoxItem title={card.title} card={card.data} />
      </Fragment>
    );
  });
};

const DashboardDownloadHistory = ({
  downloadHistoryStats,
  useSI,
}: {
  downloadHistoryStats?: DownloadHistoryStatsType;
  useSI: boolean;
}) => {
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

const DashboardBiggestChannels = ({
  biggestChannelsStatsByCount,
  biggestChannelsStatsByDuration,
  biggestChannelsStatsByMediaSize,
  useSI,
}: {
  biggestChannelsStatsByCount?: BiggestChannelsStatsType;
  biggestChannelsStatsByDuration?: BiggestChannelsStatsType;
  biggestChannelsStatsByMediaSize?: BiggestChannelsStatsType;
  useSI: boolean;
}) => {
  if (
    !biggestChannelsStatsByCount &&
    !biggestChannelsStatsByDuration &&
    !biggestChannelsStatsByMediaSize
  ) {
    return <p id="loading">Loading...</p>;
  }

  return (
    <>
      <div className="info-box-item">
        <table className="agg-channel-table">
          <thead>
            <tr>
              <th>Name</th>
              <th className="agg-channel-right-align">Videos</th>
            </tr>
          </thead>

          <tbody>
            {biggestChannelsStatsByCount &&
              biggestChannelsStatsByCount.map(
                ({ id, name, doc_count }, index) => {
                  return (
                    <tr key={index}>
                      <td className="agg-channel-name">
                        <Link to={Routes.Channel(id)}>{name}</Link>
                      </td>
                      <td className="agg-channel-right-align">
                        {formatNumbers(doc_count)}
                      </td>
                    </tr>
                  );
                },
              )}
          </tbody>
        </table>
      </div>

      <div className="info-box-item">
        <table className="agg-channel-table">
          <thead>
            <tr>
              <th>Name</th>
              <th className="agg-channel-right-align">Duration</th>
            </tr>
          </thead>

          <tbody>
            {biggestChannelsStatsByDuration &&
              biggestChannelsStatsByDuration.map(
                ({ id, name, duration_str }, index) => {
                  return (
                    <tr key={index}>
                      <td className="agg-channel-name">
                        <Link to={Routes.Channel(id)}>{name}</Link>
                      </td>
                      <td className="agg-channel-right-align">
                        {duration_str}
                      </td>
                    </tr>
                  );
                },
              )}
          </tbody>
        </table>
      </div>

      <div className="info-box-item">
        <table className="agg-channel-table">
          <thead>
            <tr>
              <th>Name</th>
              <th className="agg-channel-right-align">Media Size</th>
            </tr>
          </thead>

          <tbody>
            {biggestChannelsStatsByCount &&
              biggestChannelsStatsByCount.map(
                ({ id, name, media_size }, index) => {
                  return (
                    <tr key={index}>
                      <td className="agg-channel-name">
                        <Link to={Routes.Channel(id)}>{name}</Link>
                      </td>
                      <td className="agg-channel-right-align">
                        {humanFileSize(media_size, useSI)}
                      </td>
                    </tr>
                  );
                },
              )}
          </tbody>
        </table>
      </div>
    </>
  );
};

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
            <DashboardOverview videoStats={videoStats} useSI={useSi} />
          </div>
        </div>
        <div className="settings-item">
          <h2>Video Type</h2>
          <div className="info-box info-box-3">
            <DashboardVideoType videoStats={videoStats} useSI={useSi} />
          </div>
        </div>
        <div className="settings-item">
          <h2>Application</h2>
          <div className="info-box info-box-3">
            <DashboardApplication
              channelStats={channelStats}
              playlistStats={playlistStats}
              downloadStats={downloadStats}
            />
          </div>
        </div>
        <div className="settings-item">
          <h2>Watch Progress</h2>
          <div className="info-box info-box-2">
            <DashboardWatchProgress watchProgressStats={watchProgressStats} />
          </div>
        </div>
        <div className="settings-item">
          <h2>Download History</h2>
          <div className="info-box info-box-4">
            <DashboardDownloadHistory
              downloadHistoryStats={downloadHistoryStats}
              useSI={false}
            />
          </div>
        </div>

        <div className="settings-item">
          <h2>Biggest Channels</h2>
          <div className="info-box info-box-3">
            <DashboardBiggestChannels
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
