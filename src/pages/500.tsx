import React from 'react';
import { Button, Result } from 'antd';
import Head from 'next/head';

export default function Error500(): JSX.Element {
  return (
    <>
      <Head>
        <title>
          500 | Server error
        </title>
      </Head>

      <Result
        status="500"
        title="500"
        subTitle="Sorry, something went wrong."
        extra={<Button type="primary">Back Home</Button>}
        />
    </>
  );
}