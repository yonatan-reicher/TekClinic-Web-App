import { Table, Container, Title } from '@mantine/core';
import { PatientResponse } from '../apiCalls';

export default function PatientTable({ patientList }: { patientList: PatientResponse[] }) {
    return (
        <Container>
            {patientList && patientList.length > 0 ? (
                <Table striped highlightOnHover withTableBorder withColumnBorders>
                    <Table.Thead>
                        <Table.Tr style={{ backgroundColor: 'gray' }}>
                            <Table.Th>Name</Table.Th>
                            <Table.Th>Gender</Table.Th>
                            <Table.Th>Phone Number</Table.Th>
                            <Table.Th>Languages</Table.Th>
                            <Table.Th>Age</Table.Th>
                            <Table.Th>Referred By</Table.Th>
                            <Table.Th>Special Note</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {patientList.map((patient) => (
                            <Table.Tr key={patient.id}>
                                <Table.Td>{patient.name}</Table.Td>
                                <Table.Td>{patient.gender}</Table.Td>
                                <Table.Td>{patient.phone_number}</Table.Td>
                                <Table.Td>{patient.languages.join(', ')}</Table.Td>
                                <Table.Td>{patient.age}</Table.Td>
                                <Table.Td>{patient.referred_by}</Table.Td>
                                <Table.Td>{patient.special_note}</Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            ) : (
                <p>No patients to display.</p>
            )}
        </Container>
    );
}
