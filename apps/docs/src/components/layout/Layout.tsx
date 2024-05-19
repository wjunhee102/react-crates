import { ModalProvider } from "@site/src/libs/modal";
import { default as OriginLayout, Props } from "@theme/Layout";

export default function Layout({ children, ...restProps }: Props) {
  return (
    <OriginLayout {...restProps}>
      {children}
      <ModalProvider />
    </OriginLayout>
  );
}
