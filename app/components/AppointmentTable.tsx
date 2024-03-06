import { Table, Container, Title } from '@mantine/core';
import { AppointmentResponse } from '../apiCalls';

export default function AppointmentTable({ appointmentList }: { appointmentList: AppointmentResponse[] }) {
    return (
        <Container>
            {appointmentList && appointmentList.length > 0 ? (
                <Table striped highlightOnHover withTableBorder withColumnBorders>
                    <Table.Thead>
                        <Table.Tr style={{ backgroundColor: 'gray' }}>
                            <Table.Th>Patient ID</Table.Th>
                            <Table.Th>Doctor ID</Table.Th>
                            <Table.Th>Date</Table.Th>
                            <Table.Th>Time</Table.Th>
                            <Table.Th>Approved by Patient</Table.Th>
                            <Table.Th>Visited</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {appointmentList.map((appointment) => (
                            <Table.Tr key={appointment.patient_id}>
                                <Table.Td>{appointment.patient_id}</Table.Td>
                                <Table.Td>{appointment.doctor_id}</Table.Td>
                                <Table.Td>{`${appointment.date.year}-${appointment.date.month}-${appointment.date.day}`}</Table.Td>
                                <Table.Td>{`${appointment.time.hour}:${appointment.time.minute}`}</Table.Td>
                                <Table.Td>{appointment.approved_by_patient ? 'Yes' : 'No'}</Table.Td>
                                <Table.Td>{appointment.visited ? 'Yes' : 'No'}</Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            ) : (
                <p>No appointments to display.</p>
            )}
        </Container>
    );
}
