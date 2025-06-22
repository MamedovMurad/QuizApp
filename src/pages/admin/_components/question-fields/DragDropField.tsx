import { useEffect } from 'react';
import {
  Form,
  Input,
  Space,
  Select,
  Button,
  Typography,
} from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface BlanksFieldProps {
  text: string;

}

export const DragDropField = ({ text }: BlanksFieldProps) => {
  const form = Form.useFormInstance();

  useEffect(() => {
    if (!text) return;

    const blankCount = (text.match(/___/g) || []).length;

    const existingBlanks = form.getFieldValue('blanks') || [];

    // Əgər backend-dən gələn datada options artıq varsa — bir daha set etməyə ehtiyac yoxdur
    const hasExistingOptions = existingBlanks.every(
      (blank: any) => Array.isArray(blank?.options) && blank.options.length > 0
    );

    // Əgər uyğun sayda blank və options varsa — heç nə etmirik
    if (
      existingBlanks.length === blankCount &&
      hasExistingOptions
    ) {
      return;
    }

    // Əks halda yeni blank sahələri yaradılır
    const blanks = Array.from({ length: blankCount }).map(() => ({
      options: [],
      correct_answer: null,
    }));

    form.setFieldsValue({ blanks });
  }, [text, form]);

  return (
    <>
      <Title level={5}>Boşluqlar üçün variantlar</Title>
      <Form.List name="blanks">
        {(fields) => (
          <>
            {fields.map(({ key, name }, index) => (
              <div
                key={key}
                style={{
                  border: '1px solid #ddd',
                  padding: '12px',
                  marginBottom: '16px',
                  borderRadius: 8,
                }}
              >
                <strong>Blank {index + 1}</strong>

                {/* VARIANTLAR */}
                <Form.List name={[name, 'options']}>
                  {(optionFields, { add, remove }) => (
                    <>
                      {optionFields.map(({ key: optKey, name: optName }) => (
                        <Space
                          key={optKey}
                          align="baseline"
                          style={{ display: 'flex', marginTop: 8 }}
                        >
                          <Form.Item
                            name={[optName]}
                            rules={[
                              {
                                required: true,
                                message: 'Variant daxil edin',
                              },
                            ]}
                          >
                            <Input placeholder={`Blank ${index + 1} - variant`} />
                          </Form.Item>
                          <Button
                            danger
                            type="text"
                            icon={<MinusCircleOutlined />}
                            onClick={() => remove(optName)}
                          />
                        </Space>
                      ))}
                      <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={() => add()}
                      >
                        Variant əlavə et
                      </Button>
                    </>
                  )}
                </Form.List>

                {/* DOĞRU CAVAB SEÇİMİ */}
                <Form.Item
                  noStyle
                  shouldUpdate={(prev, next) =>
                    prev.blanks !== next.blanks
                  }
                >
                  {() => {
                    const blanks = form.getFieldValue('blanks') || [];
                    const options = (blanks[index]?.options || []).map(
                      (opt: any, idx: number) => ({
                        label: opt || `Variant ${idx + 1}`,
                        value: opt,
                      })
                    );

                    return (
                      <Form.Item
                        label="Doğru cavab"
                        name={[name, 'correct_answer']}
                        rules={[{ required: true, message: 'Seçim edin' }]}
                      >
                        <Select
                          placeholder="Variant seç"
                          options={options}
                          allowClear
                        />
                      </Form.Item>
                    );
                  }}
                </Form.Item>
              </div>
            ))}
          </>
        )}
      </Form.List>
    </>
  );
};
