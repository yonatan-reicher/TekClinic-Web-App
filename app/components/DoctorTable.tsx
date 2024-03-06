import { Table, Container, Title } from '@mantine/core';
import { DoctorResponse } from '../apiCalls';

export default function DoctorTable({ doctorList }: { doctorList: DoctorResponse[] }) {
    return (
        <Container>
            {doctorList && doctorList.length > 0 ? (
                <Table striped highlightOnHover withTableBorder withColumnBorders>
                    <Table.Thead>
                        <Table.Tr style={{ backgroundColor: 'gray' }}>
                            <Table.Th>Name</Table.Th>
                            <Table.Th>Gender</Table.Th>
                            <Table.Th>Phone Number</Table.Th>
                            <Table.Th>Specialities</Table.Th>
                            <Table.Th>Special Note</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {doctorList.map((doctor) => (
                            <Table.Tr key={doctor.id}>
                                <Table.Td>{doctor.name}</Table.Td>
                                <Table.Td>{doctor.gender}</Table.Td>
                                <Table.Td>{doctor.phone_number}</Table.Td>
                                <Table.Td>{doctor.specialities.join(', ')}</Table.Td>
                                <Table.Td>{doctor.special_note}</Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            ) : (
                <p>No doctors to display.</p>
            )}
        </Container>
    );
}
