import { Table, Container, Title } from '@mantine/core';
import { PatientResponse } from '../apiCalls';

const generatePatientRows = (patientList: PatientResponse[]) => {
    return patientList.map((patient) => (
      <Table.Tr key={patient.id}>
        <Table.Td>{patient.id}</Table.Td>
        <Table.Td>{patient.active.toString()}</Table.Td>
        <Table.Td>{patient.name}</Table.Td>
        <Table.Td>{patient.personal_id.id}</Table.Td>
        <Table.Td>{patient.gender}</Table.Td>
        <Table.Td>{patient.phone_number}</Table.Td>
        <Table.Td>{patient.languages.join(', ')}</Table.Td>
        <Table.Td>{`${patient.birth_date.day}/${patient.birth_date.month}/${patient.birth_date.year}`}</Table.Td>
        <Table.Td>{patient.age}</Table.Td>
        <Table.Td>{patient.referred_by}</Table.Td>
        <Table.Td>
          {patient.emergency_contacts.map((contact, index) => (
            <div key={index}>
              {`Name: ${contact.name}, Closeness: ${contact.closeness}, Phone: ${contact.phone}`}
            </div>
          ))}
        </Table.Td>
        <Table.Td>{patient.special_note}</Table.Td>
      </Table.Tr>
    ));
  };
  
  const PatientTable: React.FC<{ rows: React.ReactNode }> = ({ rows }) => (
    <Table striped highlightOnHover withTableBorder withColumnBorders>
      <Table.Thead>
        <Table.Tr style={{ backgroundColor: 'gray' }}>
          <Table.Th>ID</Table.Th>
          <Table.Th>Active</Table.Th>
          <Table.Th>Name</Table.Th>
          <Table.Th>Personal_id</Table.Th>
          <Table.Th>Gender</Table.Th>
          <Table.Th>Phone Number</Table.Th>
          <Table.Th>Languages</Table.Th>
          <Table.Th>Birth Date</Table.Th>
          <Table.Th>Age</Table.Th>
          <Table.Th>Referred By</Table.Th>
          <Table.Th>Emergency Contacts</Table.Th>
          <Table.Th>special Note</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
  
  export { generatePatientRows, PatientTable };