import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
} from "antd";
import {
  EditOutlined,
} from "@ant-design/icons";

import { getCategories, editCategories } from "../../../api/quiz";

interface Category {
  id: number;
  title: string;
  image?: string | null;
  optional?: number;
  created_at?: string | null;
  updated_at?: string | null;
}

const CategoriesList = () => {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Category | null>(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      setData(res.data);
    } catch {
      message.error("Kateqoriyalar yüklənə bilmədi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (item: Category) => {
    setEditingItem(item);
    form.setFieldsValue({ title: item.title });
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingItem?.id) {
        await editCategories(editingItem.id, values.title);
        message.success("Kateqoriya yeniləndi");
        fetchData();
      }
      setModalVisible(false);
    } catch {
      message.error("Xəta baş verdi");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", width: 60 },
    { title: "Başlıq", dataIndex: "title" },
    {
      title: "Yaradılma",
      dataIndex: "created_at",
      render: (val: string | null) => (val ? new Date(val).toLocaleString() : "—"),
    },
    {
      title: "Yenilənmə",
      dataIndex: "updated_at",
      render: (val: string | null) => (val ? new Date(val).toLocaleString() : "—"),
    },
    {
      title: "Əməliyyatlar",
      dataIndex: "actions",
      render: (_: any, record: Category) => (
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
        >
          Redaktə
        </Button>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Kateqoriyalar</h2>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        bordered
      />

      <Modal
        title="Kateqoriyanı redaktə et"
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
            rules={[{ required: true, message: "Başlıq boş ola bilməz" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoriesList;
