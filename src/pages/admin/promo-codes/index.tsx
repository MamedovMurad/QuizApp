import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  message,

  Tag,
} from "antd";
import {
  PlusOutlined,

} from "@ant-design/icons";
import { createPromo, getPromos } from "../../../api/pricing";

interface PromoItem {
  id: number;
  title: string;
  discount: number;
  promo_code: number;
  status: string;
  created_at: string;
  updated_at: string;
}

const PromoList = () => {
  const [data, setData] = useState<PromoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<PromoItem | null>(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getPromos();
      setData(res.data);
    } catch {
      message.error("Promo kodlar yüklənə bilmədi");
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

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingItem?.id) {
        // await updatePromo(values, editingItem.id);
        message.success("Yeniləndi");
      } else {
        await createPromo(values);
        message.success("Yaradıldı");
      }
      setModalVisible(false);
      fetchData();
    } catch {
      message.error("Əməliyyat zamanı xəta baş verdi");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", width: 60 },
    { title: "Başlıq", dataIndex: "title" },
    {
      title: "Endirim (%)",
      dataIndex: "discount",
      render: (val: number) => `${val}%`,
    },
    { title: "Promo Kod", dataIndex: "promo_code" },
    {
      title: "Status",
      dataIndex: "status",
      render: (val: string) =>
        val === "1" ? (
          <Tag color="green">Aktiv</Tag>
        ) : (
          <Tag color="red">Deaktiv</Tag>
        ),
    },
    {
      title: "Yaradılma",
      dataIndex: "created_at",
      render: (val: string) => new Date(val).toLocaleString(),
    },
    {
      title: "Yenilənmə",
      dataIndex: "updated_at",
      render: (val: string | null) =>
        val ? new Date(val).toLocaleString() : "—",
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Promo Kodlar</h2>
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
        title={editingItem ? "Promo kodu yenilə" : "Yeni promo kod əlavə et"}
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
          <Form.Item
            name="discount"
            label="Endirim (%)"
            rules={[{ required: true, message: "Endirim boş ola bilməz" }]}
          >
            <InputNumber className="w-full" min={0} max={100} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PromoList;
