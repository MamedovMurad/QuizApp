import { Form } from "antd";
import type { Question } from "../models/quiz";

import { useState } from "react";
import OrderingField from "./ordering-sub/OrderingField";

export default function OrderingQuestion({ question }: { question: Question }) {
  const [available, setAvailable] = useState(question.options ?? []);
  const fieldName = `answer_${question.id}`;

  return (
    <div>
      {/* <h3 className="text-lg mb-4">{question.text}</h3> */}

      <Form.Item
        name={fieldName}
        valuePropName="value"
        trigger="onChange"
        rules={[{ required: true, message: "Zəhmət olmasa sıralama edin." }]}
      >
        <OrderingField
          available={available}
          setAvailable={setAvailable}
        />
      </Form.Item>
    </div>
  );
}
