import { useEffect } from 'react';
import { Form, Input, Select, Button, Radio } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

interface Props {
  type: 'single' | 'multiple';
}

export const SingleMultipleField: React.FC<Props> = ({ type }) => {
  const form = Form.useFormInstance();

  // UseEffect yalnız boş olduqda ilkin bir variant əlavə edir,
  // amma mövcud mətnləri dəyişmir
  useEffect(() => {
    const current = form.getFieldValue('options') || [];
    if (current.length === 0) {
      form.setFieldsValue({
        options: [{ text: '', correct: false }],
      });
    }
  }, [form]);

  return (
    <Form.List
      name="options"
      rules={[
        {
          validator: async (_, options) => {
            if (!options || options.length < 1) {
              return Promise.reject(new Error('Ən azı bir variant əlavə edin'));
            }
            if (type === 'single' && !options.some((opt: any) => opt.correct)) {
              return Promise.reject(new Error('Bir doğru cavab seçilməlidir'));
            }
          },
        },
      ]}
    >
      {(fields, { add, remove }) => {
        // Altdakı shouldUpdate içində options'u almaq üçün istifadə olunur
        return (
          <>
            {fields.map(({ key, name }, index) => (
              <div
                key={key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: 12,
                  padding: 12,
                  border: '1px solid #ddd',
                  borderRadius: 8,
                  background: '#f9f9f9',
                  gap: 12,
                }}
              >
                <div style={{ flex: 1 }}>
                  <Form.Item
                    name={[name, 'text']}
                    rules={[{ required: true, message: 'Variant mətni daxil edin' }]}
                    style={{ marginBottom: 8 }}
                  >
                    <Input placeholder={`Variant ${index + 1}`} />
                  </Form.Item>

                  {type === 'multiple' ? (
                    <Form.Item
                      name={[name, 'correct']}
                      valuePropName="value"
                      initialValue={false}
                      style={{ marginBottom: 0 }}
                    >
                      <Select placeholder="Doğru cavab?">
                        <Option value={true}>Bəli</Option>
                        <Option value={false}>Xeyr</Option>
                      </Select>
                    </Form.Item>
                  ) : (
                    <Form.Item shouldUpdate noStyle>
                      {() => {
                        const options = form.getFieldValue('options') || [];
                        return (
                          <Radio
                            checked={options[index]?.correct === true}
                            onChange={() => {
                              const updated = options.map((opt: any, i: number) => ({
                                ...opt,
                                correct: i === index,
                              }));
                              form.setFieldsValue({ options: updated });
                            }}
                          >
                            Doğru cavab
                          </Radio>
                        );
                      }}
                    </Form.Item>
                  )}
                </div>

                {fields.length > 1 && (
                  <Button
                    type="text"
                    danger
                    icon={<MinusCircleOutlined />}
                    onClick={() => remove(name)}
                  />
                )}
              </div>
            ))}

            <div style={{ textAlign: 'right' }}>
              <Button icon={<PlusOutlined />} onClick={() => add()}>
                Variant əlavə et
              </Button>
            </div>
          </>
        );
      }}
    </Form.List>
  );
};
