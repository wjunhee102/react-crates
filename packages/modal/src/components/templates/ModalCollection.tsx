import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { Modal } from "../modal";
import { ModalTemplate } from "./ModalTemplate";

const Alert = () => (
  <ModalTemplate>
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
  <ModalTemplate>
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

const Prompt = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState("");

  const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setState(event.target.value);
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef.current]);

  return (
    <ModalTemplate>
      <ModalTemplate.Header>
        <Modal.Title className="modal-collection-title-rm">Prompt</Modal.Title>
        <Modal.Title.Sub className="modal-collection-sub-title-rm" />
      </ModalTemplate.Header>

      <ModalTemplate.Main>
        <Modal.Content className="modal-collection-content-rm" />
        <Modal.Content.Sub className="modal-collection-sub-content-rm" />
        <div className="modal-collection-prompt-rm">
          <input
            ref={inputRef}
            onChange={onChange}
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

export const ModalCollection = {
  Confirm,
  Alert,
  Prompt,
};
