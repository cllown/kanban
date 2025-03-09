import axios from 'axios';

export const fetchIssues = async (repoUrl: string) => {
    try {
        const repoPath = repoUrl.replace('https://github.com/', '');
        const { data } = await axios.get(`https://api.github.com/repos/${repoPath}/issues`);
        return data;
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
        throw new Error('Не удалось загрузить задачи. Проверьте правильность URL репозитория.');
    }
};
