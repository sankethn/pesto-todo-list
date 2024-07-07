import {
  Button,
  DatePicker,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from '@nextui-org/react';
import {
  now,
  getLocalTimeZone,
  ZonedDateTime,
} from '@internationalized/date';
import { addDoc, collection } from 'firebase/firestore';
import { useState } from 'react';
import { todoType } from '@/utils/types';
import { PENDING } from '@/utils/constants';
import { db as firebaseDB } from './api/firebase';

type TaskFormProps = {
  open: boolean;
  onClose: () => void;
};

const convertToTimestamp = (dateObj: ZonedDateTime) => {
  const { year, month, day, hour, minute, second, millisecond } = dateObj;

  // Create a new Date object with the local time
  const localDate = new Date(
    year,
    month - 1,
    day,
    hour,
    minute,
    second,
    millisecond,
  );

  // Get the UTC timestamp
  const utcTimestamp = localDate.getTime();

  return utcTimestamp;
};

const TaskForm: React.FC<TaskFormProps> = ({ open, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState(now(getLocalTimeZone()));
  const [nameError, setNameError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name) {
      setNameError(true);
      return;
    }

    setLoading(true);
    setNameError(false);
    try {
      const todo: todoType = {
        id: '',
        task_name: name,
        description: description,
        status: PENDING,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        dueDate: convertToTimestamp(selectedDate),
      };
      await addDoc(collection(firebaseDB, 'todo-list'), todo);
      setLoading(false);
      handleCancel();
    } catch (error) {
      console.error('Error adding document: ', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (loading) return;
    setName('');
    setDescription('');
    setNameError(false);
    setLoading(false);
    onClose();
  };

  return (
    <Modal
      isOpen={open}
      size="lg"
      onClose={handleCancel}
      isDismissable={false}
      backdrop="opaque"
    >
      <ModalContent>
        {/* eslint-disable-next-line */}
        {handleCancel => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Create a Task
            </ModalHeader>
            <ModalBody>
              <Input
                label="Task Name"
                placeholder="Task Name"
                value={name}
                onChange={e => {
                  setName(e.target.value);
                  setNameError(false);
                }}
                onClear={() => setName('')}
                required
                isInvalid={nameError}
                errorMessage="Task Name is required"
                autoFocus
              />
              <Textarea
                label="Description"
                placeholder="Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                onClear={() => setDescription('')}
              />
              <DatePicker
                label="Due Date"
                hideTimeZone
                showMonthAndYearPickers
                value={selectedDate}
                onChange={date => setSelectedDate(date)}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={handleCancel}
                disabled={loading}
              >
                Close
              </Button>
              <Button
                color="primary"
                onPress={handleSubmit}
                isLoading={loading}
              >
                {loading ? 'Creating...' : 'Create'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default TaskForm;
