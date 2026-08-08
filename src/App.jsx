import { useMemo, useState } from 'react'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [taskName, setTaskName] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [category, setCategory] = useState('General')
  const [dueDate, setDueDate] = useState('')
  const [search, setSearch] = useState('')
  const [view, setView] = useState('All Tasks')
  const [sort, setSort] = useState('Default')

  const visibleTasks = useMemo(() => {
    const filtered = tasks.filter((task) => {
      const matchesSearch = task.name.toLowerCase().includes(search.toLowerCase())
      const matchesView = view === 'All Tasks'
        || (view === 'Active' && !task.completed)
        || (view === 'Completed' && task.completed)
        || task.priority === view.replace(' Priority', '')
      return matchesSearch && matchesView
    })

    return [...filtered].sort((first, second) => {
      if (sort === 'Priority') return ['High', 'Medium', 'Low'].indexOf(first.priority) - ['High', 'Medium', 'Low'].indexOf(second.priority)
      if (sort === 'Due date') return (first.dueDate || '9999').localeCompare(second.dueDate || '9999')
      return first.id - second.id
    })
  }, [tasks, search, view, sort])

  const addTask = (event) => {
    event.preventDefault()
    if (!taskName.trim()) return
    setTasks((current) => [...current, { id: Date.now(), name: taskName.trim(), priority, category, dueDate, completed: false }])
    setTaskName('')
    setDueDate('')
  }

  const toggleTask = (id) => setTasks((current) => current.map((task) => (
    task.id === id ? { ...task, completed: !task.completed } : task
  )))

  const totalDone = tasks.filter((task) => task.completed).length
  const navItems = [['All Tasks', '=', tasks.length], ['Active', 'o', tasks.filter((task) => !task.completed).length], ['Completed', 'v', totalDone]]

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><strong>Task<span>Flow</span></strong><small>PRODUCTIVITY SUITE</small></div>
        <nav>
          <p className="nav-label">VIEWS</p>
          {navItems.map(([label, icon, count]) => <button className={view === label ? 'nav-item selected' : 'nav-item'} key={label} onClick={() => setView(label)}><span>{icon}</span>{label}<b>{count}</b></button>)}
          <div className="nav-divider" />
          {[['High Priority', '^'], ['Medium', '-'], ['Low Priority', 'v']].map(([label, icon]) => <button className={view === label ? 'nav-item priority selected-priority' : 'nav-item priority'} key={label} onClick={() => setView(label)}><span>{icon}</span>{label}<b>{tasks.filter((task) => task.priority === label.replace(' Priority', '')).length}</b></button>)}
          <div className="nav-divider" />
          <button className="nav-item priority" onClick={() => setView('Due Today')}><span>#</span>Due Today<b>0</b></button>
          <button className="nav-item priority" onClick={() => setView('Overdue')}><span>!</span>Overdue<b>0</b></button>
        </nav>
        <div className="sidebar-stats"><div><strong>{tasks.length}</strong><small>TOTAL</small></div><div><strong>{totalDone}</strong><small>DONE</small></div><div><strong>{tasks.length ? Math.round((totalDone / tasks.length) * 100) : 0}%</strong><small>RATE</small></div><div className="progress"><i style={{ width: `${tasks.length ? (totalDone / tasks.length) * 100 : 0}%` }} /></div></div>
      </aside>

      <main className="workspace">
        <header className="page-header"><h1>All Tasks <time>SAT, AUG 8</time></h1><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort tasks"><option>Default</option><option>Priority</option><option>Due date</option></select></header>
        <label className="search-box"><span>?</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks..." /></label>
        <form className="composer" onSubmit={addTask}><div className="composer-main"><input value={taskName} onChange={(event) => setTaskName(event.target.value)} placeholder="Add a new task..." aria-label="Task name" /><button className="add-button" type="submit">+ Add Task</button></div><div className="composer-options"><select value={priority} onChange={(event) => setPriority(event.target.value)} aria-label="Priority"><option>High</option><option>Medium</option><option>Low</option></select><select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Category"><option>General</option><option>Work</option><option>Personal</option></select><input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} aria-label="Due date" /></div></form>
        <section className="task-toolbar"><span><strong>{visibleTasks.length}</strong> tasks</span><button onClick={() => setTasks((current) => current.map((task) => ({ ...task, completed: true })))}>v Complete all visible</button><button onClick={() => setTasks((current) => current.filter((task) => !task.completed))}>x Clear completed</button></section>
        {visibleTasks.length ? <section className="task-list">{visibleTasks.map((task) => <article className={task.completed ? 'task-card completed' : 'task-card'} key={task.id}><button className="check" onClick={() => toggleTask(task.id)}>{task.completed ? 'v' : ''}</button><div className="task-copy"><strong>{task.name}</strong><span>{task.category}{task.dueDate ? `  -  ${task.dueDate}` : ''}</span></div><em className={`tag ${task.priority.toLowerCase()}`}>{task.priority}</em></article>)}</section> : <div className="empty-state"><div className="mailbox">=</div><h2>No tasks here</h2><p>Add a task above or change your filter</p></div>}
      </main>
    </div>
  )
}

export default App
