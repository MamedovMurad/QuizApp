import { useState, useEffect } from 'react';
import {
  Layout,
  Menu as AntMenu,
  Dropdown,
  Drawer,
  Button,
} from 'antd';
import {
  HomeOutlined,
  PieChartOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  DownOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';

const { Header, Sider, Content, Footer } = Layout;

const menuItems = [
  { key: '/', label: 'Home', icon: <HomeOutlined /> },
  { key: '/quiz/results', label: 'My Exam Results', icon: <PieChartOutlined /> },
  { key: '/admin/quiz/list', label: 'Questions', icon: <PieChartOutlined /> },
  { key: '/admin/groups', label: 'Question types', icon: <PieChartOutlined /> },


];

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    navigate('/login');
  };

  const dropdownMenu = (
    <AntMenu>
      <AntMenu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </AntMenu.Item>
    </AntMenu>
  );

  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderMenu = (
    <AntMenu
      theme="light"
      mode="inline"
      selectedKeys={[location.pathname]}
      onClick={({ key }) => {
        navigate(key);
        if (isMobile) setDrawerVisible(false);
      }}
      items={menuItems}
    />
  );



  return (
    <Layout style={{ minHeight: '100vh' }}>
      {!isMobile && (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          theme="light"
          width={220}
          className="shadow-lg fixed left-0 top-0 bottom-0 z-20"
        >
          <div
            className={`text-2xl font-bold text-blue-600 select-none py-4 transition-all duration-300 ${collapsed ? 'text-center' : 'text-left px-6'
              }`}
          >
            {!collapsed ? 'QuizApp' : 'Q'}
          </div>
          {renderMenu}
        </Sider>
      )}

      {isMobile && (
        <Drawer
          title="QuizApp"
          placement="left"
          closable
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          bodyStyle={{ padding: 0 }}
        >
          {renderMenu}
        </Drawer>
      )}

      <Layout
        style={{

          transition: 'margin-left 0.2s',
        }}
      >
        <Header
          className="shadow-sm flex items-center justify-between px-4 h-12 z-10"
          style={{
            backgroundColor: 'white',
            position: isMobile ? 'fixed' : 'static',
            top: isMobile ? 0 : undefined,
            left: isMobile ? 0 : undefined,
            right: isMobile ? 0 : undefined,
            height: 48,
            display: 'flex',
            alignItems: 'center',
            zIndex: 1001,
          }}
        >
          {isMobile ? (
            <Button
              icon={<MenuOutlined />}
              onClick={() => setDrawerVisible(true)}
              type="text"
              className="text-xl text-gray-700 hover:text-blue-600"
            />
          ) : (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-xl text-gray-700 hover:text-blue-600 transition"
              aria-label="Toggle sidebar"
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </button>
          )}

          <div className="text-lg font-semibold text-gray-800">Dashboard</div>

          <Dropdown overlay={dropdownMenu} trigger={['click']}>
            <div className="cursor-pointer text-gray-700 hover:text-blue-600 select-none flex items-center gap-1">
              {localStorage.getItem('name')}
              <DownOutlined />
            </div>
          </Dropdown>
        </Header>

        <Content
          className="p-4 bg-gray-100 overflow-auto"
          style={{


          }}
        >
          <div className="bg-gradient-to-br rounded-xl shadow-sm min-h-full from-blue-50 p-6 to-blue-100">
            <Outlet />
          </div>
        </Content>

        <Footer className="text-center text-gray-500 text-sm py-2">
          © {new Date().getFullYear()} QuizApp. All rights reserved.
        </Footer>
      </Layout>
    </Layout>
  );
}
