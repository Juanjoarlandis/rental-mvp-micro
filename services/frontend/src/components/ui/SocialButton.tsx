// src/components/ui/SocialButton.tsx
import { IconType } from 'react-icons';
import clsx from 'clsx';

export type Provider = 'google' | 'github' | 'apple';

type Props = {
  icon: IconType;
  label: string;
  provider: Provider;
};

export default function SocialButton({ icon: Icon, label, provider }: Props) {
  const bg = {
    google: 'bg-white text-gray-700 shadow border hover:bg-gray-50',
    github: 'bg-gray-900 text-white hover:bg-gray-800',
    apple : 'bg-black text-white hover:bg-gray-800'
  }[provider];

  return (
    <a
      href={`/api/oauth/${provider}`}   // tu backend debe exponer /oauth/apple…
      className={clsx('btn flex w-full items-center justify-center gap-2', bg)}
    >
      <Icon className="h-5 w-5" />
      {label}
    </a>
  );
}
