import { Button, Form, Input, Typography, message } from 'antd';
import { LockOutlined, UserOutlined, NumberOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { register, sendOtp } from '../../api/auth';
import { useAuthContext } from '../../context/AuthProvider';
import { useState } from 'react';

export default function RegisterPage() {
  const { handleGetUser } = useAuthContext();
  const navigate = useNavigate();

  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [email, setEmail] = useState<string>("");

  const onFinishRegister = async (values: any) => {
    try {
      message.loading({ content: 'Registering...', key: 'register' });

      await register({
        email: values.email,
        password: values.password,
        password_confirmation: values.password_confirmation,
      });

      message.success({ content: 'Registration successful! Please check your email for OTP code.', key: 'register' });

      setEmail(values.email);
      setStep('verify'); // keçid OTP mərhələsinə
    } catch (err: any) {
      message.error({
        content: err.response?.data?.message || 'Registration failed',
        key: 'register',
      });
    }
  };

  const onFinishVerify = async (values: any) => {
    try {
      message.loading({ content: 'Verifying OTP...', key: 'verify' });

      await sendOtp({ email, code: values.code });

      await handleGetUser();
      message.success({ content: 'Account verified successfully!', key: 'verify' });

      navigate('/'); // Redirect to home/dashboard
    } catch (err: any) {
      message.error({
        content: err.response?.data?.message || 'OTP verification failed',
        key: 'verify',
      });
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-100">
      {/* Left Side */}
      <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-green-600 to-emerald-700 text-white">
        <div className="text-center px-10">
          <h1 className="text-5xl font-bold mb-4">
            {step === 'register' ? "Create Account" : "Verify Account"}
          </h1>
          <p className="text-lg">
            {step === 'register'
              ? "Join us and start your journey today"
              : "Enter the OTP code sent to your email"}
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center justify-center p-8 bg-white shadow-lg">
        <div className="w-full max-w-md">
          <Typography.Title level={2} className="!text-center !mb-6">
            {step === 'register' ? "Register" : "Verify OTP"}
          </Typography.Title>

          {step === 'register' ? (
            <Form
              name="register_form"
              onFinish={onFinishRegister}
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
                <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: 'Please input your password!' },
                  { min: 6, message: 'Password must be at least 6 characters' },
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
              </Form.Item>

              <Form.Item
                name="password_confirmation"
                label="Confirm Password"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Please confirm your password!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" size="large" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" size="large" className="w-full bg-green-600 hover:bg-green-700">
                  Register
                </Button>
              </Form.Item>

              <div className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <a className="text-green-600 hover:underline" href="/login">
                  Login
                </a>
              </div>
            </Form>
          ) : (
            <Form
              name="verify_form"
              onFinish={onFinishVerify}
              layout="vertical"
              requiredMark={false}
            >
              <Form.Item
                label="Email"
                initialValue={email}
              >
                <Input value={email} disabled size="large" />
              </Form.Item>

              <Form.Item
                name="code"
                label="OTP Code"
                rules={[{ required: true, message: 'Please input your OTP code!' }]}
              >
                <Input
                  prefix={<NumberOutlined />}
                  placeholder="Enter OTP code"
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" size="large" className="w-full bg-green-600 hover:bg-green-700">
                  Verify
                </Button>
              </Form.Item>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
}
