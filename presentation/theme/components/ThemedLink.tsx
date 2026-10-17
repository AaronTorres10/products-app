import { CustomFonts } from "@/constants/theme";
import { Link, LinkProps } from "expo-router";
import { useThemeColor } from "../hooks/useThemeColor";

interface Props extends LinkProps {}

const ThemedLink = ({ style, ...rest }: Props) => {
  const primaryColor = useThemeColor({}, "primary");
  return (
    <Link
      style={[
        {
          color: primaryColor,
          fontFamily: CustomFonts.regular,
          fontSize: 14,
          paddingVertical: 10,
        },
        style,
      ]}
      {...rest}
    />
  );
};

export default ThemedLink;
