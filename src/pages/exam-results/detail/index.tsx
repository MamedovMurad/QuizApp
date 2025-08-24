import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Card, Tag, Spin } from 'antd';
import { getResults } from '../../../api/quiz';
import ResultStatsChart from './_components/ResultStatsChart';
import { useAuthContext } from '../../../context/AuthProvider';

export default function ResultDetailPage() {
  const { id } = useParams();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();
  useEffect(() => {
    if (!id) return;
    getResults(id).then((res) => {
      setResult(res.data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spin size="large" />
      </div>
    );
  }

  const calculatePartialPoint = (item: any) => {
    const { type, correct, correct_answer, your_answer, point } = item;

    if (correct) return point;

    if (['blanks', 'multiple', 'dragdrop', 'yesno'].includes(type)) {
      if (!Array.isArray(correct_answer) || !Array.isArray(your_answer)) return 0;

      const total = correct_answer.length;
      let correctCount = 0;

      correct_answer.forEach((correctVal: string, index: number) => {
        if (your_answer[index] === correctVal) {
          correctCount += 1;
        }
      });

      return +(point * (correctCount / total)).toFixed(2);
    }

    return 0;
  };

  return (
    <div className="">
      <div className="max-w-6xl mx-auto space-y-10">
        <ResultStatsChart
          details={result.details}
          calculatePartialPoint={calculatePartialPoint}
        />
        {
          user?.role === 'admin' && <>
            <h1 className="text-3xl font-bold text-gray-800">Exam Result Summary</h1>

            <div className="space-y-6">
              {result.details.map((item: any, idx: number) => {
                const score = calculatePartialPoint(item);
                const total = item.point;

                let color = 'default';
                let label = '' as any;

                if (score === total) {
                  color = 'green';
                  label = (
                    <>
                      <CheckCircleOutlined /> {score} / {total}
                    </>
                  );
                } else if (score === 0) {
                  color = 'red';
                  label = (
                    <>
                      <CloseCircleOutlined /> {score} / {total}
                    </>
                  );
                } else {
                  color = 'orange';
                  label = (
                    <>
                      ~ {score} / {total}
                    </>
                  );
                }

                return (
                  <Card
                    key={item.question_id}
                    className={`transition-all duration-300 border-l-4 ${score === total
                      ? 'border-green-500'
                      : score === 0
                        ? 'border-red-500'
                        : 'border-orange-400'
                      } bg-white shadow-sm rounded-xl hover:shadow-lg`}
                    bodyStyle={{ padding: '20px' }}
                  >
                    <div className="flex items-start justify-between mb-3">

                      <div className="text-base font-semibold text-gray-800 leading-snug">
                        {idx + 1}.
                        <div dangerouslySetInnerHTML={{ __html: item.question_text }}>

                        </div>
                      </div>
                      <Tag
                        color={color}
                        className="text-sm flex items-center gap-1 px-2 py-0.5 rounded"
                      >
                        {label}
                      </Tag>
                    </div>

                    <div className="text-sm text-gray-700 mb-1">
                      <strong>Your Answer:</strong>{' '}
                      {Array.isArray(item.your_answer) && item.your_answer.length > 0 ? (
                        item.your_answer.flat().join(', ')
                      ) : (
                        <span className="italic text-gray-400">No Answer</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-700">
                      <strong>Correct Answer:</strong>{' '}
                      {Array.isArray(item.correct_answer) && item.correct_answer.length > 0 ? (
                        item.correct_answer.flat().join(', ')
                      ) : (
                        <span className="italic text-gray-400">No Correct Answer</span>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div></>
        }

      </div>
    </div>
  );
}
