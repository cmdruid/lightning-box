import {
  DeleteOptions,
  Document,
  Filter,
  FindOptions,
  InsertOneOptions,
  UpdateFilter,
  UpdateOptions
} from 'mongodb'

import { getCollection } from '@/lib/db'

export interface MongoSchema {
  bsonType     : string | string[]
  required     : string[]
  description ?: string
  enum        ?: string[]
  items       ?: MongoSchema
  properites  ?: Record<string, MongoSchema>
  minLength   ?: number
  maxLength   ?: number
  minItems    ?: number
  maxItems    ?: number 
}

export interface MongoModel {
  name: string
  indexes: Array<{
    name   : string
    key    : { [ k : string ]: number }
    unique : boolean
  }>
  options: {
    validator        : { $jsonSchema : MongoSchema }
    validationLevel  : string
    validationAction : string
  }
}

export class Controller<T extends Document> {
  readonly _defaults : T
  readonly _model    : MongoModel

  constructor (
    model    : MongoModel,
    defaults : T
  ) {
    this._model    = model
    this._defaults = defaults
  }

  get defaults () : T {
    return this._defaults
  }

  get model () : any {
    return this._model
  }

  format (template ?: Partial<T>) : T {
    return { ...this.defaults, ...template }
  }

  async list (
    filter   : Filter<Document> = {},
    options ?: FindOptions<Document>
  ) : Promise<T[]> {
    const controller = await getCollection(this.model)
    return controller.find<T>(filter, options).toArray()
  }

  async get (
    filter   : Filter<Document>,
    options ?: FindOptions<Document>
  ) : Promise<T | null> {
    const controller = await getCollection(this.model)
    return controller.findOne<T>(filter, options)
  }

  async create (
    template ?: Partial<T>,
    options  ?: InsertOneOptions
  ) : Promise<T> {
    const data = this.format(template)
    const controller = await getCollection(this.model)
    const res = await controller.insertOne(data, options)
    if (res.acknowledged) {
      return { ...data, _id : res.insertedId }
    }
    throw new Error('Create operation failed!')
  }

  async set (
    template   : T,
    filter     : Filter<Document>,
    update    ?: UpdateFilter<T>,
    options   ?: UpdateOptions
  ) : Promise<T> {
    const data = this.format(template)
    const controller = await getCollection(this.model)
    const res = await controller.updateOne (
      filter,
      { ...update, $set: data },
      { ...options, upsert: true }
    )
    if (res.acknowledged) {
      if (res.modifiedCount === 1) {
        return data
      } else if (res.upsertedCount === 1) {
        return { ...data, _id : res.upsertedId }
      }
    }
    throw new Error('Set operation failed!')
  }

  async update (
    template   : Partial<T> = {},
    filter     : Filter<Document>,
    update    ?: UpdateFilter<T>,
    options   ?: UpdateOptions
  ) : Promise<T> {
    const data = this.format(template)
    const controller = await getCollection(this.model)
    const res = await controller.updateOne(
      filter, 
      { ...update, $set: data },
      options
    )
    if (res.acknowledged && res.modifiedCount === 1) {
      return data
    }
    throw new Error('Update operation failed!')
  }

  async remove (
    filter     : Filter<Document>,
    options   ?: DeleteOptions
  ) : Promise<void> {
    const controller = await getCollection(this.model)
    const res = await controller.deleteOne(filter, options)
    if (res.acknowledged && res.deletedCount === 1) {
      return
    }
    throw new Error('Delete operation failed!')
  }

  async clear (
    filter     : Filter<Document> = {},
    options   ?: DeleteOptions
  ) : Promise<number> {
    const controller = await getCollection(this.model)
    const res = await controller.deleteMany(filter, options)
    if (res.acknowledged) {
      return res.deletedCount
    }
    throw new Error('Clear operation failed!')
  }
}
