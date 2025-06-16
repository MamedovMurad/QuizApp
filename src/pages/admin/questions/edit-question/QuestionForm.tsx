import { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  Upload,
  InputNumber,
  Spin,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import { useWatch } from 'antd/es/form/Form';
import { getGroups, getQuizById } from '../../../../api/quiz';
import { SingleMultipleField } from '../../_components/question-fields/SingleMultipleField';
import { DragDropField } from '../../_components/question-fields/DragDropField';
import { YesNoField } from '../../_components/question-fields/YesNoField';
import { OrderingField } from '../../_components/question-fields/OrderingField';
import { useParams } from 'react-router-dom';



const { Option } = Select;
const questionTypes = ['single', 'multiple', 'blanks', 'ordering', "yesno"];

export const EditQuestionEditForm = () => {
  const {id} =useParams();
  const [form] = Form.useForm();
  const [questionType, setQuestionType] = useState('');
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const questionText = useWatch('text', form);

  useEffect(() => {
    // Qrupları al
    getGroups().then((res) => {
      setGroups(res.data);
    });

    // Sualı al
    id&&getQuizById(id).then((res) => {
      const data = res.data;

      // Form sahələrini doldur
      form.setFieldsValue({
        text: data.text,
        title: data.title,
        type: data.type,
        point: data.point,
        category_id:data.category_id,
        group_id: data.group_id,
        image: data.image,
        options: data.options || [],
        blanks: data.blanks || [],
        lines: data.lines || [],
      });

      setQuestionType(data.type);
    }).finally(() => setLoading(false));
  }, [id, form]);

  const onFinish = (values: any) => {
    values.id = id;
    // updateQuiz(id, values).then(() => {
    //   message.success("Sual yeniləndi");
    // });
  };

  if (loading) return <Spin />;

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <div className="flex items-center gap-x-5">
        <Form.Item className='w-full' name="text" label="Sual" rules={[{ required: true }]}>
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item className='w-full' name="title" label="Başlıq">
          <Input.TextArea rows={3} />
        </Form.Item>
      </div>

      <div className="grid grid-cols-4 gap-2.5">
        <Form.Item name="type" label="Növ" rules={[{ required: true }]}>
          <Select onChange={setQuestionType} disabled>
            {questionTypes.map((type) => (
              <Option key={type} value={type}>{type}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="group_id" label="Kateqoriya" rules={[{ required: true }]}>
          <Select>
            {groups.map((group) => (
              <Option key={group.id} value={group.id}>{group.title}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="point" label="Bal" rules={[{ required: true }]}>
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="image" label="Şəkil">
          {
            form.getFieldValue("image")&& <img className=' h-24 w-24' src={form.getFieldValue("image")} alt="" />
          }
          <Upload beforeUpload={() => false} maxCount={1}>
            <Button icon={<UploadOutlined />}>Şəkil seç</Button>
          </Upload>
        </Form.Item>
      </div>

      {/* Dinamik sahələr */}
      {['single', 'multiple'].includes(questionType) && (
        <SingleMultipleField type={questionType as 'single' | 'multiple'} />
      )}

      {['blanks', 'dragdrop'].includes(questionType) && (
        <DragDropField text={questionText || ''} />
      )}

      {questionType === 'yesno' && <YesNoField />}
      {questionType === 'ordering' && <OrderingField />}

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Yenilə
        </Button>
      </Form.Item>
    </Form>
  );
};
