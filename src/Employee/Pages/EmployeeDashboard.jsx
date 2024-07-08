import React from 'react'
import EmployeeNavbar from './EmployeeNavbar'
import { Route, Routes } from 'react-router-dom'
import CreateGoal from "./CreateGoal"
import Goals from './Goals'
import DraftGoals from './DraftGoals'
import ViewGoal from './ViewGoal'
import ViewDraft from './ViewDraft'

const EmployeeDashboard = () => {
    return (
        <div className="empdash">
            <EmployeeNavbar />
            <Routes>
                <Route path='/create' element={<CreateGoal />} />
                <Route path='/my-goals' element={<Goals />} />
                <Route path='/drafts' element={<DraftGoals />} />
                <Route path='/view/:id' element={<ViewGoal />} />
                <Route path='/viewdraft/:id' element={<ViewDraft />} />
            </Routes>
        </div>
    )
}

export default EmployeeDashboard