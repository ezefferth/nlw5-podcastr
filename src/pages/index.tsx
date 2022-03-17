
import { useEffect } from "react"

export default function Home() {

  useEffect(() => {
    fetch('http://localhost:3333/episodes')
      .then(response => response.json())
      .then(data => console.log(data))
  }, [])

  return (
    <h1>index home</h1>

  )
}
