import React, { useState } from "react";
import { Form } from "antd";
import type { Question } from "../models/quiz";
import { BlankDropTarget } from "./drag-drop-sub";
import parse from "html-react-parser";

import type { Text } from "domhandler";

interface AnswersMap {
  [blankId: number]: number | null;
}

interface Props {
  question: Question;
}

export default function DragDropBlankQuestion({ question }: Props) {
  const [answers, setAnswers] = useState<AnswersMap>(() => {
    const initial: AnswersMap = {};
    question.blanks?.forEach((b) => {
      initial[b.id] = null;
    });
    return initial;
  });

  function spacesToNbsp(text: string): string {
  return text.replace(/ +/g, (match) => {
    const count = match.length;
    const nbspCount = Math.floor(count );
    const normalSpaceCount = count ;
    return '\u00a0'.repeat(nbspCount) + ' '.repeat(normalSpaceCount);
  });
}
  const usedOptionIds = Object.values(answers).filter(
    (v): v is number => v !== null
  );

  const onChange = (newAnswers: AnswersMap) => {
    setAnswers(newAnswers);
  };

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, optionId: number) => {
    e.dataTransfer.setData("text/plain", optionId.toString());
    e.dataTransfer.effectAllowed = "move";
  };

  let blankIndex = 0;

  // Normal boşluqları non-breaking space ilə əvəz edirik
const safeText = spacesToNbsp(question.text);

  const htmlParsed = parse(safeText, {
    replace: (node) => {
      if (node.type === "text") {
        const textNode = node as Text;
        if (textNode.data.includes("___")) {
          const segments = textNode.data.split("___");
          const elements: any[] = [];

          segments.forEach((text, i) => {
            elements.push(<span key={`text-${i}`}>{text}</span>);

            if (
              i < segments.length - 1 &&
              question.blanks &&
              blankIndex < question.blanks.length
            ) {
              const blank = question.blanks[blankIndex];

              elements.push(
                <Form.Item
                  key={`blank-${blank.id}`}
                  name={["answer_" + question.id, blank.id.toString()]}
                  rules={[{ required: true, message: "Zəhmət olmasa seçim edin" }]}
                  style={{ display: "inline-block", margin: "0 8px" }}
                >
                  <BlankDropTarget
                    value={answers[blank.id]}
                    onChange={(val) => {
                      setAnswers((prev) => {
                        const newAnswers = { ...prev };
                        // digər blank-lardan eyni seçimi silirik
                        Object.entries(newAnswers).forEach(([bId, optId]) => {
                          if (optId === val) newAnswers[+bId] = null;
                        });
                        newAnswers[blank.id] = val;
                        onChange(newAnswers);
                        return newAnswers;
                      });
                    }}
                    options={question.options}
                  />
                </Form.Item>
              );

              blankIndex++;
            }
          });

          return <>{elements}</>;
        }
      }
    },
  });

  return (
    <div style={{ display: "flex", gap: 20 }}>
      {/* Sol seçimlər paneli */}
      <div style={{ flex: 1 }} className="border border-blue-400 rounded-md p-2 mb-5">
        <h4>Seçimlər</h4>
        {question.options?.map((opt) => {
          const disabled = usedOptionIds.includes(opt.id);
          return (
            <div
              key={opt.id}
              draggable={!disabled}
              onDragStart={(e) => onDragStart(e, opt.id)}
              style={{
                padding: 8,
                marginBottom: 8,
                backgroundColor: disabled ? "#ddd" : "#e6f7ff",
                borderRadius: 4,
                cursor: disabled ? "not-allowed" : "grab",
                opacity: disabled ? 0.5 : 1,
                userSelect: "none",
              }}
            >
              {opt.text}
            </div>
          );
        })}
      </div>

      {/* Sağ tərəfdə cümlə və blank-lar */}
      <div style={{ flex: 2, fontSize: 18, lineHeight: "32px" }}>
        {htmlParsed}
      </div>
    </div>
  );
}
