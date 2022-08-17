import axios, {AxiosError} from 'axios'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Router from 'next/router'
import React from 'react'
import { useEffect } from 'react'
import styles from '../styles/Home.module.css'
const URL:string = process.env.SERVER_URL || 'http://localhost:8080'

const Home: NextPage = () => {
  const [errorMessage, setErrorMessage] = React.useState('')
  const [announcements, setAnnouncements] = React.useState([])

  useEffect(() => {
    if(!localStorage.getItem('Authorization')) {
      Router.push('/auth/login')
    }
    getAnnouncements()
  }, [])

  const getAnnouncements = async () => {
    try {
      const response = await axios.get(`${URL}/announcements`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('Authorization')
        }
      })
      setAnnouncements(response.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        const axiosError = error as AxiosError<any>;
        if (axiosError.response) {
          setErrorMessage(axiosError.response.data.value)
        }
      }
    }
  }

  const handleClick = async (e: any) => {
    const id: number = e.currentTarget.id
    Router.push(`/announcements/${id}`)
    
  }
  const handleSignOut = async (e: any) => {
    const response = await axios.post(`${URL}/auth/logout`, {}, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('Authorization')
      }
    })
    localStorage.removeItem('Authorization')
    Router.push('/auth/login')
  }

  return (
    <div className={styles.container}>
      <button onClick={handleSignOut}>Log out</button>
      <Head>
        <title>Announcements</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h3>{errorMessage}</h3>
        <h1 className={styles.title}>
        Announcements
        </h1>


        <div className={styles.grid}>
          {announcements.map((announcement: any) => (
            <a href={announcement.url} key={announcement.id} id={announcement.id} className={styles.card} onClick={handleClick}>
              <div className={'textDiv'}>
              <p>{announcement.description}</p>
              <p>price: {announcement.price}</p>
              <p>tags: {announcement.tags.join(', ')}</p>
              <p>city: {announcement.city}</p>
              <p>region: {announcement.region}</p>
              </div>
              {announcement.images.map((image: string) => {
                if (image === 'undefined') {
                  return 'no image'
                }
                const src=`${URL}/uploads/${announcement.images[0]}`
                return (
                  <Image loader={() => src} src={src} alt={announcement.title} key={src} width="100%" height="100%"	/>
                )
              })}
            </a>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
        </a>
      </footer>
    </div>
  )
}

export default Home