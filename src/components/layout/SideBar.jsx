import React, {useState, useContext} from 'react';
import {
    AppstoreOutlined,
    DollarOutlined,
    FolderOpenOutlined,
    LogoutOutlined,
    SettingOutlined,
    ShoppingOutlined,
    TeamOutlined
} from '@ant-design/icons';
import {Layout, Menu, Drawer} from 'antd';
import {Link, useNavigate} from 'react-router-dom';
import {UserContext} from '../../context/UserContext';
import Logo from '../logo/Logo';
import './SideBar.css';

const {Sider} = Layout;

const SideBar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const {logout} = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleDrawerToggle = () => {
        setDrawerVisible(!drawerVisible);
    };

    const renderMenu = (mode) => (
        <Menu theme="light"
            mode={mode}
            defaultSelectedKeys={
                ['1']
        }>
            <Menu.Item key="1"
                icon={<AppstoreOutlined/>}>
                <Link to="/">Tổng quan</Link>
            </Menu.Item>
            <Menu.Item key="2"
                icon={<ShoppingOutlined/>}>
                <Link to="/order">Đơn hàng</Link>
            </Menu.Item>
            <Menu.Item key="3"
                icon={<TeamOutlined/>}>
                <Link to="/customer">Khách hàng</Link>
            </Menu.Item>
            <Menu.SubMenu key="4"
                icon={<FolderOpenOutlined/>}
                title="Kho hàng">
                <Menu.Item key="7">
                    <Link to="/warehouse">Sản phẩm</Link>
                </Menu.Item>
                <Menu.Item key="8">
                    <Link to="/category">Danh mục</Link>
                </Menu.Item>
                <Menu.Item key="9">
                    <Link to="/supplier">Nhà cung cấp</Link>
                </Menu.Item>
            </Menu.SubMenu>
            <Menu.Item key="6"
                icon={<SettingOutlined/>}>
                <Link to="/setting">Cài đặt</Link>
            </Menu.Item>
            <Menu.Item key="logout"
                icon={<LogoutOutlined/>}
                onClick={handleLogout}>
                Đăng xuất
            </Menu.Item>
        </Menu>
    );

    return (
        <>
            <Sider collapsible
                collapsed={collapsed}
                onCollapse={
                    (value) => setCollapsed(value)
                }
                width={250}
                style={
                    {
                        backgroundColor: '#ffffff',
                        borderRight: '1px solid #f0f0f0'
                    }
            }>
                <div className={
                    `logo_img ${
                        collapsed ? 'collapsed' : ''
                    }`
                }>
                    <Link to="/"><Logo/></Link>
                    
                </div>
                {
                renderMenu('inline')
            } </Sider>

            <Drawer title="Menu" placement="left"
                closable={false}
                onClose={handleDrawerToggle}
                visible={drawerVisible}
                width="250px">
                {
                renderMenu('vertical')
            } </Drawer>

            <div className="sidebar-bottom">
                <Menu theme="light" mode="horizontal"
                    defaultSelectedKeys={
                        ['1']
                }>
                    <Menu.Item key="1"
                        icon={<AppstoreOutlined/>}>
                        <Link to="/"></Link>
                    </Menu.Item>
                    <Menu.Item key="2"
                        icon={<ShoppingOutlined/>}>
                        <Link to="/order"></Link>
                    </Menu.Item>
                    <Menu.Item key="3"
                        icon={<TeamOutlined/>}>
                        <Link to="/customer"></Link>
                    </Menu.Item>
                    <Menu.SubMenu key="4"
                        icon={<FolderOpenOutlined/>}>
                        <Menu.Item key="7">
                            <Link to="/warehouse">Sản phẩm</Link>
                        </Menu.Item>
                        <Menu.Item key="8">
                            <Link to="/category">Danh mục</Link>
                        </Menu.Item>
                        <Menu.Item key="9">
                            <Link to="/supplier">Nhà cung cấp</Link>
                        </Menu.Item>
                    </Menu.SubMenu>
                    <Menu.Item key="6"
                        icon={<SettingOutlined/>}>
                        <Link to="/setting"></Link>
                    </Menu.Item>
                    <Menu.Item key="logout"
                        icon={<LogoutOutlined/>}
                        onClick={handleLogout}></Menu.Item>
                </Menu>
            </div>

            <div className="mobile-menu-toggle"
                onClick={handleDrawerToggle}>
                <AppstoreOutlined/>
            </div>
        </>
    );
};

export default SideBar;
