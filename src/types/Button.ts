export type ButtonVariant = 
  | 'default'
  | 'disabled'
  | 'danger'
  | 'outline'
  | 'dark'
  | 'light'
  | 'ghost'
  | 'filter';

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}
