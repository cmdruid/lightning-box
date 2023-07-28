import {
  DeleteOptions,
  Document,
  Filter,
  FindOneAndUpdateOptions,
  FindOptions,
  InsertOneOptions,
  UpdateFilter,
  WithId
} from 'mongodb'

import { getCollection, MongoModel } from '@/lib/db'

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
    filter     : Filter<Document>,
    template   : T,
    update    ?: UpdateFilter<Document>,
    options   ?: FindOneAndUpdateOptions
  ) : Promise<WithId<T>> {
    return this._update(
      filter, template, update, { ...options, upsert: true }
    )
  }

  async _update (
    filter  : Filter<Document>        = {},
    data    : Partial<T>              = {},
    update  : UpdateFilter<Document>  = {},
    options : FindOneAndUpdateOptions = {}
  ) : Promise<WithId<T>> {
    const controller = await getCollection(this.model)
    const res = await controller.findOneAndUpdate(
      filter, { ...update, $set: data }, options
    )
    if (res.ok && res.value !== null) {
      return res.value as unknown as WithId<T>
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
