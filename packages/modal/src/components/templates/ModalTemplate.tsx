import { ReactNode } from "react";

import "./template.css";

export interface TemplateProps {
  children: ReactNode;
}

const TemplateHeader = ({ children }: TemplateProps) => {
  return <div className="modal-template-header-rm">{children}</div>;
};

TemplateHeader.displayName = "ModalTemplate.Header";

const TemplateMain = ({ children }: TemplateProps) => {
  return <div className="modal-template-main-rm">{children}</div>;
};

TemplateMain.displayName = "ModalTemplate.Main";

const TemplateFooter = ({ children }: TemplateProps) => {
  return <div className="modal-template-footer-rm">{children}</div>;
};

TemplateFooter.displayName = "ModalTemplate.Footer";

export const ModalTemplate = ({ children }: TemplateProps) => {
  return <div className="modal-template-rm">{children}</div>;
};

ModalTemplate.Header = TemplateHeader;
ModalTemplate.Main = TemplateMain;
ModalTemplate.Footer = TemplateFooter;
