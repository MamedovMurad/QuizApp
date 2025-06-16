import { Button, Form, Input, Typography, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/auth';


export default function LoginPage() {
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      message.loading({ content: 'Logging in...', key: 'login' });

    await login(values.email, values.password);

      message.success({ content: 'Login successful!', key: 'login' });
      navigate('/'); // Redirect to home/dashboard
    } catch (err: any) {
      message.error({
        content: err.response?.data?.message || 'Login failed',
        key: 'login',
      });
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-100">
      {/* Left Side - Illustration or Branding */}
      <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="text-center px-10">
          <h1 className="text-5xl font-bold mb-4">Welcome Back</h1>
          <p className="text-lg">Please log in to continue your journey with us</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center p-8 bg-white shadow-lg">
        <div className="w-full max-w-md">
          <Typography.Title level={2} className="!text-center !mb-6">
            Login
          </Typography.Title>
          <Form
            name="login_form"
            onFinish={onFinish}
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Invalid email address' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Email"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                Log in
              </Button>
            </Form.Item>

            <div className="text-center text-sm text-gray-600">
              Don’t have an account?{' '}
              <a className="text-indigo-600 hover:underline" href="#">
                Register
              </a>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
