'use client';
import { Button, rem } from '@mantine/core';
import { useRouter } from 'next/navigation';

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
