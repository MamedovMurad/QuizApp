import React, { useEffect, useState } from 'react';
import { Space, Table, Tag, Button, message, Popconfirm, Input, Select } from 'antd';
import type { TablePaginationConfig, TableProps } from 'antd';
import { Link, useSearchParams } from 'react-router-dom';
import { deleteQuiz, getAllQuizes } from '../../../api/quiz';
import type { PaginatedResponse, QuestionResponse } from '../../../models/quiz';
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

const Questions: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [data, setData] = useState<QuestionResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: Number(searchParams.get("page")) || 1,
        pageSize: Number(searchParams.get("pageSize")) || 10,
        total: 0,
        showSizeChanger: true,
        pageSizeOptions: ['10', '25', '50', '100'],
    });

    // Filtr state URL-dən oxunur
    const [filters, setFilters] = useState({
        title: searchParams.get("q") || '',
        type: searchParams.get("type") || ''
    });

    const fetchData = async (page = 1, pageSize = 25, searchFilters = filters) => {
        setLoading(true);
        try {
            const res: PaginatedResponse<QuestionResponse> = await getAllQuizes(
                page,
                pageSize,
                searchFilters?.type,
                searchFilters.title
            );
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
        fetchData(pagination.current!, pagination.pageSize!, filters);
    }, []);

    const handleTableChange: TableProps<QuestionResponse>['onChange'] = (newPagination) => {
        setSearchParams({
            page: String(newPagination.current || 1),
            pageSize: String(newPagination.pageSize || 10),
            q: filters.title,
            type: filters.type
        });
        fetchData(newPagination.current!, newPagination.pageSize!, filters);
    };

    const handleSearch = () => {
        setSearchParams({
            page: "1",
            pageSize: String(pagination.pageSize || 10),
            q: filters.title,
            type: filters.type
        });
        fetchData(1, pagination.pageSize!, filters);
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
                const colors: Record<string, string> = {
                    single: 'green',
                    multiple: 'blue',
                    blanks: 'orange',
                    dragdrop: 'purple',
                    ordering: 'cyan',
                    yesno: 'volcano'
                };
                return <Tag color={colors[type] || 'default'}>{type.toUpperCase()}</Tag>;
            },
        },
        {
            title: 'Əməliyyat',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Link to={`/admin/quiz/edit/${record.id}`}>
                        <Button type="link"><EditOutlined /></Button>
                    </Link>
                    <Popconfirm
                        title="Silmək istədiyinizə əminsiniz?"
                        onConfirm={() => {
                            deleteQuiz(record.id).then(() => {
                                fetchData(pagination.current!, pagination.pageSize!, filters);
                                message.info(`Silindi: ${record.text}`);
                            });
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

            {/* Axtarış formu */}
            <div className="flex justify-end my-4">
                <Space>
                    <Input
                        placeholder="Başlığa görə axtar"
                        value={filters.title}
                        onChange={(e) => setFilters({ ...filters, title: e.target.value })}
                    />
                    <Select
                        placeholder="Tip seçin"
                        allowClear
                        style={{ width: 200 }}
                        value={filters.type}
                        onChange={(value) => setFilters({ ...filters, type: value })}
                    >
                        <Option value="single">Single</Option>
                        <Option value="multiple">Multiple</Option>
                        <Option value="blanks">Blanks</Option>
                        <Option value="dragdrop">Dragdrop</Option>
                        <Option value="ordering">Ordering</Option>
                        <Option value="yesno">Yes/No</Option>
                    </Select>
                    <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                        Axtar
                    </Button>
                </Space>
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
