import { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

import {
  getPricings,
  createPricing,
  updatePricing,
  deletePricing,
} from '../../../api/pricing';

interface PricingItem {
  id: number;
  title: string;
  description: string;
  price: number;
  discount?: number | null;
  count: number;
  created_at: string;
  updated_at: string | null;
}

const PricingList = () => {
  const [data, setData] = useState<PricingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<PricingItem | null>(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getPricings();
      setData(res.data);
    } catch {
      message.error('Qiymətlər yüklənə bilmədi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = () => {
    setEditingItem(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (item: PricingItem) => {
    setEditingItem(item);
    form.setFieldsValue(item);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePricing(id);
      message.success('Silindi');
      fetchData();
    } catch {
      message.error('Silinmə zamanı xəta baş verdi');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingItem?.id) {
        await updatePricing(values, editingItem.id);
        message.success('Yeniləndi');
      } else {
        await createPricing(values);
        message.success('Yaradıldı');
      }
      setModalVisible(false);
      fetchData();
    } catch {
      message.error('Əməliyyat zamanı xəta baş verdi');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: 'Başlıq', dataIndex: 'title' },
    { title: 'Açıqlama', dataIndex: 'description' },
    {
      title: 'Qiymət ($)',
      dataIndex: 'price',
      render: (val: number) => `$${val}`,
    },
    {
      title: 'Endirim (%)',
      dataIndex: 'discount',
      render: (val: number | null) => (val ? `${val}%` : '—'),
    },
    {
      title: 'Say limit',
      dataIndex: 'count',
      render: (val: number) => `${val} dəfə`,
    },
    {
      title: 'Yaradılma',
      dataIndex: 'created_at',
      render: (val: string) => new Date(val).toLocaleString(),
    },
    {
      title: 'Yenilənmə',
      dataIndex: 'updated_at',
      render: (val: string | null) =>
        val ? new Date(val).toLocaleString() : '—',
    },
    {
      title: 'Əməliyyatlar',
      dataIndex: 'actions',
      render: (_: any, record: PricingItem) => (
        <div className="flex gap-2">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Redaktə
          </Button>
          <Popconfirm
            title="Silmək istədiyinizə əminsiniz?"
            onConfirm={() => handleDelete(record.id)}
            okText="Bəli"
            cancelText="Xeyr"
          >
            <Button danger icon={<DeleteOutlined />}>
              Sil
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Pricing List</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Yeni əlavə et
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        bordered
      />

      <Modal
        title={editingItem ? 'Məlumatı yenilə' : 'Yeni qiymət əlavə et'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        onOk={handleSubmit}
        okText="Yadda saxla"
        cancelText="Ləğv et"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Başlıq"
            rules={[{ required: true, message: 'Başlıq boş ola bilməz' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Açıqlama"
            rules={[{ required: true, message: 'Açıqlama boş ola bilməz' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="price"
            label="Qiymət"
            rules={[{ required: true, message: 'Qiymət boş ola bilməz' }]}
          >
            <InputNumber className="w-full" min={0} />
          </Form.Item>
          <Form.Item name="discount" label="Endirim (%)">
            <InputNumber className="w-full" min={0} max={100} placeholder="Məsələn 10" />
          </Form.Item>
          <Form.Item
            name="count"
            label="Say limit"
            rules={[{ required: true, message: 'Limit boş ola bilməz' }]}
          >
            <InputNumber className="w-full" min={1} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PricingList;
