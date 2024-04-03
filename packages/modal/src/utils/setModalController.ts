import ModalManager from "../services/modalManager";

function setModalController(modalManager: ModalManager) {
  return {
    open: modalManager.open,
    close: modalManager.close,
    edit: modalManager.edit,
    remove: modalManager.remove,
  };
}

export default setModalController;
