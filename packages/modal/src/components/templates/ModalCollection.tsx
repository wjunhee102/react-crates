import { ChangeEvent, KeyboardEvent, useState } from "react";
import { Modal } from "../modal";
import { ModalTemplate } from "./ModalTemplate";
import { ModalComponentProps } from "../../types";

const Alert = () => (
  <ModalTemplate className="modal-template-bg-rm">
    <ModalTemplate.Header>
      <Modal.Title className="modal-collection-title-rm">Alert</Modal.Title>
      <Modal.Title.Sub className="modal-collection-sub-title-rm" />
    </ModalTemplate.Header>

    <ModalTemplate.Main>
      <Modal.Content className="modal-collection-content-rm" />
      <Modal.Content.Sub className="modal-collection-sub-content-rm" />
    </ModalTemplate.Main>

    <ModalTemplate.Footer>
      <Modal.Action.Confirm className="modal-collection-action-rm modal-collection-confirm-rm">
        Confirm
      </Modal.Action.Confirm>
    </ModalTemplate.Footer>
  </ModalTemplate>
);

Alert.displayName = "ModalCollection.Alert";

const Confirm = () => (
  <ModalTemplate className="modal-template-bg-rm">
    <ModalTemplate.Header>
      <Modal.Title className="modal-collection-title-rm">Confirm</Modal.Title>
      <Modal.Title.Sub className="modal-collection-sub-title-rm" />
    </ModalTemplate.Header>

    <ModalTemplate.Main>
      <Modal.Content className="modal-collection-content-rm" />
      <Modal.Content.Sub className="modal-collection-sub-content-rm" />
    </ModalTemplate.Main>

    <ModalTemplate.Footer>
      <Modal.Action.Cancel className="modal-collection-action-rm modal-collection-cancel-rm">
        Cancel
      </Modal.Action.Cancel>
      <Modal.Action.Confirm className="modal-collection-action-rm modal-collection-confirm-rm">
        Confirm
      </Modal.Action.Confirm>
    </ModalTemplate.Footer>
  </ModalTemplate>
);

Confirm.displayName = "ModalCollection.Confirm";

const Prompt = ({ action }: ModalComponentProps) => {
  const [state, setState] = useState("");

  const actionToKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    action(state);
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setState(event.target.value);
  };

  return (
    <ModalTemplate className="modal-template-bg-rm">
      <ModalTemplate.Header>
        <Modal.Title className="modal-collection-title-rm">Prompt</Modal.Title>
        <Modal.Title.Sub className="modal-collection-sub-title-rm" />
      </ModalTemplate.Header>

      <ModalTemplate.Main>
        <Modal.Content className="modal-collection-content-rm" />
        <Modal.Content.Sub className="modal-collection-sub-content-rm" />
        <div className="modal-collection-prompt-rm">
          <input
            onChange={onChange}
            onKeyUp={actionToKeyUp}
            className="modal-collection-prompt-input-rm"
          />
        </div>
      </ModalTemplate.Main>

      <ModalTemplate.Footer>
        <Modal.Action.Cancel className="modal-collection-action-rm modal-collection-cancel-rm">
          Cancel
        </Modal.Action.Cancel>
        <Modal.Action.Custom
          className="modal-collection-action-rm modal-collection-confirm-rm"
          confirmType={state}
        >
          Confirm
        </Modal.Action.Custom>
      </ModalTemplate.Footer>
    </ModalTemplate>
  );
};

Prompt.displayName = "ModalCollection.Prompt";

export const modalCollection = {
  confirm: {
    component: Confirm,
    defaultOptions: {
      backCoverConfirm: false,
      escKeyActive: true,
      role: "dialog",
      label: "confirm",
    },
  },
  alert: {
    component: Alert,
    defaultOptions: {
      backCoverConfirm: true,
      escKeyActive: true,
      role: "alertdialog",
      label: "alert",
    },
  },
  prompt: {
    component: Prompt,
    defaultOptions: {
      backCoverConfirm: undefined,
      escKeyActive: true,
      role: "dialog",
      label: "prompt",
    },
  },
};
