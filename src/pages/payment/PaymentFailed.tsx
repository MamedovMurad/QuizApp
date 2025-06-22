// src/pages/PaymentFailed.tsx
import { CloseCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function PaymentFailed() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <CloseCircleOutlined className="text-red-500 text-6xl mb-4" />
        <h1 className="text-2xl font-bold mb-2 text-gray-800">
          Ödəniş uğursuz oldu
        </h1>
        <p className="text-gray-600 mb-6">
          Üzr istəyirik, ödəniş zamanı xəta baş verdi. Zəhmət olmasa yenidən cəhd edin və ya dəstək komandası ilə əlaqə saxlayın.
        </p>
        <Button
          type="primary"
          danger
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl w-full"
          onClick={() => navigate('/')}
        >
          Əsas səhifəyə qayıt
        </Button>
      </div>
    </div>
  );
}