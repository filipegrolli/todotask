import { describe, expect, test, beforeEach, jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useTaskStore } from '../../store';
import Admin from './index'; // Certifique-se de que o arquivo Admin.tsx existe no mesmo diretório

// Mock Firebase
jest.mock('../../__mocks__/firebase.ts', () => ({
  db: jest.fn(),
  auth: {
    currentUser: { uid: 'test-uid', email: 'ttt@ttt.com' },
    signOut: jest.fn(),
  },
  //storage: jest.fn(),
}));

// Mock Zustand store
jest.mock('../../store', () => ({
  useTaskStore: jest.fn(),
}));

const mockSetTasks = jest.fn();
const mockAddTask = jest.fn();
const mockUpdateTask = jest.fn();
const mockDeleteTask = jest.fn();

(useTaskStore as unknown as jest.Mock).mockReturnValue({
  tasks: [],
  setTasks: mockSetTasks,
  addTask: mockAddTask,
  updateTask: mockUpdateTask,
  deleteTask: mockDeleteTask,
});

describe('Admin Component', () => {
  beforeEach(() => {
    render(
      <Router>
        <Admin />
      </Router>
    );
  });

  test('creates a new task', () => {
    fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'Test Task' } });
    fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByLabelText('Data Vencimento'), { target: { value: '2023-12-31' } });
    fireEvent.change(screen.getByLabelText('Prioridade'), { target: { value: 'High' } });
    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'To Do' } });

    fireEvent.click(screen.getByText('Criar Tarefa'));

    expect(mockAddTask).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Test Task',
      description: 'Test Description',
      dueDate: '2023-12-31',
      priority: 'High',
      status: 'To Do',
    }));
  });
});