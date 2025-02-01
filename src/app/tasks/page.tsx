// src/app/tasks/page.tsx
'use client'

import { registerLicense } from '@syncfusion/ej2-base';
registerLicense('Ngo9BigBOggjHTQxAR8/V1NMaF5cWWJCfEx0Qnxbf1x1ZFRGal9STnVWUiweQnxTdEBjWH1WcXRQQGBYU0x/Xg==');

import React, { useState, useMemo } from 'react'
import { modals } from '@mantine/modals'
import CustomTable from '@/src/components/CustomTable'
import CreateTaskForm from './CreateTaskForm'
import EditTaskForm from './EditTaskForm'
import ViewTask from './ViewTask'
import { buildDeleteModal } from '@/src/utils/modals'
import { createTaskInMemory, type TaskInMemory } from './createTaskInMemory'

// 1) Kanban imports, using BOOTSTRAP5 theme instead of "material"
import '@syncfusion/ej2-base/styles/bootstrap5.css'
import '@syncfusion/ej2-buttons/styles/bootstrap5.css'
import '@syncfusion/ej2-popups/styles/bootstrap5.css'
import '@syncfusion/ej2-inputs/styles/bootstrap5.css'
import '@syncfusion/ej2-react-kanban/styles/bootstrap5.css'

import {
  KanbanComponent,
  ColumnsDirective,
  ColumnDirective,
  CardSettingsModel
} from '@syncfusion/ej2-react-kanban'

import { Button, Radio, Group } from '@mantine/core'

export default function TasksPage (): JSX.Element {
  const [tasks, setTasks] = useState<TaskInMemory[]>([])
  const [nextId, setNextId] = useState(1)

  // 2) "viewMode" toggles between "table" and "kanban"
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table')

  // 3) "sortBy" chooses whether Kanban columns are by "doctor" or "patient"
  const [sortBy, setSortBy] = useState<'doctor' | 'patient'>('doctor')

  // ----------------------------
  // "Add Task" Modal
  // ----------------------------
  function handleShowCreateModal ({
    session,
    computedColorScheme,
    onSuccess
  }: any): void {
    const modalId = 'create-task-modal'
    modals.open({
      modalId,
      title: 'Add Task',
      children: (
        <CreateTaskForm
          onFinish={(formData) => {
            const newTask = createTaskInMemory(
              nextId,
              formData.name,
              formData.doctor,
              formData.patient
            )
            setTasks(prev => [...prev, newTask])
            setNextId(prev => prev + 1)

            modals.close(modalId)
            void onSuccess()
          }}
        />
      )
    })
  }

  // ----------------------------
  // "Edit Task" Modal
  // ----------------------------
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

  // ----------------------------
  // "View Task" Modal
  // ----------------------------
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

  // ----------------------------
  // "Delete Task" Modal
  // ----------------------------
  const handleShowDeleteModal = buildDeleteModal<TaskInMemory>(
    'task',
    (task) => task.name
  )

  function handleDeleteModal ({
    item,
    session,
    computedColorScheme,
    onSuccess
  }: {
    item: TaskInMemory
    session: any
    computedColorScheme: any
    onSuccess: () => Promise<void>
  }): void {
    handleShowDeleteModal({
      item,
      session,
      computedColorScheme,
      onSuccess: async () => {
        setTasks(prev => prev.filter(t => t.id !== item.id))
        await onSuccess()
      }
    })
  }

  // -------------------------------------------------------------
  // KANBAN LOGIC
  // -------------------------------------------------------------
  const uniqueGroups = useMemo(() => {
    const setOfGroups = new Set<string>()
    tasks.forEach((t) => {
      const fieldValue = t[sortBy]
      if (fieldValue) {
        setOfGroups.add(fieldValue)
      }
    })
    return Array.from(setOfGroups)
  }, [tasks, sortBy])

  const kanbanColumns = useMemo(
    () =>
      uniqueGroups.map((groupValue) => ({
        headerText: groupValue,
        keyField: groupValue
      })),
    [uniqueGroups]
  )

  const cardSettings: CardSettingsModel = {
    headerField: 'name',
    contentField: 'doctor'
  }

  // -------------------------------------------------------------
  // RENDER
  // -------------------------------------------------------------
  return (
    <div>
      <h1>Tasks</h1>

      <div style={{ marginBottom: 16 }}>
        <Button
          onClick={() =>
            setViewMode(viewMode === 'table' ? 'kanban' : 'table')
          }
        >
          Switch to {viewMode === 'table' ? 'Kanban' : 'Table'}
        </Button>

        {/* Only display "Sort by" in Kanban mode */}
        {viewMode === 'kanban' && (
          <div style={{ marginTop: 16 }}>
            <Radio.Group
              value={sortBy}
              onChange={(value) => setSortBy(value as 'doctor' | 'patient')}
              label="Sort by"
            >
              <Group mt="xs">
                <Radio value="doctor" label="Doctor" />
                <Radio value="patient" label="Patient" />
              </Group>
            </Radio.Group>
          </div>
        )}
      </div>

      {viewMode === 'table'
        ? (
          <CustomTable<TaskInMemory>
            dataName="Task"
            storeColumnKey="task-columns"
            queryOptions={(session, page, pageSize) => ({
              queryKey: ['tasks', tasks, page, pageSize],
              queryFn: async () => ({
                items: tasks,
                count: tasks.length
              })
            })}
            showCreateModal={handleShowCreateModal}
            showEditModal={handleShowEditModal}
            showViewModal={handleShowViewModal}
            showDeleteModal={handleDeleteModal}
            columns={[
              { title: '#', accessor: 'id' },
              { title: 'Name', accessor: 'name' },
              { title: 'Doctor', accessor: 'doctor' },
              { title: 'Patient', accessor: 'patient' }
            ]}
          />
          )
        : (
          <KanbanComponent
            id="kanban"
            keyField={sortBy}
            dataSource={tasks}
            cardSettings={cardSettings}
            allowDragAndDrop={true}
            swimlaneSettings={{ allowSwimlane: false }}
            style={{ marginTop: 20 }}
          >
            <ColumnsDirective>
              {kanbanColumns.map((col) => (
                <ColumnDirective
                  key={col.keyField}
                  headerText={col.headerText}
                  keyField={col.keyField}
                />
              ))}
            </ColumnsDirective>
          </KanbanComponent>
          )}
    </div>
  )
}
