import { Content } from "@carbon/react";
import { ContentProps } from "@carbon/react/lib/components/UIShell/Content";

export const ContentLayout = ({ children, ...props }: ContentProps) => {
  const className = `min-[1055px]:ms-64 ${props.className || ""}`;
  return (
    <Content {...props} className={className}>
      {children}
    </Content>
  );
};
