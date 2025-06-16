import { Form, Radio } from "antd";
import { useState } from "react";
import type { Question } from "../models/quiz";


const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

export default function SingleQuestion({ question }: { question: Question }) {
  const [selectedValue, setSelectedValue] = useState<number | null>(null);

  return (
    <>
      {/* <Paragraph className="mb-4 font-semibold">{question.text}</Paragraph> */}
      <Form.Item
        name={`answer_${question.id}`}
        rules={[{ required: true, message: "Please select an option" }]}
      >
        <Radio.Group
          onChange={(e) => setSelectedValue(e.target.value)}
          value={selectedValue}
          className="w-full flex flex-col gap-3"
        >
          {question.options?.map((opt, idx) => {
            const isSelected = selectedValue === opt.id;
            return (
              <Radio
                key={opt.id}
                value={opt.id}
                
                className={`
                  w-full
                  rounded-lg
                  border
                  !p-3
                  cursor-pointer
                  flex items-center justify-start
                  transition-colors duration-200
                  !mb-5
                  ${isSelected ? "bg-blue-100 border-blue-600" : "border-gray-300 hover:bg-blue-50"}
                `}
                rootClassName="w-full p-3"
              >
               <div className=" flex w-full gap-x-10 ">
                 <span className="font-bold lowercase">{letters[idx]})</span>
                <span>{opt.text}</span>
               </div>
              </Radio>
            );
          })}
        </Radio.Group>
      </Form.Item>
    </>
  );
}
