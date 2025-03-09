import React, { useState } from 'react';
import { Input, Button, Typography, Space } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store.ts';
import { setRepoKey, setIssues } from '../store/issuesSlice.ts';
import { fetchIssues } from '../store/fetchIssues.ts';
import KanbanBoard from './components/KanbanBoard/KanbanBoard.tsx';

const { Link, Text } = Typography;

const App: React.FC = () => {
    const [repoUrl, setRepoUrl] = useState('');
    const dispatch = useDispatch();
    const { repoKey } = useSelector((state: RootState) => state.issues);

    const [owner, repo] = repoKey.split('/');

    const handleLoad = async () => {
        if (!repoUrl.includes('github.com/')) {
            alert('Enter a valid GitHub repository URL.');
            return;
        }

        const repoPath = repoUrl.replace('https://github.com/', '');
        dispatch(setRepoKey(repoPath));

        try {
            const issues = await fetchIssues(repoUrl);
            dispatch(setIssues({ repoKey: repoPath, issues }));
        } catch (error) {
            console.error('Failed to load issues:', error);
            alert('Failed to load issues. Check the repository URL.');
        }
    };

    return (
        <div style={{ padding: 20, textAlign: 'center' }}>
            <h1>GitHub Kanban Board</h1>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                <Input
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="Enter GitHub repo URL (e.g., https://github.com/facebook/react)"
                    style={{ width: 400 }}
                />
                <Button type="primary" onClick={handleLoad} style={{ marginLeft: 10 }}>
                    Load Issues
                </Button>
            </div>

            {owner && repo ? (
                <Space size="middle" style={{ marginBottom: 20 }}>
                    <Link href={`https://github.com/${owner}`} target="_blank">
                        Owner: {owner}
                    </Link>
                    <Link href={`https://github.com/${owner}/${repo}`} target="_blank">
                        Repository: {repo}
                    </Link>
                </Space>
            ) : (
                <Text type="secondary">Enter a repository URL</Text>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                <KanbanBoard />
            </div>
        </div>
    );
};

export default App;
