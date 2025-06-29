import { Button, Card, Form } from "antd";
import { useEffect, useState } from "react";
import type { Question } from "../models/quiz";
import QuestionRenderer from "./questionRenderer";
import { transformOrderingAnswer } from "../utils/answers";
import Paragraph from "antd/es/typography/Paragraph";
import parse from "html-react-parser";

interface QuizFormProps {
  questions: Question[];
  onFinish?: (allAnswers: Record<number, any>) => void; // callback on finish
}

export default function QuizForm({ questions, onFinish }: QuizFormProps) {

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [form] = Form.useForm();

  const currentQuestion = questions[currentIndex];
  const questionKey = `answer_${currentQuestion.id}`;

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

  // Previous button handler
  // const goPrev = async () => {
  //   const currentAnswer = await saveCurrentAnswer();
  //   if (currentAnswer === null) return; // validation failed
  //   if (currentIndex > 0) {
  //     setCurrentIndex(currentIndex - 1);
  //   }
  // };

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
    <div className=" max-w-3xl mx-auto">
      <Card>
        <Paragraph>{currentQuestion?.title}</Paragraph>
        {
          currentQuestion?.image && <div><img className=" object-contain w-full max-h-[300px] rounded-2xl" src={currentQuestion?.image} alt="" /></div>
        }
        {
          (currentQuestion.type !== "blanks") && (
            currentQuestion.type !== "dragdrop" &&
            <Paragraph>
              {parse(currentQuestion?.text)} {/* əgər html-react-parser istifadə edirsinizsə */}
            </Paragraph>
          )
        }

        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          onFinish={onSubmit}
          key={currentQuestion.id} // reset form on question change
        >
          <QuestionRenderer question={currentQuestion} />

          <Form.Item className=" w-full ">
            <div className="flex justify-between items-center">
              {/* <Button
              type="default"
              onClick={goPrev}
              disabled={currentIndex === 0}
              style={{ marginRight: 8 }}
            >
              Previous
            </Button> */}

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
