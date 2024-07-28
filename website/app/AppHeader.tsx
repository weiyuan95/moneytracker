'use client';
import { Container, Flex, Tabs } from '@mantine/core';
import classes from './AppHeader.module.css';
import { SchemeToggle } from './SchemeToggle';
import { usePathname, useRouter } from 'next/navigation';
import { CurrencyToggle } from './CurrencyToggle';
import { PrivacyToggle } from './PrivacyToggle';

const links = [
  { link: '/', label: 'Holdings' },
  { link: '/track', label: 'Track' },
  { link: '/settings', label: 'Settings' },
];

export function AppHeader() {
  const router = useRouter();
  const pathName = usePathname();

  return (
    <header className={classes.header}>
      {/* sm-sized, consistent with the pages of the app */}
      <Container size="sm" className={classes.inner}>
        {/* using the pathname here might be fragile, need to make sure that it matches the `link` in links */}
        <Tabs value={pathName} onChange={(value) => router.push(`${value}`)}>
          <Tabs.List>
            {links.map((link) => (
              <Tabs.Tab key={link.link} value={link.link}>
                {link.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs>

        <Flex gap={5}>
          <PrivacyToggle />
          <CurrencyToggle />
          <SchemeToggle />
        </Flex>
      </Container>
    </header>
  );
}
