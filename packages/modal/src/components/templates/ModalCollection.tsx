import { ChangeEvent, useCallback, useState } from "react";
import { Modal } from "../modal";
import { ModalTemplate } from "./ModalTemplate";

const Confirm = () => (
  <ModalTemplate>
    <ModalTemplate.Header>
      <Modal.Title className="modal-template-title-rm" />
      <Modal.Title.Sub className="modal-template-sub-title-rm" />
    </ModalTemplate.Header>

    <ModalTemplate.Main>
      <Modal.Content className="modal-template-content-rm" />
      <Modal.Content.Sub className="modal-template-sub-content-rm" />
    </ModalTemplate.Main>

    <ModalTemplate.Footer>
      <Modal.Action.Cancel className="modal-template-action-cancel-rm" />
      <Modal.Action.Confirm className="modal-template-action-confirm-rm" />
    </ModalTemplate.Footer>
  </ModalTemplate>
);

Confirm.displayName = "ModalCollection.Confirm";

const Alert = () => (
  <ModalTemplate>
    <ModalTemplate.Header>
      <Modal.Title className="modal-template-title-rm" />
      <Modal.Title.Sub className="modal-template-sub-title-rm" />
    </ModalTemplate.Header>

    <ModalTemplate.Main>
      <Modal.Content className="modal-template-content-rm" />
      <Modal.Content.Sub className="modal-template-sub-content-rm" />
    </ModalTemplate.Main>

    <ModalTemplate.Footer>
      <Modal.Action.Confirm className="modal-template-action-confirm-rm" />
    </ModalTemplate.Footer>
  </ModalTemplate>
);

Alert.displayName = "ModalCollection.Alert";

const Prompt = () => {
  const [state, setState] = useState("");

  const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setState(event.target.value);
  }, []);

  return (
    <ModalTemplate>
      <ModalTemplate.Header>
        <Modal.Title className="modal-template-title-rm" />
        <Modal.Title.Sub className="modal-template-sub-title-rm" />
      </ModalTemplate.Header>

      <ModalTemplate.Main>
        <Modal.Content className="modal-template-content-rm" />
        <Modal.Content.Sub className="modal-template-sub-content-rm" />
        <div>
          <input onChange={onChange} />
        </div>
      </ModalTemplate.Main>

      <ModalTemplate.Footer>
        <Modal.Action.Cancel className="modal-template-action-cancel-rm" />
        <Modal.Action.Custom
          className="modal-template-action-confirm-rm"
          confirmType={state}
        />
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
