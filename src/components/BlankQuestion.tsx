import { Form, Select, Typography } from "antd";
import type { Question } from "../models/quiz";

const { Paragraph } = Typography;

export default function BlankQuestion({ question }: { question: Question }) {
  const parts = question.text.split("___");

  return (
<div className=" min-h-[248px]">
      <Paragraph>
      {parts.map((part, index) => (
        <span key={index}>
          {part}
          {/* Only render a blank if it exists for this position */}
          {question.blanks && index < question.blanks.length && (
            <Form.Item
              name={[`answer_${question.id}`,""+question.blanks[index].id]}
    
              style={{ display: "inline-block", margin: "0 8px", width: "100%" }}
            >
              <Select placeholder="Select..." className=" w-full block">
                {question.blanks[index].options.map((opt) => (
                  <Select.Option key={opt.id} value={opt.id} >
                    {opt.text}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}
        </span>
      ))}
    </Paragraph>
</div>
  );
}
