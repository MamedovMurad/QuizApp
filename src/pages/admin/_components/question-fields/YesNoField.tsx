import { Form, Input, Button, Checkbox, Space } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

export const YesNoField = () => {
  return (
    <Form.List
      name="lines"
      rules={[
        {
          validator: async (_, options) => {
            if (!options || options.length < 1) {
              return Promise.reject(new Error('Ən azı bir variant olmalıdır'));
            }
          },
        },
      ]}
    >
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name }, index) => (
            <Space
              key={key}
              align="baseline"
              style={{ display: 'flex', marginBottom: 8 }}
            >
              <Form.Item
                name={[name, 'text']}
                rules={[{ required: true, message: 'Variant daxil edin' }]}
              >
                <Input placeholder={`Variant ${index + 1}`} />
              </Form.Item>
              <Form.Item
                name={[name, 'correct']}
                valuePropName="checked"
                initialValue={false}
              >
                <Checkbox>Doğru</Checkbox>
              </Form.Item>
              <Button
                danger
                type="text"
                icon={<MinusCircleOutlined />}
                onClick={() => remove(name)}
              />
            </Space>
          ))}
          <Form.Item>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => add({ text: '', correct: false })}
            >
              Variant əlavə et
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  );
};
