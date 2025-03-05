import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Tag,
  ChevronDown,
  AlertCircle,
  Star,
  Sun,
  Moon,
} from 'lucide-react';
import { format } from 'date-fns';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableTodoItem } from './components/SortableTodoItem';

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

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [showForm, setShowForm] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
  }, []);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      const newTask: Todo = {
        id: Date.now(),
        text: newTodo.trim(),
        description: description.trim(),
        completed: false,
        dueDate,
        priority,
        tags: [],
        subtasks: [],
      };
      setTodos([...todos, newTask]);
      setNewTodo('');
      setDescription('');
      setDueDate('');
      setPriority('medium');
      setShowForm(false);
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setTodos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-500 to-pink-500'
    }`}>
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className={`max-w-2xl mx-auto ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } rounded-xl shadow-xl overflow-hidden`}>
          <div className="px-6 py-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className={`text-3xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                My Tasks
              </h1>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${
                  darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                } hover:opacity-80 transition-opacity`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex gap-2 mb-6">
              {['all', 'active', 'completed'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as typeof filter)}
                  className={`px-4 py-2 rounded-lg capitalize ${
                    filter === f
                      ? 'bg-purple-500 text-white'
                      : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`
                  } hover:opacity-80 transition-all duration-200`}
                >
                  {f}
                </button>
              ))}
            </div>

            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className={`w-full px-4 py-3 ${
                  darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-600'
                } rounded-lg hover:opacity-80 transition-all duration-200 flex items-center justify-center gap-2`}
              >
                <Plus className="w-5 h-5" />
                Add New Task
              </button>
            ) : (
              <form onSubmit={addTodo} className="mb-6 space-y-4">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="Task title..."
                  className={`w-full px-4 py-2 rounded-lg ${
                    darkMode
                      ? 'bg-gray-700 text-white placeholder-gray-400'
                      : 'bg-white text-gray-900 placeholder-gray-500'
                  } border ${
                    darkMode ? 'border-gray-600' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description (optional)"
                  className={`w-full px-4 py-2 rounded-lg ${
                    darkMode
                      ? 'bg-gray-700 text-white placeholder-gray-400'
                      : 'bg-white text-gray-900 placeholder-gray-500'
                  } border ${
                    darkMode ? 'border-gray-600' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  rows={3}
                />
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className={`block text-sm font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    } mb-1`}>
                      Due Date
                    </label>
                    <input
                      type="datetime-local"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg ${
                        darkMode
                          ? 'bg-gray-700 text-white'
                          : 'bg-white text-gray-900'
                      } border ${
                        darkMode ? 'border-gray-600' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    } mb-1`}>
                      Priority
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                      className={`px-4 py-2 rounded-lg ${
                        darkMode
                          ? 'bg-gray-700 text-white'
                          : 'bg-white text-gray-900'
                      } border ${
                        darkMode ? 'border-gray-600' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors duration-200"
                  >
                    Add Task
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className={`px-4 py-2 ${
                      darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                    } rounded-lg hover:opacity-80 transition-all duration-200`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={filteredTodos}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3 mt-6">
                  {filteredTodos.map(todo => (
                    <SortableTodoItem
                      key={todo.id}
                      todo={todo}
                      darkMode={darkMode}
                      onToggle={toggleTodo}
                      onDelete={deleteTodo}
                      getPriorityColor={getPriorityColor}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {todos.length === 0 && (
              <div className={`text-center ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              } mt-8`}>
                <p>No tasks yet. Add one to get started!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;