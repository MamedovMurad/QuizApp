import { Button, Input, Tag, Tooltip } from 'antd';
import {
  SearchOutlined,
  FundViewOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  UserOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getQuizSessions } from '../../api/quiz';

interface ISession {
  user_id: number;
  id: number;
  finished_at: string;
  started_at: string;
  category_name: string; // 👈 əlavə et
}

export default function ExamResultsPage() {
  const [sessions, setSessions] = useState<ISession[] | null>(null);

  useEffect(() => {
    getQuizSessions().then((data) => {
      setSessions(data.data);
    });
  }, []);

  return (
    <div className=" ">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 flex items-center gap-3">
            <ClockCircleOutlined className="text-blue-500" />
            Exam Sessions
          </h1>
          <Input
            placeholder="Search by user or date..."
            prefix={<SearchOutlined />}
            className="max-w-sm"
            size="large"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions?.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-2xl transition duration-300 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <Tag icon={<UserOutlined />} color="blue">
                  User #{item.user_id}
                </Tag>
                <Tag color="green" className="text-sm">Session ID: {item.id}</Tag>
              </div>

              {/* ✅ Yeni Category badge */}
              <div className="mb-3 flex items-center gap-2 text-gray-600">
                <AppstoreOutlined className="text-gray-400" />
                <Tag color="purple">{item.category_name}</Tag>
              </div>

              <div className="mb-3 text-gray-600 flex items-center gap-2">
                <CalendarOutlined className="text-gray-400" />
                <span className="font-medium">Start:</span> {item.started_at}
              </div>
              <div className="mb-4 text-gray-600 flex items-center gap-2">
                <CalendarOutlined className="text-gray-400" />
                <span className="font-medium">End:</span> {item.finished_at}
              </div>

              <div className="flex justify-end">
                <Tooltip title="View Result">
                  <Link to={`/quiz/results/${item.id}`}>
                    <Button icon={<FundViewOutlined />} type="primary" size="middle" />
                  </Link>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>

        {sessions?.length === 0 && (
          <div className="text-center text-gray-500 mt-20 text-lg">No exam sessions found.</div>
        )}
      </div>
    </div>
  );
}
