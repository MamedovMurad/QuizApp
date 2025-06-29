import { Form, Select, Typography } from "antd";

import parse from "html-react-parser";
import type { HTMLReactParserOptions } from "html-react-parser";
import type { Question } from "../models/quiz";
import type { Text } from "domhandler";

const { Paragraph } = Typography;

export default function BlankQuestion({ question }: { question: Question }) {
  let blankIndex = 0;

  const options: HTMLReactParserOptions = {
    replace: (node) => {
      // Yalnız text node-lar üçün yoxlayırıq
      if (node.type === "text") {
        const textNode = node as Text;
        if (textNode.data.includes("___")) {
          const segments = textNode.data.split("___");

          const elements: any = [];

          segments.forEach((text, index) => {
            elements.push(<span key={`text-${index}`}>{text}</span>);

            if (
              index < segments.length - 1 &&
              question.blanks &&
              blankIndex < question.blanks.length
            ) {
              const blank = question.blanks[blankIndex];

              elements.push(
                <Form.Item
                  key={`blank-${blank.id}`}
                  name={[`answer_${question.id}`, String(blank.id)]}
                  style={{
                    display: "inline-block",
                    margin: "0 8px",
                    minWidth: "120px",
                  }}
                >
                  <Select placeholder="Seçin...">
                    {blank.options.map((opt) => (
                      <Select.Option key={opt.id} value={opt.id}>
                        {opt.text}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              );

              blankIndex++;
            }
          });

          return <>{elements}</>;
        }
      }
    },
  };

  return (
    <div className="min-h-[248px]">
      <Paragraph>{parse(question.text, options)}</Paragraph>
    </div>
  );
}
