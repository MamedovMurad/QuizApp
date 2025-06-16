import { useEffect, useState } from 'react';
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    message,
    Popconfirm,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import {
    creategroup,
    deletegroup,
    getGroups,
    updategroup,
} from '../../../api/quiz'; // Sənin Axios servis yolun

// Tip
interface Item {
    id: number;
    title: string;
    created_at: string;
    updated_at: string;
}

const GroupList = () => {
    const [data, setData] = useState<Item[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<Item | null>(null);
    const [form] = Form.useForm();

    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await getGroups();
            setData(result.data);
        } catch (err) {
            message.error('Qruplar yüklənə bilmədi');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEdit = (item: Item) => {
        setEditingItem(item);
        form.setFieldsValue(item);
        setModalVisible(true);
    };

    const handleDelete = async (id: number) => {
        try {
            await deletegroup(id);
            message.success(`Silindi: ID ${id}`);
            fetchData();
        } catch (err) {
            message.error('Silinmə zamanı xəta baş verdi');
        }
    };

    const handleCreate = () => {
        setEditingItem(null);
        form.resetFields();
        setModalVisible(true);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            if (editingItem?.id) {
                await updategroup(values, editingItem.id);
                message.success(`Yeniləndi: ${values.title}`);
            } else {
                await creategroup(values);
                message.success(`Yaradıldı: ${values.title}`);
            }
            setModalVisible(false);
            fetchData();
        } catch (err) {
            message.error('Əməliyyat zamanı xəta baş verdi');
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 80,
        },
        {
            title: 'Başlıq',
            dataIndex: 'title',
        },
        {
            title: 'Yaradılma',
            dataIndex: 'created_at',
            render: (val: string) => new Date(val).toLocaleString(),
        },
        {
            title: 'Yenilənmə',
            dataIndex: 'updated_at',
            render: (val: string) => new Date(val).toLocaleString(),
        },
        {
            title: 'Əməliyyatlar',
            dataIndex: 'actions',
            render: (_: any, record: Item) => (
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
                        okText="Bəli"
                        cancelText="Xeyr"
                        onConfirm={() => handleDelete(record.id)}
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
                <h2 className="text-xl font-semibold">Sual Novu Siyahısı</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleCreate}
                >
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
                title={editingItem ? 'Məlumatı yenilə' : 'Yeni məlumat əlavə et'}
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
                        <Input placeholder="Başlıq daxil edin" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default GroupList;
