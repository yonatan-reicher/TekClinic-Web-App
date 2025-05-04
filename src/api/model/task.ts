import {
  type TaskScheme,
  type TaskBaseScheme,
  type TaskUpdateScheme,
  type IdHolder
} from '@/src/api/scheme'
import {
  createAPIResource,
  deleteAPIResource,
  formatPaginationParams,
  getAPIResource,
  getAPIResourceList,
  putAPIResource,
  type PaginationParams,
  type PaginationResult
} from '@/src/api/common'
import { type Session } from 'next-auth'
import { assert } from '@/src/utils/error'

/** Task query parameters. */
interface TaskParams extends PaginationParams {
  search?: string
}

export class Task {
  static __name__ = 'tasks'

  readonly id: number
  /** 3. Created At (should not be selectable, the web-app only reads it. Chosen by the server) */
  readonly created_at: Date
  complete: boolean
  patient_id: number
  /** 4. Expertise - which kind of doctor does this patient need? eye/pregnancy/whatever... select one or leave empty */
  expertise: string | null
  title: string
  /** 7. Description (could be left empty) */
  description: string

  constructor (scheme: TaskScheme) {
    this.id = scheme.id
    this.created_at = new Date(scheme.created_at)
    this.complete = scheme.complete
    this.patient_id = scheme.patient_id
    this.expertise = scheme.expertise
    this.title = scheme.title
    this.description = scheme.description
    assert(this.id != null, 'Task id is required');
    assert(this.patient_id != null, 'Task patient_id is required');
    assert(this.created_at instanceof Date, 'Task created_at is not a Date');
  }

  static fromScheme (scheme: TaskScheme): Task {
    return new Task(scheme)
  }

  static getById = async (id: number, session: Session): Promise<Task> => {
    return await getAPIResource(Task, id, session)
  }

  static get = async (params: TaskParams, session: Session): Promise<PaginationResult<Task>> => {
    const formattedParams = formatPaginationParams(params)
    if (params.search != null && params.search !== '') {
      formattedParams.search = params.search
    }
    return await getAPIResourceList(Task, formattedParams, session)
  }

  static create = async (props: TaskBaseScheme, session: Session): Promise<number> => {
    return await createAPIResource<TaskBaseScheme>(Task, props, session)
  }

  update = async (session: Session): Promise<void> => {
    const data: TaskUpdateScheme = {
      patient_id: this.patient_id,
      expertise: this.expertise,
      title: this.title,
      description: this.description
    }
    await putAPIResource<IdHolder, TaskUpdateScheme>(Task, this.id, data, session)
  }

  deleteById = async (session: Session): Promise<void> => {
    await deleteAPIResource(Task, this.id, session)
  }

  delete = async (session: Session): Promise<void> => {
    await this.deleteById(session)
  }
}
