'use client'


import { useSearchParams } from 'next/navigation'


export default function Page() {
    const params = useSearchParams()
    const appointment = params.get("appointment")
    const patient = params.get("patient")
    return <div>
        <h4>Appointment: {appointment}</h4>
        <h4>Patient: {patient}</h4>
    </div>
}
