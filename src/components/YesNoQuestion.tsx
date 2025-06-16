import { Form, Radio, Typography } from "antd";
import type { Question } from "../models/quiz";

const {  Text } = Typography;

export default function YesNoQuestion({ question }: { question: Question }) {
  return (
    <div className="min-h-[200px] space-y-4">
      {/* <Paragraph strong>{question.text}</Paragraph> */}

      {question.lines?.map((line) => (
        <div key={line.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          <Text style={{ marginRight: 8 }}>{line.text}</Text>
          <Form.Item
            name={[`answer_${question.id}`, String(line.id)]}
            style={{ margin: 0 }}
            rules={[{ required: true, message: "Cavab seçin" }]}
          >
            <Radio.Group>
              <Radio value={true}>Bəli</Radio>
              <Radio value={false}>Xeyr</Radio>
            </Radio.Group>
          </Form.Item>
        </div>
      ))}
    </div>
  );
}
