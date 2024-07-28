'use client';
import { ActionIcon, Group, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons-react';
import classes from './SchemeToggle.module.css';
import clsx from 'clsx';

export function SchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  return (
    <Group justify="center">
      <ActionIcon
        onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
        variant="default"
        size="lg"
        aria-label="Toggle color scheme"
      >
        <IconSun className={clsx(classes.icon, classes.light)} stroke={1.5} />
        <IconMoon className={clsx(classes.icon, classes.dark)} stroke={1.5} />
      </ActionIcon>
    </Group>
  );
}
