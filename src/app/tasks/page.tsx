'use client'

import React from 'react'
import { modals } from '@mantine/modals'
import CustomTable, { type CreateModalProps } from '@/src/components/CustomTable'
import CreateTaskForm from './CreateTaskForm'
import EditTaskForm from './EditTaskForm'
import ViewTask from './ViewTask'
import { buildDeleteModal } from '@/src/utils/modals'
import { Task } from '@/src/api/model/task'

export default function TasksPage (): JSX.Element {
  // "Add Task"
  function handleShowCreateModal ({
    session,
    // computedColorScheme,
    onSuccess
  }: CreateModalProps): void {
    const modalId = 'create-task-modal'
    modals.open({
      modalId,
      title: 'Add Task',
      children: (
        <CreateTaskForm
          // TODO: Rename this to be onSuccess to be more consistent with other
          // CreatePatientForm.tsx and friends, and make this async!
          // Look at CreatePatientForm.tsx for an example, with the use of a
          // toast for pretty feedback.
          onFinish={(formData) => {
            // TODO: Move to CreateTaskForm.tsx to be more consistent with
            // CreatePatientForm.tsx and friends
            Task.create(
              {
                title: formData.name,
                description: '', // formData.description,
                patient_id: 1, // TODO: Add Patient.getByName and call it here
                expertise: '' // formData.expertise
              },
              session
            )
              .then(() => { modals.close(modalId) })
              .then(onSuccess)
              .catch((error) => {
                // TODO: we should show this on the screen with a toast instead!
                console.error('Error creating task:', error)
              })
          }}
        />
      )
    })
  }

  // "Edit Task"
  function handleShowEditModal ({
    item,
    session,
    computedColorScheme,
    onSuccess
  }: any): void {
    const modalId = 'edit-task-modal'
    modals.open({
      modalId,
      title: 'Edit Task',
      children: (
        <EditTaskForm
          item={item}
          session={session}
          computedColorScheme={computedColorScheme}
          onSuccess={async () => {
            modals.close(modalId)
            await onSuccess()
          }}
        />
      )
    })
  }

  // "View Task"
  function handleShowViewModal ({
    item,
    session,
    computedColorScheme,
    onSuccess
  }: any): void {
    const modalId = 'view-task-modal'
    modals.open({
      modalId,
      title: 'Task Information',
      children: (
        <ViewTask
          task={item}
          session={session}
          computedColorScheme={computedColorScheme}
        />
      )
    })
  }

  return (
    <CustomTable<Task>
      dataName="Task"
      storeColumnKey="task-columns"
      queryOptions={(session, page, pageSize) => ({
        queryKey: ['tasks', page, pageSize],
        queryFn: async () => {
          return await Task.get({
            skip: pageSize * (page - 1),
            limit: pageSize
          }, session)
        }
      })}
      showCreateModal={handleShowCreateModal}
      showEditModal={handleShowEditModal}
      showViewModal={handleShowViewModal}
      showDeleteModal={buildDeleteModal('task', (task) => task.title)}
      columns={[
        { title: '#', accessor: 'id' },
        { title: 'Name', accessor: 'name' },
        { title: 'Doctor', accessor: 'doctor' },
        { title: 'Patient', accessor: 'patient' }
      ]}
    />
  )
}
