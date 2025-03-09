import React, { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store/store';
import { moveIssue } from '../../../store/issuesSlice';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, Col, Row, Typography, Divider, Layout, Space } from 'antd';
import { BorderOutlined } from '@ant-design/icons';
import './KanbanBoard.scss';

const { Title } = Typography;
const { Content } = Layout;

const KanbanBoard: React.FC = () => {
    const { todo, inProgress, done } = useSelector((state: RootState) => state.issues);
    const dispatch = useDispatch();

    const onDragEnd = useCallback((result: DropResult) => {
        if (!result.destination) return;
        const { source, destination, draggableId } = result;

        if (source.droppableId === destination.droppableId) return;

        dispatch(
            moveIssue({
                id: Number(draggableId),
                from: source.droppableId as keyof Omit<RootState['issues'], 'repoKey'>,
                to: destination.droppableId as keyof Omit<RootState['issues'], 'repoKey'>,
            })
        );
    }, [dispatch]);

    const columns = useMemo(
        () => [
            { title: 'To Do', issues: todo, id: 'todo', color: '#ff4d4f' },
            { title: 'In Progress', issues: inProgress, id: 'inProgress', color: '#faad14' },
            { title: 'Done', issues: done, id: 'done', color: '#52c41a' },
        ],
        [todo, inProgress, done]
    );

    return (
        <Layout style={{ padding: '20px', background: '#f0f2f5', borderRadius: '8px' }}>
            <Content>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Row gutter={16} justify="center">
                        {columns.map(({ title, issues, id, color }) => (
                            <Col key={id} span={8}>
                                <Title level={3} style={{ textAlign: 'center', color }}>
                                    {title}
                                </Title>
                                <Divider style={{ borderColor: color }} />

                                <Droppable droppableId={id}>
                                    {(provided) => (
                                        <div ref={provided.innerRef} {...provided.droppableProps} className="kanban-column">
                                            <Space direction="vertical" style={{ width: '100%' }}>
                                                {issues.map((issue, index) => (
                                                    <Draggable
                                                        key={issue.id}
                                                        draggableId={String(issue.id)}
                                                        index={index}
                                                    >
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                style={{
                                                                    ...provided.draggableProps.style,
                                                                    background: snapshot.isDragging ? '#e6f7ff' : '#fff',
                                                                    boxShadow: snapshot.isDragging
                                                                        ? '0px 4px 8px rgba(0, 0, 0, 0.15)'
                                                                        : 'none',
                                                                    transition: 'box-shadow 0.2s',
                                                                    borderRadius: '8px',
                                                                }}
                                                            >
                                                                <Card
                                                                    title={<span><BorderOutlined /> {issue.title}</span>}

                                                                />
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </Space>
                                        </div>
                                    )}
                                </Droppable>
                            </Col>
                        ))}
                    </Row>
                </DragDropContext>
            </Content>
        </Layout>
    );
};

export default KanbanBoard;
