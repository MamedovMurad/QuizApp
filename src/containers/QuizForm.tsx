import { Button, Card, Form, Progress } from "antd";
import { useEffect, useState } from "react";
import type { Question } from "../models/quiz";
import QuestionRenderer from "./questionRenderer";
import { transformOrderingAnswer } from "../utils/answers";
import Paragraph from "antd/es/typography/Paragraph";
import parse from "html-react-parser";

interface QuizFormProps {
  questions: Question[];
  onFinish?: (allAnswers: Record<number, any>) => void; // callback on finish
  session: { created_at: string; expired_minute: string };
}

export default function QuizForm({ questions, onFinish ,session}: QuizFormProps) {
  // countdown state
  const [timeLeft, setTimeLeft] = useState(100 * 60); // 100 dəqiqə = 6000 saniyə

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [form] = Form.useForm();

  const currentQuestion = questions[currentIndex];
  const questionKey = `answer_${currentQuestion.id}`;

  // helper: format seconds into HH:MM:SS
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s].map((val) => String(val).padStart(2, "0")).join(":");
  };

  useEffect(() => {
  const startTime = new Date(session.created_at).getTime(); // UTC formatı gəlir
  const expireMs = parseInt(session.expired_minute, 10) * 60 * 1000; // dəqiqəni ms çevir
  const endTime = startTime + expireMs;

  const timer = setInterval(() => {
    const now = Date.now();
    const remaining = Math.floor((endTime - now) / 1000); // saniyə ilə qalıq vaxt

    if (remaining <= 0) {
      clearInterval(timer);
      setTimeLeft(0);
      // Avtomatik submit
      // onSubmit();
    } else {
      setTimeLeft(remaining);
    }
  }, 1000);

  return () => clearInterval(timer);
}, [session]);


  // Reset and set form values when question changes
  useEffect(() => {
    form.resetFields();
    const prevAnswer = answers[currentQuestion.id];
    if (prevAnswer !== undefined) {
      form.setFieldsValue({ [questionKey]: prevAnswer });
    }
  }, [currentIndex, currentQuestion.id, form, answers]);

  // Save current answer into state
  const saveCurrentAnswer = async () => {
    try {
      const values = await form.validateFields([questionKey]);
      let currentAnswer = values[questionKey];

      if (currentQuestion.type === "ordering" && Array.isArray(currentAnswer)) {
        currentAnswer = transformOrderingAnswer(currentAnswer);
      }

      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: currentAnswer,
      }));

      return currentAnswer;
    } catch {
      return null;
    }
  };

  // Next button handler
  const goNext = async () => {
    const currentAnswer = await saveCurrentAnswer();
    if (currentAnswer === null) return; // validation failed
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Submit handler for Finish button
  const onSubmit = async () => {
    try {
      const values = await form.validateFields([questionKey]);
      let currentAnswer = values[questionKey];

      if (currentQuestion.type === "ordering" && Array.isArray(currentAnswer)) {
        currentAnswer = transformOrderingAnswer(currentAnswer);
      }

      const allAnswers = {
        ...answers,
        [currentQuestion.id]: currentAnswer,
      };

      setAnswers(allAnswers);

      if (onFinish) {
        onFinish(allAnswers);
        console.log(allAnswers);
      } else {
        console.log("Quiz finished. All answers:", allAnswers);
      }
    } catch {
      // validation failed, do nothing or show error
    }
  };

  return (
    <div className="mx-auto">
      <Card className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium text-gray-700">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span
            className={`text-lg font-bold ${
              timeLeft <= 10 ? "text-red-500" : "text-gray-700"
            }`}
          >
            ⏳ {formatTime(timeLeft)}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(((currentIndex + 1) / questions.length) * 100)}%
          </span>
        </div>
        <Progress
          percent={((currentIndex + 1) / questions.length) * 100}
          showInfo={false}
          strokeColor="#1677ff"
          strokeWidth={14}
          className="rounded-full"
        />
      </Card>

      <Card>
        <Paragraph>{currentQuestion?.title}</Paragraph>
        {currentQuestion?.image && (
          <div>
            <img
              className="object-contain w-full max-h-[300px] rounded-2xl"
              src={currentQuestion?.image}
              alt=""
            />
          </div>
        )}
        {currentQuestion.type !== "blanks" &&
          currentQuestion.type !== "dragdrop" && (
            <Paragraph>
              {parse(currentQuestion?.text)}{" "}
              {/* əgər html-react-parser istifadə edirsinizsə */}
            </Paragraph>
          )}

        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          onFinish={onSubmit}
          key={currentQuestion.id} // reset form on question change
        >
          <QuestionRenderer question={currentQuestion} />

          <Form.Item className="w-full">
            <div className="flex justify-between items-center">
              {currentIndex < questions.length - 1 && (
                <Button type="primary" onClick={goNext}>
                  Next
                </Button>
              )}

              {currentIndex === questions.length - 1 && (
                <Button type="primary" htmlType="submit">
                  Finish
                </Button>
              )}
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
