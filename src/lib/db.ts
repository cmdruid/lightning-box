/** src/db.js */

import { CollectionInfo, Db, MongoClient } from 'mongodb'

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
  indexes ?: Array<{
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

const devMode = process.env.NODE_ENV !== 'production'

const options  = {
  useNewUrlParser    : true,
  useUnifiedTopology : true,
  maxIdleTimeMS      : 1000 * 60  // 1 minute.
}

const { MONGODB_URI } = process.env

if (typeof MONGODB_URI  !== 'string') {
  throw new Error('MONGODB_URI not defined!')
}

// Configure our client connection.
const endpoint = `${MONGODB_URI}?retryWrites=true&w=majority`,
      client   = new MongoClient(endpoint, options)

// Cache our results for reuse.
let cacheDb     : Db | undefined,
    collections : CollectionInfo[] = []

export async function connect () {
  /** If no cached database exists,
   *  start new database connection.
   */
  if (
    cacheDb === undefined ||
    collections.length < 1
  ) {
    await client.connect()
    cacheDb = client.db()
    collections = await cacheDb
      .listCollections()
      .toArray()
  }
  return { cacheDb, collections }
}

export async function getCollection (model : MongoModel) {
  /** Returns a collection based upon the provided schema,
   *  either fetching an existing collection or creating
   *  a new one. Ensures the stored schema is up-to-date.
   */
  const { name, indexes, options } = model,
        { cacheDb: db, collections } = await connect()

  // If the requested collection is not listed, create it.
  const cache = collections.find((c : any) => c.name === name)

  if (cache === undefined) {
    const coll = await db.createCollection(name, options)
    if (indexes !== undefined) {
      await coll.createIndexes(indexes)
    }
    return coll
  }

  if (devMode) {
    if (
      cache.options !== undefined &&
      isDiff(cache.options, options)
    ) {
      // Update collection options if model has changed.
      // Note: Requies dbAdmin privileges.
      try {
        await db.command({ collMod: name, ...options })
      } catch (err) { console.error(err) }
    }
  }

  // Load collection from the database.
  const coll = db.collection(name)

  // Refresh collection indexes if model has changed.
  if (
    indexes !== undefined &&
    isDiff(cache.indexes, indexes)
  ) {
    await coll.dropIndexes()
    await coll.createIndexes(indexes)
  }

  return coll
}

function isDiff (a : object, b : object) {
  /** Helper function for quickly comparing objects. */
  return (JSON.stringify(a) !== JSON.stringify(b))
}

