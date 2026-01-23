import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { DemoLayout } from './layout/DemoLayout'
import './index.css'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <DemoLayout />
    </StrictMode>,
)
