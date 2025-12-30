// src/lib/useData.ts
import { useEffect, useState } from 'react'

export const useJson = <T,>(url: string) => {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    setLoading(true)

    fetch(url)
      .then(r => r.json())
      .then(json => {
        if (!alive) return
        setData(json)
        setError(null)
      })
      .catch(e => {
        if (!alive) return
        setError(String(e))
      })
      .finally(() => alive && setLoading(false))

    return () => {
      alive = false
    }
  }, [url])

  return { data, error, loading }
}

