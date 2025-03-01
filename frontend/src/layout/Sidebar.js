import './Sidebar.scss'

import React, { useState } from 'react'
import { router } from 'kea-router'
import { InviteTeam } from 'lib/components/InviteTeam'
import { Menu, Layout, Modal } from 'antd'
import {
    UserOutlined,
    ForkOutlined,
    FunnelPlotOutlined,
    SettingOutlined,
    RiseOutlined,
    PlusOutlined,
    SyncOutlined,
    AimOutlined,
    UsergroupAddOutlined,
    ContainerOutlined,
    LineChartOutlined,
    FundOutlined,
    ExperimentOutlined,
    ClockCircleOutlined,
    RetweetOutlined,
} from '@ant-design/icons'
import { useActions, useValues } from 'kea'
import { Link } from 'lib/components/Link'
import { sceneLogic } from 'scenes/sceneLogic'
import { dashboardsModel } from '~/models/dashboardsModel'
import whiteLogo from './../../public/posthog-logo-white.svg'
import { triggerResizeAfterADelay } from 'lib/utils'
import { useEscapeKey } from 'lib/hooks/useEscapeKey'

const itemStyle = { display: 'flex', alignItems: 'center' }

function Logo() {
    return (
        <div
            className="row logo-row d-flex align-items-center justify-content-center"
            style={{ margin: 16, height: 42, whiteSpace: 'nowrap', width: 168, overflow: 'hidden' }}
        >
            <img className="logo posthog-logo" src={whiteLogo} style={{ maxHeight: '100%' }} />
        </div>
    )
}

// to show the right page in the sidebar
const sceneOverride = {
    action: 'actions',
    funnel: 'funnels',
    editFunnel: 'funnels',
    person: 'people',
    dashboard: 'dashboards',
}

// to show the open submenu
const submenuOverride = {
    actions: 'events',
    liveActions: 'events',
    sessions: 'events',
    cohorts: 'people',
    retention: 'people',
}

