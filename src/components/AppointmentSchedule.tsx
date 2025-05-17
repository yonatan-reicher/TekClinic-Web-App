import { useState } from 'react';
import { Stack, useComputedColorScheme } from '@mantine/core';
import { Appointment } from '@/src/api/model/appointment';
import { useGuaranteeSession } from '@/src/utils/auth';
import { errorHandler } from '@/src/utils/error';


export function AppointmentSchedule(props: {
    date: Date | 'today', // This might change
    doctor_id?: number,
    patient_id?: number,
}) {
    const session = useGuaranteeSession();
    const ccs = useComputedColorScheme();
    const date = props.date === 'today' ? new Date() : props.date;

    // Get an array of appointments for the given date
    // TODO: Does this actually return every appointment, or is it limited to
    // some upper count?
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    errorHandler(async () => {
        const { items } = await Appointment.get({
            date,
            doctor_id: props.doctor_id,
            patient_id: props.patient_id,
        }, session);
        setAppointments(items);
    }, ccs)

    return (
        <Stack>
            Today's Appointments
            {...appointments.map((appointment) => appointment.patient_id)}
        </Stack>
    );
}
