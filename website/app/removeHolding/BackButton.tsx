'use client';
import { useRouter } from 'next/navigation';
import { Button, rem } from '@mantine/core';

export function BackButton() {
  const router = useRouter();

  return (
    <Button
      style={{ width: rem(100) }}
      onClick={() => {
        router.back();
      }}
    >
      Back
    </Button>
  );
}
