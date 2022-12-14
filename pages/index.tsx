import axios, {AxiosError} from 'axios'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Router from 'next/router'
import React from 'react'
import { useEffect } from 'react'
import styles from '../styles/Home.module.css'

const URL:string = process.env.SERVER_URL || ''
interface ISearch {
  categoryId: number
  description: string
  tags: string
  region: string
  price: number
  city: string
  onlyMine: boolean
  limit: number
  page: number
}
const Home: NextPage = () => {
  const [errorMessage, setErrorMessage] = React.useState('')
  const [cities, setCities] = React.useState([])
  const [categories, setCategories] = React.useState([])
  const [regions, setRegions] = React.useState([])
  const [announcements, setAnnouncements] = React.useState([])
  const [onlyMine, setOnlyMine] = React.useState(false)
  const [search, setSearch] = React.useState<ISearch>({
    categoryId: 0,
    description: '',
    tags: '',
    region: '',
    price: 0,
    city: '',
    onlyMine: false,
    limit: 10,
    page: 1
  })

  useEffect( () => {
    if(!localStorage.getItem('Authorization')) {
      Router.push('/auth/login')
    }
    getCites()
    getRegions()
    getCategories()
    getSearchedAnnouncements(search)
  }, [search])

  const getCites = async () => {
    try {
      const response = await axios.get(`${URL}/announcements/cities`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('Authorization')
        }
      })
      
      setCities(response.data)
    } catch (error) {
      console.log(error)
    }
  }
  const getCategories = async () => {
    try {
      const response = await axios.get(`${URL}/category`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('Authorization')
        }
      })
      setCategories(response.data)
    } catch (error) {
      console.log(error)
    }
  }


  const getRegions = async () => {
    try {
      const response = await axios.get(`${URL}/announcements/regions`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('Authorization')
        }
      })
      setRegions(response.data)
    } catch (error) {
      console.log(error)
    }
  }


  const getSearchedAnnouncements = async (search: ISearch) => {
    try {
      const response = await axios.post(`${URL}/announcements/search`, search, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('Authorization')
        },
      })
      setAnnouncements(response.data)
    } catch (error) {
      console.log(error);
      
    }
  }

  const handleClick = async (e: any) => {
    const id: number = e.currentTarget.id
    const announcement: any = announcements.find((a:any) => a.id == id)
    if (announcement?.owner === true) {
      Router.push(`/announcements/${id}`)
    }
    
  }
  const handleSignOut = async (e: any) => {
    try {
      await axios.post(`${URL}/auth/logout`, {}, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('Authorization')
        }
      })
    } catch (error) {
      if (error instanceof AxiosError) {
        const axiosError = error as AxiosError<any>;
        if (axiosError.response) {
          setErrorMessage(axiosError.response.data.value)
        }
      }
    }
    localStorage.removeItem('Authorization')
    Router.push('/auth/login')
  }

  const handleCreateNew = async (e: any) => {
    Router.push('/announcements/create')
  }

  const handleOnlyMine = async (e: any) => {
    getSearchedAnnouncements(search)
    setSearch({
      ...search,
      onlyMine: !search.onlyMine
    })
  }

  const handleRadio = async (e: any, name: string) => {
    const { value,  } = e.currentTarget
    if (name === 'city') {
      if (value == search.city) {
        e.currentTarget.checked = false
        setSearch({
          ...search,
          city: ''
        })
      } else {
        setSearch({
          ...search,
          city: value
        })  
      }
    } else if (name == 'region') {
      if (value === search.region) {
        e.currentTarget.checked = false;
        setSearch({
          ...search,
          region: ''
        })
      } else {
        setSearch({
          ...search,
          region: value
        })
      }
    } else if (name === 'category') {
      
      if (value == search.categoryId) {
        e.currentTarget.checked = false;
        setSearch({
          ...search,
          categoryId: 0
        })
      } else {
        setSearch({
          ...search,
          categoryId: +value
        })
      }
    }
  }

  const updateSearch = async (e: any) => {
    const {name} = e.target
    let {value} = e.target
    if (name === 'price' || name === 'categoryId') {
      value = parseInt(value)
    }
    await setSearch({
      ...search,
      [name]: value
    })
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Announcements</title>
        <meta name="description" content="Generated by create next app" />
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" /> 
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <button onClick={handleCreateNew}>Create new</button>
      <button onClick={handleSignOut}>Log out</button>

      <main className={styles.main}>
        <h3>{errorMessage}</h3>
        <h1 className={styles.title}>
        Announcements
        </h1>
       <form action="" className={styles.searchBox}>
          <div>
            <p>category</p>
            {
              categories.map((category: any) => (
                <div key={category.id}><input type="radio" checked={search.categoryId === category.id} style={{display: 'inline', width: 'fit-content'}} value={category.id} onClick={(e) => handleRadio(e, 'category')}/> {category.name}</div>
              ))
            }
          </div>
          <input type="text" name="description" id="description" placeholder="Description" onChange={updateSearch}/>
          <div>
            <p>city</p>
            {
              cities.map((city: any) => (
                <div key={city}><input type="radio" checked={search.city === city} style={{display: 'inline', width: 'fit-content'}} value={city} onClick={(e) => handleRadio(e, 'city')}/> {city}</div>
              ))
            }
          </div>
          <div>
            <p>region</p>
            {
              regions.map((region: any) => (
                <div key={region}><input type="radio" checked={search.region === region} style={{display: 'inline', width: 'fit-content'}} value={region} onClick={(e) => handleRadio(e, 'region')} /> {region}</div>
              ))
            }
          </div>
          <input type="text" name="tags" id="tags" placeholder="Tags" onChange={updateSearch}/>
          <input type="number" name="price" id="price" placeholder="Price" onChange={updateSearch}/>
       </form>
        <button onClick={handleOnlyMine}>{onlyMine ? 'Show all' : "Show only mine"}</button>

        <div className={styles.grid}>
          {announcements.map((announcement: any) => (
            <a href={announcement.url} key={announcement.id} id={announcement.id} className={styles.card} onClick={handleClick}>
              <div className={'textDiv'}>
              <p>description: {announcement.description}</p>
              <p>price: {announcement.price}</p>
              <p>tags: {announcement.tags.join(', ')}</p>
              <p>city: {announcement.city}</p>
              <p>region: {announcement.region}</p>
              <p>created by : {announcement.user}</p>
              </div>
              {announcement.images.map((image: string) => {
                if (image === 'undefined' || image === undefined || image === '[]') {
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
