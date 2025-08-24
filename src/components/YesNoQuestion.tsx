import { Form, Radio, Typography } from "antd";
import type { Question } from "../models/quiz";

const { Text } = Typography;

export default function YesNoQuestion({ question }: { question: Question }) {
  return (
    <div className="min-h-[200px] space-y-4">
      {question.lines?.map((line) => (
        <div
          key={line.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
            padding: "8px 12px",
            border: "1px solid #f0f0f0",
            borderRadius: 8,
          }}
        >
          <Text>{line.text}</Text>

          <Form.Item
            name={[`answer_${question.id}`, String(line.id)]}
            style={{ margin: 0 }}
            rules={[{ required: true, message: "Choose option." }]}
          >
            <Radio.Group style={{ display: "flex", gap: 16 }}>
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </Form.Item>
        </div>
      ))}
    </div>
  );
}
