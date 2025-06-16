import { Checkbox, Form } from "antd";
import type { Question } from "../models/quiz";



export default function MultipleQuestion({ question }: { question: Question }) {
  return (
    <div className="min-h-[248px]">
      {/* <Paragraph className="mb-4 font-semibold">{question.text}</Paragraph> */}
      <Form.Item name={`answer_${question.id}`}>
        <Checkbox.Group className="w-full block">
          {question.options?.map((opt) => (
            <Form.Item
              noStyle
              key={opt.id}
              shouldUpdate={(prevValues, curValues) => 
                prevValues[`answer_${question.id}`] !== curValues[`answer_${question.id}`]
              }
            >
              {({ getFieldValue }) => {
                const selectedValues = getFieldValue(`answer_${question.id}`) || [];
                const isChecked = selectedValues.includes(opt.id);

                return (
                  <div
                    className={`border w-full mb-4 p-3 rounded cursor-pointer transition-colors duration-200
                      ${isChecked ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
                    `}
                  >
                    <Checkbox
                      className="block w-full"
                      value={opt.id}
                    >
                      {opt.text}
                    </Checkbox>
                  </div>
                );
              }}
            </Form.Item>
          ))}
        </Checkbox.Group>
      </Form.Item>
    </div>
  );
}
