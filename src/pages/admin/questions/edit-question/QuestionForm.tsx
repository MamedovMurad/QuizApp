import { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  Upload,
  InputNumber,
  Spin,
  message,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useWatch } from 'antd/es/form/Form';
import { getGroups, getQuizById, updateQuiz } from '../../../../api/quiz';
import { SingleMultipleField } from '../../_components/question-fields/SingleMultipleField';
import { DragDropField } from '../../_components/question-fields/DragDropField';
import { YesNoField } from '../../_components/question-fields/YesNoField';
import { OrderingField } from '../../_components/question-fields/OrderingField';
import { useParams } from 'react-router-dom';

const { Option } = Select;
const questionTypes = ['single', 'multiple', 'blanks', 'ordering', 'yesno', 'dragdrop'];

// FormData helper
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
    formData.append(rootKey, data ? '1' : '0');
  } else if (data !== undefined && data !== null) {
    formData.append(rootKey, String(data));
  }
}

export const EditQuestionEditForm = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [questionType, setQuestionType] = useState('');
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialImage, setInitialImage] = useState<string | null>(null);

  // Fayl upload üçün fileList state
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploadKey, setUploadKey] = useState(Date.now()); // Upload component key-si

  const questionText = useWatch('text', form);

  useEffect(() => {
    getGroups().then((res) => {
      setGroups(res.data);
    });

    if (id) {
      getQuizById(id).then((res) => {
        const data = res.data;
        form.setFieldsValue({
          text: data.text,
          title: data.title,
          type: data.type,
          point: data.point,
          category_id: data.category_id,
          group_id: data.group_id,
          options: data.options || [],
          blanks: data.blanks || [],
          lines: data.lines || [],
          image: undefined, // Fayl upload-un fileList-ini ayrıca idarə edirik
        });

        setInitialImage(data.image || null);
        setQuestionType(data.type);
        setLoading(false);
      });
    }
  }, [id, form]);

  // Fayl upload dəyişəndə çağırılır
  const onUploadChange = ({ fileList }: any) => {
    setFileList(fileList);
    if (fileList.length > 0) {
      setInitialImage(null); // Yeni fayl yüklənəndə köhnə şəkil silinir
    }
    setUploadKey(Date.now()); // upload key-ni dəyiş ki komponent yenidən render olunsun
  };

  const onFinish = (values: any) => {
    const formData = new FormData();

    if (fileList.length > 0) {
      // Əgər yeni fayl yüklənibsə onu əlavə et
      formData.append('image', fileList[0].originFileObj);
    } else if (initialImage) {
      // Əks halda köhnə şəkli serverə bildir
      formData.append('existing_image', initialImage);
    }

    formData.append('id', id as string);

    const { image, ...rest } = values;
    appendFormData(formData, rest);

    updateQuiz(formData, id as string)
      .then(() => {
        message.success('Sual yeniləndi');
      })
      .catch(() => {
        message.error('Xəta baş verdi');
      });
  };

  if (loading) return <Spin />;

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item name="category_id" hidden>
        <Input />
      </Form.Item>

      <div className="flex items-center gap-x-5">
        <Form.Item className="w-full" name="text" label="Sual" rules={[{ required: true }]}>
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item className="w-full" name="title" label="Başlıq">
          <Input.TextArea rows={3} />
        </Form.Item>
      </div>

      <div className="grid grid-cols-4 gap-2.5">
        <Form.Item name="type" label="Növ" rules={[{ required: true }]}>
          <Select onChange={setQuestionType} disabled>
            {questionTypes.map((type) => (
              <Option key={type} value={type}>
                {type}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="group_id" label="Kateqoriya" rules={[{ required: true }]}>
          <Select>
            {groups.map((group) => (
              <Option key={group.id} value={group.id}>
                {group.title}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="point" label="Bal" rules={[{ required: true }]}>
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="image" label="Şəkil">
          <>
            {initialImage && !fileList.length && (
              <img className="h-24 w-24 mb-2 object-contain" src={initialImage} alt="Şəkil" />
            )}
            <Upload
              key={uploadKey}
              beforeUpload={() => false}
              maxCount={1}
              onChange={onUploadChange}
              fileList={fileList}
              listType="picture"
            >
              <Button icon={<UploadOutlined />}>Şəkil seç</Button>
            </Upload>
          </>
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
