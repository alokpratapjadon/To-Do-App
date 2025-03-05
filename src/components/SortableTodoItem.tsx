import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  CheckCircle2,
  Circle,
  Trash2,
  Calendar,
  AlertCircle,
  GripVertical,
} from 'lucide-react';
import { format } from 'date-fns';

interface Todo {
  id: number;
  text: string;
  description: string;
  completed: boolean;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  subtasks: { id: number; text: string; completed: boolean }[];
}

interface Props {
  todo: Todo;
  darkMode: boolean;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  getPriorityColor: (priority: string) => string;
}

export function SortableTodoItem({ todo, darkMode, onToggle, onDelete, getPriorityColor }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-3 p-4 rounded-lg ${
        todo.completed
          ? darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
          : darkMode ? 'bg-gray-700' : 'bg-white'
      } border ${
        darkMode ? 'border-gray-600' : 'border-gray-200'
      } shadow-sm transition-all duration-200 hover:shadow-md`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
      </div>
      <button
        onClick={() => onToggle(todo.id)}
        className={`focus:outline-none ${
          todo.completed
            ? 'text-green-500'
            : darkMode ? 'text-gray-400' : 'text-gray-400'
        } hover:text-green-600 transition-colors duration-200`}
      >
        {todo.completed ? (
          <CheckCircle2 className="w-6 h-6" />
        ) : (
          <Circle className="w-6 h-6" />
        )}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`flex-1 truncate ${
              todo.completed
                ? darkMode ? 'text-gray-400 line-through' : 'text-gray-500 line-through'
                : darkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            {todo.text}
          </span>
          {todo.priority !== 'medium' && (
            <AlertCircle className={`w-4 h-4 ${getPriorityColor(todo.priority)}`} />
          )}
        </div>
        {todo.description && (
          <p className={`mt-1 text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          } line-clamp-2`}>
            {todo.description}
          </p>
        )}
        {todo.dueDate && (
          <div className={`mt-2 flex items-center gap-1 text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(todo.dueDate), 'MMM d, yyyy h:mm a')}</span>
          </div>
        )}
      </div>
      <button
        onClick={() => onDelete(todo.id)}
        className={`opacity-0 group-hover:opacity-100 ${
          darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-400 hover:text-red-500'
        } focus:outline-none transition-all duration-200`}
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
}