import Head from 'next/head'
import styles from '@/styles/home.module.css'
import { Layout } from '@/layouts/layouts';
import Tables from '@/components/tasks/Tables';

const Tasks = () => {
  return (
    <>
      <Head>
        <title>Todo App | Task</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <main className={`${styles.main}`}>
          <div className={styles.main_container}>
            <Tables />
          </div>
        </main>
      </Layout>
    </>
  )
}

export default Tasks
