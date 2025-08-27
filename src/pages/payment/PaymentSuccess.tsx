// src/pages/PaymentSuccess.tsx
import { CheckCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <CheckCircleOutlined className="text-green-500 text-6xl mb-4" />
        <h1 className="text-2xl font-bold mb-2 text-gray-800">
          Payment Successful
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you! Your payment has been processed successfully. You can now
          fully use your package.
        </p>
        <Button
          type="primary"
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl w-full"
          onClick={() => navigate('/')}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}
