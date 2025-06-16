import { Checkbox, Form, message } from "antd";
import type { Question } from "../models/quiz";
import { useState } from "react";

export default function MultipleQuestion({ question }: { question: Question }) {
  const [selectedValues, setSelectedValues] = useState<number[]>([]);

  const handleChange = (checkedValues: any) => {
    if (question.selection_limit && checkedValues.length > question.selection_limit) {
      message.warning(`Yalnız ${question.selection_limit} seçim edə bilərsiniz.`);
      return;
    }

    setSelectedValues(checkedValues);
  };

  return (
    <div className="min-h-[248px]">
      <Form.Item
        name={`answer_${question.id}`}
        initialValue={[]}
        rules={[{ required: true, message: "Zəhmət olmasa seçim edin." }]}
      >
        <Checkbox.Group className="w-full block" onChange={handleChange} value={selectedValues}>
          {question.options?.map((opt) => {
            const isChecked = selectedValues.includes(opt.id);
            const isDisabled =
              question.selection_limit &&
              selectedValues.length >= question.selection_limit &&
              !isChecked;

            return (
              <div
                key={opt.id}
                className={`border w-full mb-4 p-3 rounded cursor-pointer transition-colors duration-200
                  ${isChecked ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
                `}
              >
                <Checkbox
                  className="block w-full"
                  value={opt.id}
                  disabled={isDisabled||false}
                >
                  {opt.text}
                </Checkbox>
              </div>
            );
          })}
        </Checkbox.Group>
      </Form.Item>
    </div>
  );
}
