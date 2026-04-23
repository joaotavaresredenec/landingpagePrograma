import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: 3,
  lazyConnect: true,
})

export const kv = {
  async set(key: string, value: unknown, options?: { ex: number }): Promise<void> {
    const serialized = JSON.stringify(value)
    if (options?.ex) {
      await redis.set(key, serialized, 'EX', options.ex)
    } else {
      await redis.set(key, serialized)
    }
  },

  async get<T>(key: string): Promise<T | null> {
    const raw = await redis.get(key)
    if (!raw) return null
    return JSON.parse(raw) as T
  },

  async incr(key: string): Promise<number> {
    return redis.incr(key)
  },

  async expire(key: string, seconds: number): Promise<void> {
    await redis.expire(key, seconds)
  },

  async del(key: string): Promise<void> {
    await redis.del(key)
  },
}
