import { redis } from '@/lib/redis'
import { Elysia } from 'elysia'
import { nanoid } from 'nanoid'

const ROOM_TTL_SECONDS = 60 * 10 // 10min

const rooms = new Elysia({ prefix: '/room' })
.post("/create", async () => {
    // console.log("CREATE A NEW ROOM!")
    // const roomId = nanoid()

    // // calling redis to create a new room entry in our database
    // await redis.hset(`meta:${roomId}`, {
    //     connected: [],
    //     createdAt: Date.now(),
    // })

    // // Self Destruct a room (redis supports self expiry)
    // await redis.expire(`meta:${roomId}`, ROOM_TTL_SECONDS)

    // return {roomId}
    try {
        const roomId = nanoid()

        await redis.hset(`meta:${roomId}`, {
            connected: JSON.stringify([]), // applied the fix here
            createdAt: Date.now(),
        })

        await redis.expire(`meta:${roomId}`, ROOM_TTL_SECONDS)

        return { roomId }
    } catch (error) {
        // This will print the REAL error to your VS Code terminal
        console.error("FAILED TO CREATE ROOM:", error) 
        throw error
    }
})

const app = new Elysia({ prefix: '/api' }) 
.use(rooms)

export const GET = app.fetch
export const POST = app.fetch

export type App = typeof app