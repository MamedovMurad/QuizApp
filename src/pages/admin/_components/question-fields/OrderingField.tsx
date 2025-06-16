import { Form, Input, Button, InputNumber, Space } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

export const OrderingField = () => {
  return (
    <Form.List
      name="options"
      rules={[
        {
          validator: async (_, options) => {
            if (!options || options.length < 2) {
              return Promise.reject(new Error('Ən azı 2 variant daxil edilməlidir'));
            }

            const orders = options
              .map((opt: any) => opt.order)
              .filter((order: number | null | undefined) => order !== null && order !== undefined);

            const hasDuplicates = new Set(orders).size !== orders.length;
            if (hasDuplicates) {
              return Promise.reject(new Error('Təkrar sıra nömrələri olmamalıdır'));
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

              <Form.Item name={[name, 'order']}>
                <InputNumber
                  min={1}
                  placeholder="Sıra (ixtiyari)"
                  style={{ width: 120 }}
                />
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
              onClick={() => add({ text: '', order: null })}
            >
              Variant əlavə et
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  );
};
