import {
  DeleteOptions,
  Document,
  Filter,
  FindOneAndUpdateOptions,
  FindOptions,
  InsertOneOptions,
  ModifyResult,
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

  get_template (template ?: Partial<T>) : T {
    return { ...this.defaults, ...template }
  }

  async _list (
    filter   : Filter<Document> = {},
    options ?: FindOptions<Document>
  ) : Promise<T[]> {
    const controller = await getCollection(this.model)
    return controller.find<T>(filter, options).toArray()
  }

  async _get (
    filter   : Filter<Document>,
    options ?: FindOptions<Document>
  ) : Promise<T | null> {
    const controller = await getCollection(this.model)
    return controller.findOne<T>(filter, options)
  }

  async _create (
    template ?: Partial<T>,
    options  ?: InsertOneOptions
  ) : Promise<T> {
    const data = this.get_template(template)
    const controller = await getCollection(this.model)
    const res = await controller.insertOne(data, options)
    if (res.acknowledged) {
      return { ...data, _id : res.insertedId }
    }
    throw new Error('Create operation failed!')
  }

  async _set (
    template   : T,
    filter     : Filter<Document>,
    update    ?: UpdateFilter<T>,
    options   ?: UpdateOptions
  ) : Promise<T> {
    const data = this.get_template(template)
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

  async _update (
    data    : Partial<T> = {},
    filter  : Filter<Document> = {},
    options : FindOneAndUpdateOptions = {}
  ) : Promise<T> {
    const controller = await getCollection(this.model)
    const res = await controller.findOneAndUpdate(filter, { $set: data }, options)
    console.log('data:', data)
    console.log('update:', res)

    if (res.ok) {
      return res.value as unknown as T
    }
    throw new Error('Update document failed!')
  }

  async _remove (
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

  async _clear (
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
