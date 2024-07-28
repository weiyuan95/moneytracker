'use client';
import { Box, Button, Divider, Flex,LoadingOverlay, Text, Textarea, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/navigation';
import { ReactElement, useEffect, useState } from 'react';

import { useHoldings } from '../../store/HoldingsProvider';

export function Settings(): ReactElement {
  const { clearAllHoldings, isLoading: isHoldingsLoading, getHoldingsDto, setHoldingsByDto } = useHoldings();
  const [importData, setImportData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // No choice but to use a useEffect here, since getHoldingsDto is a reactive value - we need to sync up with the localstorage
  useEffect(() => {
    setImportData(JSON.stringify(getHoldingsDto()));
  }, [getHoldingsDto]);

  return (
    <>
      <Box pos="relative">
        <LoadingOverlay visible={isLoading || isHoldingsLoading} loaderProps={{ type: 'dots' }} />
        <Title>Settings</Title>
        <>
          <Title order={3} mt="xl">
            Export / Import data
          </Title>
          <Divider mb="sm" />
          <Text size="sm" mb="sm">
            Copy the text below and paste it in another browser running the application to import your data there.
          </Text>

          <Textarea
            value={importData}
            onChange={(event) => {
              setImportData(event.currentTarget.value);
            }}
          />
          <Flex justify="center">
            <Button
              my="md"
              onClick={async () => {
                try {
                  setIsLoading(true);
                  await setHoldingsByDto(JSON.parse(importData));
                  setIsLoading(false);

                  notifications.show({
                    title: 'Import Successful',
                    message: 'Successfully imported data.',
                    color: 'green',
                  });

                  // Redirect back to main page after importing data
                  router.push('/');
                } catch (e) {
                  console.error(e);
                  notifications.show({
                    title: 'Error',
                    message: 'Unable to import data. Please check the data and try again.',
                    color: 'red',
                  });
                }
              }}
            >
              Import data
            </Button>
          </Flex>
        </>
        <>
          <Title c="red" order={3} mt="xl">
            Delete all data
          </Title>
          <Divider mb="sm" />
          <Text size="sm">This is an irreversible process. Be very sure that you want to delete your data.</Text>
          <Flex justify="center">
            <Button
              color="red"
              mt="md"
              onClick={() => {
                clearAllHoldings();
                notifications.show({
                  title: 'Delete successfully',
                  message: 'Successfully deleted all data.',
                  color: 'green',
                });
                // Redirect back to main page after deleting data
                router.push('/');
              }}
            >
              Delete all data
            </Button>
          </Flex>
        </>
      </Box>
    </>
  );
}
