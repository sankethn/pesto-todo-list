import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';

type DeleteConfirmationProps = {
  open: boolean;
  onClose: () => void;
  handleDelete: () => void;
};

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  open,
  onClose,
  handleDelete,
}) => (
  <Modal isOpen={open} onClose={onClose} isDismissable={false}>
    <ModalContent>
      {/* eslint-disable-next-line */}
      {onClose => (
        <>
          <ModalHeader>Delete Task</ModalHeader>
          <ModalBody>
            <p>Are you sure you want to delete this task?</p>
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="light" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleDelete} color="danger">
              Delete
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  </Modal>
);

export default DeleteConfirmation;
