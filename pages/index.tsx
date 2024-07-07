import { useEffect, useState } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
} from 'firebase/firestore';
import backgroundImg from '@/public/background.jpg';
import {
  Button,
  Card,
  CardBody,
  Chip,
  Input,
  Progress,
  Select,
  SelectItem,
  Tab,
  Tabs,
} from '@nextui-org/react';
import AddIcon from '@/public/icons/add';
import { ALL, COMPLETED, IN_PROGRESS, PENDING } from '@/utils/constants';
import SearchIcon from '@/public/icons/search';
import { formatDueDate, isPast, isToday, isTomorrow } from '@/utils/helpers';
import TaskForm from '@/pages/taskForm';
import { todoType } from '@/utils/types';
import DeleteIcon from '@/public/icons/delete';
import DeleteConfirmation from '@/pages/deleteConfirmation';
import NoTasks from '@/public/icons/noTasks';
import { db as firebaseDB } from './api/firebase';

const Home = () => {
  const [todos, setTodos] = useState<todoType[]>([]);
  const [selected, setSelected] = useState(ALL);
  const [openForm, setOpenForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDelete, setOpenDelete] = useState<string | null>(null);

  const percentageComplete =
    (todos.filter(todo => todo.status === COMPLETED).length / todos.length) *
    100;

  useEffect(() => {
    const q = query(collection(firebaseDB, 'todo-list'));
    const unsubscribe = onSnapshot(q, querySnapshot => {
      const newTodos: todoType[] = [];
      querySnapshot.docs.forEach(async newDoc => {
        newTodos.push({ ...newDoc.data(), id: newDoc.id } as todoType);
      });
      console.log('newTodos', newTodos);
      setTodos(newTodos);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // filter by selected tab and sort by due date
  const filteredTodos = todos
    .filter(todo => {
      if (selected === ALL) return true;
      return todo.status === selected;
    })
    .filter(
      todo =>
        todo.task_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        todo.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => a.dueDate - b.dueDate);

  const handleStatusChange = async (todo: todoType, newStatus: string) => {
    const newTodo = { ...todo, status: newStatus };
    console.log('newTodo', newTodo);
    if (!newTodo.id) return;
    await updateDoc(doc(firebaseDB, 'todo-list', todo.id), newTodo);
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(firebaseDB, 'todo-list', id));
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImg.src})`,
        backgroundSize: 'cover',
      }}
      className="w-full h-full p-[24px] pb-[72px] absolute overflow-hidden"
    >
      <div className="flex justify-between items-start gap-4 w-full mb-6">
        <div className="flex items-start gap-2 flex-col">
          <h1 className="text-4xl font-bold text-white">Your Tasks</h1>
          <p className="text-foreground-900">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <Button
          color="default"
          variant="shadow"
          startContent={<AddIcon />}
          onClick={() => setOpenForm(true)}
        >
          Add Task
        </Button>
      </div>

      <div className="flex w-full mb-6 absolute bottom-0 left-0 justify-center z-10">
        {/* @ts-ignore */}
        <Tabs selectedKey={selected} onSelectionChange={setSelected} size="lg">
          <Tab key={ALL} title="All" />
          <Tab key={PENDING} title="Pending" />
          <Tab key={IN_PROGRESS} title="In Progress" />
          <Tab key={COMPLETED} title="Done" />
        </Tabs>
      </div>

      {todos.length === 0 ? (
        <div className="w-full h-[calc(100%-164px)] flex flex-col justify-center items-center">
          <NoTasks className="w-2/3 h-2/3" />
          <p className="text-2xl text-slate-600 mt-[-55px]">No Tasks found</p>
        </div>
      ) : (
        <>
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4 mb-6">
            <Input
              placeholder="Search"
              startContent={<SearchIcon />}
              isClearable
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onClear={() => setSearchTerm('')}
              size="lg"
              classNames={{
                label: 'text-black/50 dark:text-white/90',
                input: [
                  'bg-transparent',
                  'text-black/90 dark:text-white/90',
                  'placeholder:text-default-700/50 dark:placeholder:text-white/60',
                ],
                innerWrapper: 'bg-transparent',
                inputWrapper: [
                  'shadow-xl',
                  'bg-default-200/50',
                  'dark:bg-default/60',
                  'backdrop-blur-xl',
                  'backdrop-saturate-200',
                  'hover:bg-default-200/70',
                  'dark:hover:bg-default/70',
                  'group-data-[focus=true]:bg-default-200/50',
                  'dark:group-data-[focus=true]:bg-default/60',
                  '!cursor-text',
                ],
              }}
            />
          </div>

          <Card
            shadow="md"
            isBlurred
            className="border-none bg-background/60 dark:bg-default-100/50 w-full rounded-large mb-6"
          >
            <CardBody className="p-3">
              <Progress
                size="md"
                radius="sm"
                color={
                  percentageComplete >= 50
                    ? 'success'
                    : percentageComplete >= 25
                      ? 'warning'
                      : 'danger'
                }
                classNames={{
                  base: 'w-full',
                  track: 'drop-shadow-md border border-default',
                  // indicator: 'bg-gradient-to-r from-pink-500 to-yellow-500',
                  label: 'tracking-wider font-medium text-default-600',
                  value: 'text-foreground/60',
                }}
                label="Task Completion"
                value={percentageComplete}
                showValueLabel
              />
            </CardBody>
          </Card>

          <div
            className="h-full overflow-auto max-h-[calc(100%-260px)]"
            style={{ scrollbarWidth: 'none' }}
          >
            {filteredTodos.length === 0 ? (
              <div className="w-full h-full flex flex-col justify-center items-center">
                <NoTasks className="w-2/3 h-2/3" />
                <p className="text-2xl text-slate-600 mt-[-55px]">
                  No Tasks found
                </p>
              </div>
            ) : (
              <div
                className="flex flex-col gap-6 w-full justify-start"
                style={{ scrollbarWidth: 'none' }}
              >
                {filteredTodos.map(todo => (
                  <Card
                    key={todo.id}
                    shadow="md"
                    isBlurred
                    className="border-none bg-background/60 dark:bg-default-100/50 w-full rounded-large"
                  >
                    <CardBody className="p-3 min-h-[160px] gap-2">
                      <div className="flex justify-between items-center">
                        <h2
                          className={`text-large w-full overflow-hidden text-ellipsis whitespace-nowrap ${todo.status === COMPLETED && 'line-through'}`}
                        >
                          {todo.task_name}
                        </h2>
                        <Button
                          isIconOnly
                          variant="flat"
                          color="danger"
                          onClick={() => setOpenDelete(todo.id)}
                        >
                          <DeleteIcon />
                        </Button>
                      </div>
                      <p
                        className={`text-paragraph overflow-ellipsis-2-lines text-justify ${todo.status === COMPLETED && 'line-through'}`}
                      >
                        {todo.description}
                      </p>
                      <div className="grid grid-cols-1 gap-2 items-center sm:grid-cols-2 sm:justify-between mt-auto">
                        <Select
                          color={
                            todo.status === PENDING
                              ? 'warning'
                              : todo.status === IN_PROGRESS
                                ? 'primary'
                                : 'success'
                          }
                          key={todo.id}
                          selectedKeys={[todo.status]}
                          onChange={e =>
                            handleStatusChange(todo, e.target.value)}
                          className="max-w-xs"
                        >
                          <SelectItem key={PENDING} value={PENDING}>
                            Pending
                          </SelectItem>
                          <SelectItem key={IN_PROGRESS}>In Progress</SelectItem>
                          <SelectItem key={COMPLETED}>Done</SelectItem>
                        </Select>
                        {todo.status !== COMPLETED && (
                          <Chip
                            variant="solid"
                            color={
                              isPast(new Date(+todo.dueDate))
                                ? 'danger'
                                : isToday(new Date(+todo.dueDate))
                                  ? 'warning'
                                  : isTomorrow(new Date(+todo.dueDate))
                                    ? 'primary'
                                    : 'default'
                            }
                            radius="sm"
                            className="sm:ml-auto"
                          >
                            {formatDueDate(todo.dueDate)}
                          </Chip>
                        )}
                        {todo.status === COMPLETED && (
                          <Chip
                            variant="solid"
                            color="success"
                            radius="sm"
                            className="sm:ml-auto"
                          >
                            Completed on{' '}
                            {new Date(todo.updatedAt).toLocaleDateString(
                              'en-US',
                              {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              },
                            )}
                          </Chip>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <TaskForm
        open={openForm}
        onClose={() => setOpenForm(false)}
      />
      <DeleteConfirmation
        open={!!openDelete}
        onClose={() => setOpenDelete(null)}
        handleDelete={() => {
          if (openDelete) {
            handleDelete(openDelete);
            setOpenDelete(null);
          }
        }}
      />
    </div>
  );
};

export default Home;
