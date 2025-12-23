import { Content } from "@carbon/react";
import { ContentProps } from "@carbon/react/lib/components/UIShell/Content";

export const ContentLayout = (
  { children, ...props }: ContentProps = {
    className: "min-[1055px]:ml-[16rem]",
  },
) => {
  return <Content {...props}>{children}</Content>;
};
