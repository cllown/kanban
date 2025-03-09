import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WritableDraft } from 'immer';

interface User {
    login: string;
}

interface Issue {
    id: number;
    number: number;
    title: string;
    state: 'open' | 'closed';
    assignee: User | null;
    created_at: string;
}

interface IssuesState {
    repoKey: string;
    todo: Issue[];
    inProgress: Issue[];
    done: Issue[];
}

const loadFromLocalStorage = (repoKey: string): IssuesState | null => {
    try {
        const savedState = localStorage.getItem(`kanbanState_${repoKey}`);
        return savedState ? JSON.parse(savedState) : null;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return null;
    }
};

const initialState: IssuesState = { repoKey: '', todo: [], inProgress: [], done: [] };

export const issuesSlice = createSlice({
    name: 'issues',
    initialState,
    reducers: {
        setRepoKey: (state, action: PayloadAction<string>) => {
            const newRepoKey = action.payload;
            const loadedState = loadFromLocalStorage(newRepoKey);
            if (loadedState) {
                state.repoKey = loadedState.repoKey;
                state.todo = loadedState.todo;
                state.inProgress = loadedState.inProgress;
                state.done = loadedState.done;
            } else {
                state.repoKey = newRepoKey;
                state.todo = [];
                state.inProgress = [];
                state.done = [];
            }
        },


        setIssues: (state, action: PayloadAction<{ repoKey: string; issues: Issue[] }>) => {
            const { repoKey, issues } = action.payload;

            const savedState = loadFromLocalStorage(repoKey);
            if (savedState) {
                return savedState;
            }

            state.repoKey = repoKey;
            state.todo = issues.filter(issue => !issue.assignee && issue.state === 'open');
            state.inProgress = issues.filter(issue => issue.assignee !== null);
            state.done = issues.filter(issue => issue.state === 'closed');

            localStorage.setItem(`kanbanState_${repoKey}`, JSON.stringify(state));
        },

        moveIssue: (
            state,
            action: PayloadAction<{ id: number; from: keyof Omit<IssuesState, 'repoKey'>; to: keyof Omit<IssuesState, 'repoKey'> }>
        ) => {
            const { id, from, to } = action.payload;

            if (!state[from] || !state[to]) return;

            const fromColumn = state[from] as WritableDraft<Issue>[];
            const toColumn = state[to] as WritableDraft<Issue>[];

            const issueIndex = fromColumn.findIndex(issue => issue.id === id);
            if (issueIndex === -1) return;

            const [issue] = fromColumn.splice(issueIndex, 1);
            toColumn.push(issue);

            localStorage.setItem(`kanbanState_${state.repoKey}`, JSON.stringify(state));
        },
    },
});

export const { setRepoKey, setIssues, moveIssue } = issuesSlice.actions;
export default issuesSlice.reducer;