export function Sidebar({ user, sidebarCollapsed, setSidebarCollapsed }) {
    const [inviteModalOpen, setInviteModalOpen] = useState(false)
    const collapseSidebar = () => {
        if (!sidebarCollapsed && window.innerWidth <= 991) {
            setSidebarCollapsed(true)
        }
    }
    const { scene, loadingScene } = useValues(sceneLogic)
    const { location } = useValues(router)
    const { push } = useActions(router)
    const { dashboards, pinnedDashboards } = useValues(dashboardsModel)

    useEscapeKey(collapseSidebar, [sidebarCollapsed])

    let activeScene = sceneOverride[loadingScene || scene] || loadingScene || scene
    const openSubmenu = submenuOverride[activeScene] || activeScene

    if (activeScene === 'dashboards') {
        const dashboardId = parseInt(location.pathname.split('/dashboard/')[1])
        const dashboard = dashboardId && dashboards.find((d) => d.id === dashboardId)
        if (dashboard && dashboard.pinned) {
            activeScene = `dashboard-${dashboardId}`
        }
    }

    return (
        <>
            <div
                className={`sidebar-responsive-overlay${!sidebarCollapsed ? ' open' : ''}`}
                onClick={collapseSidebar}
            />
            <Layout.Sider
                breakpoint="lg"
                collapsedWidth="0"
                className="bg-dark"
                collapsed={sidebarCollapsed}
                onCollapse={(sidebarCollapsed) => {
                    setSidebarCollapsed(sidebarCollapsed)
                    triggerResizeAfterADelay()
                }}
            >
                <Menu
                    className="h-100 bg-dark"
                    theme="dark"
                    selectedKeys={[activeScene]}
                    openKeys={[openSubmenu]}
                    mode="inline"
                >
                    <Logo />

                    {pinnedDashboards.map((dashboard, index) => (
                        <Menu.Item
                            key={`dashboard-${dashboard.id}`}
                            style={itemStyle}
                            data-attr={'pinned-dashboard-' + index}
                            title=""
                        >
                            <LineChartOutlined />
                            <span className="sidebar-label">{dashboard.name}</span>
                            <Link to={`/dashboard/${dashboard.id}`} onClick={collapseSidebar} />
                        </Menu.Item>
                    ))}

                    <Menu.Item key="dashboards" style={itemStyle} data-attr="menu-item-dashboards" title="">
                        <FundOutlined />
                        <span className="sidebar-label">Dashboards</span>
                        <Link to="/dashboard" onClick={collapseSidebar} />
                    </Menu.Item>

                    {pinnedDashboards.length > 0 ? <Menu.Divider /> : null}

                    <Menu.Item key="trends" style={itemStyle} data-attr="menu-item-trends" title="">
                        <RiseOutlined />
                        <span className="sidebar-label">{'Trends'}</span>
                        <Link to={'/trends'} onClick={collapseSidebar} />
                    </Menu.Item>

                    <Menu.SubMenu
                        key="events"
                        title={
                            <span style={itemStyle} data-attr="menu-item-events">
                                <ContainerOutlined />
                                <span className="sidebar-label">{'Events'}</span>
                            </span>
                        }
                        onTitleClick={() => {
                            collapseSidebar()
                            location.pathname !== '/events' && push('/events')
                        }}
                    >
                        <Menu.Item key="events" style={itemStyle} data-attr="menu-item-all-events">
                            <ContainerOutlined />
                            <span className="sidebar-label">{'All Events'}</span>
                            <Link to={'/events'} onClick={collapseSidebar} />
                        </Menu.Item>
                        <Menu.Item key="actions" style={itemStyle} data-attr="menu-item-actions">
                            <AimOutlined />
                            <span className="sidebar-label">{'Actions'}</span>
                            <Link to={'/actions'} onClick={collapseSidebar} />
                        </Menu.Item>
                        <Menu.Item key="liveActions" style={itemStyle} data-attr="menu-item-live-actions">
                            <SyncOutlined />
                            <span className="sidebar-label">{'Live Actions'}</span>
                            <Link to={'/actions/live'} onClick={collapseSidebar} />
                        </Menu.Item>
                        <Menu.Item key="sessions" style={itemStyle} data-attr="menu-item-sessions">
                            <ClockCircleOutlined />
                            <span className="sidebar-label">{'Sessions'}</span>
                            <Link to={'/sessions'} onClick={collapseSidebar} />
                        </Menu.Item>
                    </Menu.SubMenu>
                    <Menu.SubMenu
                        key="people"
                        title={
                            <span style={itemStyle} data-attr="menu-item-people">
                                <UserOutlined />
                                <span className="sidebar-label">{'People'}</span>
                            </span>
                        }
                        onTitleClick={() => {
                            collapseSidebar()
                            location.pathname !== '/people' && push('/people')
                        }}
                    >
                        <Menu.Item key="people" style={itemStyle} data-attr="menu-item-all-people">
                            <UserOutlined />
                            <span className="sidebar-label">{'All Users'}</span>
                            <Link to={'/people'} onClick={collapseSidebar} />
                        </Menu.Item>
                        <Menu.Item key="cohorts" style={itemStyle} data-attr="menu-item-cohorts">
                            <UsergroupAddOutlined />
                            <span className="sidebar-label">{'Cohorts'}</span>
                            <Link to={'/people/cohorts'} onClick={collapseSidebar} />
                        </Menu.Item>
                        <Menu.Item key="retention" style={itemStyle} data-attr="menu-item-retention">
                            <RetweetOutlined />
                            <span className="sidebar-label">{'Retention'}</span>
                            <Link to={'/people/retention'} onClick={collapseSidebar} />
                        </Menu.Item>
                    </Menu.SubMenu>
                    <Menu.Item key="funnels" style={itemStyle} data-attr="menu-item-funnels">
                        <FunnelPlotOutlined />
                        <span className="sidebar-label">{'Funnels'}</span>
                        <Link to={'/funnel'} onClick={collapseSidebar} />
                    </Menu.Item>
                    <Menu.Item key="paths" style={itemStyle} data-attr="menu-item-paths">
                        <ForkOutlined />
                        <span className="sidebar-label">{'Paths'}</span>
                        <Link to={'/paths'} onClick={collapseSidebar} />
                    </Menu.Item>
                    <Menu.Item key="experiments" style={itemStyle} data-attr="menu-item-feature-f">
                        <ExperimentOutlined />
                        <span className="sidebar-label">{'Experiments'}</span>
                        <Link to={'/experiments/feature_flags'} onClick={collapseSidebar} />
                    </Menu.Item>
                    <Menu.Item key="setup" style={itemStyle} data-attr="menu-item-setup">
                        <SettingOutlined />
                        <span className="sidebar-label">{'Setup'}</span>
                        <Link to={'/setup'} onClick={collapseSidebar} />
                    </Menu.Item>
                    <Menu.Item
                        key="invite"
                        style={itemStyle}
                        onClick={() => setInviteModalOpen(true)}
                        data-attr="menu-item-invite-team"
                    >
                        <PlusOutlined />
                        <span className="sidebar-label">{'Invite your team'}</span>
                    </Menu.Item>
                </Menu>

                <Modal visible={inviteModalOpen} footer={null} onCancel={() => setInviteModalOpen(false)}>
                    <InviteTeam user={user} />
                </Modal>
            </Layout.Sider>
        </>
    )
}
