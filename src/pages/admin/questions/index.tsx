import React, { useEffect, useState } from 'react';
import { Space, Table, Tag, Button, message, Popconfirm } from 'antd';
import type { TablePaginationConfig, TableProps } from 'antd';
import { Link } from 'react-router-dom';
import { deleteQuiz, getAllQuizes } from '../../../api/quiz';
import type { PaginatedResponse, QuestionResponse } from '../../../models/quiz';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';


const Questions: React.FC = () => {
    const [data, setData] = useState<QuestionResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        pageSizeOptions: ['10', '25', '50', '100'],
    });

    const fetchData = async (page = 1, pageSize = 25) => {
        setLoading(true);
        try {
            const res: PaginatedResponse<QuestionResponse> = await getAllQuizes(page, pageSize);
            setData(res.data);
            setPagination({
                ...pagination,
                current: res.current_page,
                pageSize: res.per_page,
                total: res.total,
            });
        } catch (err) {
            message.error('Suallar yüklənə bilmədi.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(pagination.current!, pagination.pageSize!);
    }, []);

    const handleTableChange: TableProps<QuestionResponse>['onChange'] = (pagination) => {
        fetchData(pagination.current!, pagination.pageSize!);
    };

    const columns: TableProps<QuestionResponse>['columns'] = [
        {
            title: 'Sual',
            dataIndex: 'text',
            key: 'text',
            render: (text: string) => <span>{text}</span>,
        },
        {
            title: 'Tip',
            dataIndex: 'type',
            key: 'type',
            render: (type: string) => {
                let color = '';
                switch (type) {
                    case 'single':
                        color = 'green';
                        break;
                    case 'multiple':
                        color = 'blue';
                        break;
                    case 'blanks':
                        color = 'orange';
                        break;
                    case 'dragdrop':
                        color = 'purple';
                        break;
                    case 'ordering':
                        color = 'cyan';
                        break;
                    case 'yesno':
                        color = 'volcano';
                        break;
                    default:
                        color = 'default';
                }
                return <Tag color={color}>{type.toUpperCase()}</Tag>;
            },
        },
        {
            title: 'Əməliyyat',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Link to={`/admin/quiz/edit/${record.id}`}>
                        <Button type="link">   <EditOutlined /></Button>
                    </Link>
                    <Popconfirm
                        title="Silmək istədiyinizə əminsiniz?"
                        onConfirm={() => {
                            deleteQuiz(record.id).then(() => {
                                fetchData()
                                message.info(`Silindi: ${record.text}`)
                            })

                            message.info(`Silinəcək: ${record.text}`)
                        }}
                        okText="Bəli"
                        cancelText="Xeyr"
                    >
                        <Button type="link" danger>
                            <DeleteOutlined />
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];


    return (
        <main className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Sual Siyahısı</h2>
                <Link to="/admin/quiz/create">
                    <Button type="primary">Yeni Sual Əlavə Et</Button>
                </Link>
            </div>
            <Table<QuestionResponse>
                rowKey={(record) => record.text + record.type}
                columns={columns}
                dataSource={data}
                pagination={pagination}
                loading={loading}
                onChange={handleTableChange}
            />
        </main>
    );
};

export default Questions;
