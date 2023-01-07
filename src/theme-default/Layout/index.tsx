import { useState } from 'react'

export function Layout() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <h1>this is layout component</h1>
      <div>
        {count}
        <button onClick={() => setCount(count + 1)}>Add count</button>
      </div>
    </div>
  )
}