import React from 'react';
import { Button, Result } from 'antd';
import Head from 'next/head';

export default function Error404(): JSX.Element {
  return (
    <>
      <Head>
        <title>
          404 | Not found
        </title>
      </Head>

      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={<Button type="primary" href='/'>Back Home</Button>}
    />
    </>
  );
}