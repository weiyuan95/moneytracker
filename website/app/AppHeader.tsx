'use client';
import { Burger, Container, Drawer, Flex, Tabs } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { usePathname, useRouter } from 'next/navigation';

import classes from './AppHeader.module.css';
import { CurrencyToggle } from './CurrencyToggle';
import { PrivacyToggle } from './PrivacyToggle';
import { SchemeToggle } from './SchemeToggle';

const links = [
  { link: '/', label: 'Holdings' },
  { link: '/track', label: 'Track' },
  { link: '/settings', label: 'Settings' },
  { link: 'https://blog.weiyuan.dev/posts/about-moneytracker', label: 'About' },
];

export function AppHeader() {
  const router = useRouter();
  const pathName = usePathname();
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <header className={classes.header}>
      {/* sm-sized, consistent with the pages of the app */}
      <Container size="sm" className={classes.inner}>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />

        {/* using the pathname here might be fragile, need to make sure that it matches the `link` in links */}
        <Tabs visibleFrom="sm" value={pathName} onChange={(value) => router.push(`${value}`)}>
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

        <Drawer opened={opened} onClose={toggle} title="Menu">
          {links.map((link) => (
            <div key={link.label}>
              <a href={link.link} className={classes.link}>
                {link.label}
              </a>
              <br />
            </div>
          ))}
        </Drawer>
      </Container>
    </header>
  );
}
