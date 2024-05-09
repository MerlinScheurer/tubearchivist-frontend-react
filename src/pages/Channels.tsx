import { Link, useLoaderData, useOutletContext } from 'react-router-dom';
import loadChannelList from '../loader/loadChannelList';
import Routes from '../configuration/routes/RouteList';
import iconGridView from '/img/icon-gridview.svg';
import iconListView from '/img/icon-listview.svg';
import iconAdd from '/img/icon-add.svg';
import { useEffect, useState } from 'react';
import Pagination, { PaginationType } from '../components/Pagination';
import { ConfigType, ViewLayout } from './Home';
import updateUserConfig, { UserConfig } from '../action/updateUserConfig';
import { OutletContextType } from '../Base';
import updateChannelSubscription from '../action/updateChannelSubscription';

export type ChannelType = {
    channel_active: boolean;
    channel_banner_url: string;
    channel_description: string;
    channel_id: string;
    channel_last_refresh: string;
    channel_name: string;
    channel_subs: number;
    channel_subscribed: boolean;
    channel_tags: string[];
    channel_thumb_url: string;
    channel_tvart_url: string;
    channel_views: number;
};

type ChannelsListResponse = {
    data: ChannelType[];
    paginate: PaginationType;
    config?: ConfigType;
};

type ChannelsLoaderDataType = {
    userConfig: UserConfig;
};

const Channels = () => {
    const { userConfig } = useLoaderData() as ChannelsLoaderDataType;
    const [currentPage, setCurrentPage] =
        useOutletContext() as OutletContextType;

    const [channelListResponse, setChannelListResponse] =
        useState<ChannelsListResponse>();
    const [showSubscribedOnly, setShowSubscribedOnly] = useState(
        userConfig.show_subed_only || false
    );
    const [view, setView] = useState<ViewLayout>(
        userConfig.view_style_channel || 'grid'
    );
    const [showAddForm, setShowAddForm] = useState(false);
    const [refreshChannelList, setRefreshChannelList] = useState(false);

    useEffect(() => {
        (async () => {
            const userConfig = {
                show_subed_only: showSubscribedOnly,
                view_style_channel: view,
            };

            await updateUserConfig(userConfig);
        })();
    }, [showSubscribedOnly, view]);

    useEffect(() => {
        (async () => {
            //TODO: take showSubscribedOnly into account when loading channels
            const channelListResponse = await loadChannelList(currentPage);

            setChannelListResponse(channelListResponse);
            setRefreshChannelList(false);
        })();
    }, [currentPage, showSubscribedOnly, refreshChannelList]);

    const channels = channelListResponse?.data;
    const pagination = channelListResponse?.paginate;
    const channelCount = channels?.length;

    // TODO: get from api
    const request = { user: { groups: [], is_staff: false } };

    const isAdmin = true;

    request &&
        (request.user.groups.some((group) => {
            group === 'admin';
        }) ||
            request.user.is_staff);

    return (
        <div className="boxed-content">
            <div className="title-split">
                <div className="title-bar">
                    <h1>Channels</h1>
                </div>
                {isAdmin && (
                    <div className="title-split-form">
                        <img
                            id="animate-icon"
                            onClick={() => {
                                setShowAddForm(!showAddForm);
                            }}
                            src={iconAdd}
                            alt="add-icon"
                            title="Subscribe to Channels"
                        />
                        {showAddForm && (
                            <div className="show-form">
                                <div>
                                    <label>Subscribe to channels:</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Input channel ID, URL or Video of a channel"
                                    />
                                </div>

                                <button type="submit">Subscribe</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div id="notifications" data="subscription"></div>
            <div className="view-controls">
                <div className="toggle">
                    <span>Show subscribed only:</span>
                    <div className="toggleBox">
                        <input
                            id="show_subed_only"
                            onClick={() => {
                                setShowSubscribedOnly(!showSubscribedOnly);
                            }}
                            type="checkbox"
                            checked={showSubscribedOnly}
                        />
                        {!showSubscribedOnly && (
                            <label htmlFor="" className="ofbtn">
                                Off
                            </label>
                        )}
                        {showSubscribedOnly && (
                            <label htmlFor="" className="onbtn">
                                On
                            </label>
                        )}
                    </div>
                </div>
                <div className="view-icons">
                    <img
                        src={iconGridView}
                        onClick={() => {
                            setView('grid');
                        }}
                        data-origin="channel"
                        data-value="grid"
                        alt="grid view"
                    />
                    <img
                        src={iconListView}
                        onClick={() => {
                            setView('list');
                        }}
                        data-origin="channel"
                        data-value="list"
                        alt="list view"
                    />
                </div>
            </div>
            <h2>Total channels: {channelCount}</h2>
            <div className={`channel-list ${view}`}>
                {!channels && <h2>No channels found...</h2>}

                {channels &&
                    channels.map((channel) => {
                        return (
                            <div className={`channel-item ${view}`}>
                                <div className={`channel-banner ${view}`}>
                                    <Link
                                        to={Routes.Channel(channel.channel_id)}
                                    >
                                        <img
                                            src={`/cache/channels/${channel.channel_id}_banner.jpg`}
                                            alt={`${channel.channel_id}-banner`}
                                        />
                                    </Link>
                                </div>
                                <div className={`info-box info-box-2 ${view}`}>
                                    <div className="info-box-item">
                                        <div className="round-img">
                                            <Link
                                                to={Routes.Channel(
                                                    channel.channel_id
                                                )}
                                            >
                                                <img
                                                    src={`/cache/channels/${channel.channel_id}_thumb.jpg`}
                                                    alt="channel-thumb"
                                                />
                                            </Link>
                                        </div>
                                        <div>
                                            <h3>
                                                <Link
                                                    to={Routes.Channel(
                                                        channel.channel_id
                                                    )}
                                                >
                                                    {channel.channel_name}
                                                </Link>
                                            </h3>
                                            {channel.channel_subs >=
                                                1000000 && (
                                                <p>
                                                    Subscribers:{' '}
                                                    {channel.channel_subs}
                                                </p>
                                            )}
                                            {channel.channel_subs < 1000000 && (
                                                <p>
                                                    Subscribers:{' '}
                                                    {channel.channel_subs}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="info-box-item">
                                        <div>
                                            <p>
                                                Last refreshed:{' '}
                                                {channel.channel_last_refresh}
                                            </p>
                                            {channel.channel_subscribed && (
                                                <button
                                                    className="unsubscribe"
                                                    type="button"
                                                    data-type="channel"
                                                    data-id={channel.channel_id}
                                                    onClick={async () => {
                                                        await updateChannelSubscription(
                                                            channel.channel_id,
                                                            false
                                                        );
                                                        setRefreshChannelList(
                                                            true
                                                        );
                                                    }}
                                                    title={`Unsubscribe from ${channel.channel_name}`}
                                                >
                                                    Unsubscribe
                                                </button>
                                            )}
                                            {!channel.channel_subscribed && (
                                                <button
                                                    type="button"
                                                    data-type="channel"
                                                    data-id={channel.channel_id}
                                                    onClick={async () => {
                                                        await updateChannelSubscription(
                                                            channel.channel_id,
                                                            true
                                                        );
                                                        setRefreshChannelList(
                                                            true
                                                        );
                                                    }}
                                                    title={`Subscribe to ${channel.channel_name}`}
                                                >
                                                    Subscribe
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>
            <div className="boxed-content">
                <Pagination pagination={pagination} setPage={setCurrentPage} />
            </div>
        </div>
    );
};

export default Channels;
