import { ActionIcon, Loader } from '@mantine/core';
import { IconEyeDollar, IconEyeOff } from '@tabler/icons-react';
import { ReactNode, useCallback } from 'react';

import { useAppPrivacy } from './AppPrivacyProvider';

export function PrivacyToggle() {
  const { isPrivate, setIsPrivate, isLoading } = useAppPrivacy();

  const renderPrivacyIcon = useCallback((): ReactNode => {
    if (!isPrivate) {
      return <IconEyeDollar stroke={1.5} onClick={() => setIsPrivate(true)} />;
    }

    return <IconEyeOff stroke={1.5} onClick={() => setIsPrivate(false)} />;
  }, [isPrivate, setIsPrivate]);

  return (
    <ActionIcon variant="default" size="lg" aria-label="Toggle color scheme">
      {isLoading ? <Loader size="sm" /> : renderPrivacyIcon()}
    </ActionIcon>
  );
}
