import { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  Upload,
  InputNumber,
  message,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { SingleMultipleField } from './question-fields/SingleMultipleField';
import { DragDropField } from './question-fields/DragDropField';
import { useWatch } from 'antd/es/form/Form';
import { YesNoField } from './question-fields/YesNoField';
import { OrderingField } from './question-fields/OrderingField';
import { createQuiz, getGroups } from '../../../api/quiz';

const { Option } = Select;
const questionTypes = ['single', 'multiple', 'blanks', 'ordering', "yesno","dragdrop"];

function appendFormData(formData: FormData, data: any, rootKey = '') {
  if (data instanceof File) {
    formData.append(rootKey, data);
  } else if (Array.isArray(data)) {
    data.forEach((item, index) => {
      const key = rootKey ? `${rootKey}[${index}]` : `${index}`;
      appendFormData(formData, item, key);
    });
  } else if (data !== null && typeof data === 'object') {
    Object.entries(data).forEach(([key, value]) => {
      const formKey = rootKey ? `${rootKey}[${key}]` : key;
      appendFormData(formData, value, formKey);
    });
  } else if (typeof data === 'boolean') {
    // boolean dəyərləri 1 / 0 kimi əlavə et
    formData.append(rootKey, data ? '1' : '0');
  } else if (data !== undefined && data !== null) {
    formData.append(rootKey, String(data));
  }
}


export const QuestionForm = ({id}:{id:any}) => {
  const [form] = Form.useForm();
  const [questionType, setQuestionType] = useState('');
  const [groups, setgroups] = useState<any>(null);

  const questionText = useWatch('text', form); // 👈 burada sualı izləyirik

const onFinish = (values: any) => {
  const formData = new FormData();

  // Faylı ayrıca əlavə et
  if (values.image?.fileList?.length) {
    formData.append('image', values.image.fileList[0].originFileObj);
  }

  // category_id ayrıca əlavə olunur (çünki form sahəsində yoxdur)
  formData.append('category_id', id);

  // Qalan bütün sahələri dinamik şəkildə əlavə edirik
  const { image, ...rest } = values;
  appendFormData(formData, rest);

  createQuiz(formData)
    .then(() => {
      message.success('Sual yaradıldı');
      form.resetFields();
    })
    .catch(() => {
      message.error('Xəta baş verdi');
    });
};



  useEffect(() => {
    getGroups().then((data)=>{
      setgroups(data.data)
    })
  }, []);
  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <div className="flex items-center gap-x-5">
        <Form.Item
          className=' w-full'
          name="text"
          label="Sual"
          rules={[{ required: true, message: 'Sual daxil edin' }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          className=' w-full'
          name="title"
          label="Basliq"

        >
          <Input.TextArea rows={3} />
        </Form.Item>
      </div>

      <div className="grid grid-cols-4 gap-2.5 min-w-0">
        {/* növ, bal və şəkil hissələri */}
        <Form.Item name="type" label="Növ" rules={[{ required: true }]}>
          <Select onChange={setQuestionType}>
            {questionTypes.map((type) => (
              <Option key={type} value={type}>
                {type}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="group_id" label="Kateqoriya" rules={[{ required: true }]}>
          <Select >
            {groups?.map((type:any) => (
              <Option key={type.id} value={type.id}>
                {type.title}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="point" label="Bal" rules={[{ required: true }]}>
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="image" label="Şəkil">
          <Upload beforeUpload={() => false} maxCount={1}>
            <Button icon={<UploadOutlined />}>Şəkil seç</Button>
          </Upload>
        </Form.Item>
      </div>

      {/* Conditional Fields */}
      {['single', 'multiple'].includes(questionType) && (
        <SingleMultipleField type={questionType as 'single' | 'multiple'} />
      )}

      {['blanks', 'dragdrop'].includes(questionType) && (
        <DragDropField text={questionText || ''} />
      )}
      {questionType === 'yesno' && (
        <YesNoField />
      )}
      {questionType === 'ordering' && (
        <OrderingField />
      )}

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Tamamla
        </Button>
      </Form.Item>
    </Form>
  );
};
