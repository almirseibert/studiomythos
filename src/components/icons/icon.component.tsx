import {ICONS} from '.';

interface IconProps {
  name: keyof typeof ICONS;
}

export function Icon (props: IconProps) {
  const IconX = ICONS[props.name];    
  return <IconX />;
}