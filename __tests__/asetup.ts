import supertest, { Request, Response } from 'supertest'
import { it, describe, expect, jest, beforeAll, afterAll, afterEach } from '@jest/globals'
import { app } from '../src/server'
import { Sequelize } from 'sequelize'
import databaseConfig from '../src/config/config'

const request = supertest(app)
export const userResponse = {
    token: ''
}
export const prefix = '/api/'
let sequelize: any

beforeAll(async () => {
    try {
        const db_config = databaseConfig() as any
        sequelize = new Sequelize({
            ...db_config,
            dialect: 'postgres',
        })
        await sequelize.authenticate()
        console.log("Test Database Connected")
    } catch (error) {
        console.error('Database connection failed:', error)
        throw error
    }

}, 10000)
afterEach(() => {
    jest.clearAllMocks()
})
afterAll(async () => {
    jest.clearAllMocks()
    if (sequelize) {
        await sequelize.close()
    }
})
describe('Login with admin token', () => {     
    it('Login Successfully', async () => {
        const res = await request.post(`${prefix}login`).send({
            email: 'john.doe@example.com',
            password: 'password'
        })
        userResponse.token = res.body.data
        //expect(res.body.message).toEqual('User Logins successfully')
        expect(res.body.success).toBe(true)
    })
    
    it('User Does not exist', async () => {
        const res = await request.post(`${prefix}login`).send({
            email: 'admin2@admin.com',
            password: 'Password'
        })
        //expect(res.body.message).toEqual("User not found")
        expect(res.status).toBe(404)
    })
    
    it('Invalid Password', async () => {
        const res = await request.post(`${prefix}login`).send({
            email: 'john.doe@example.com',
            password: 'Passworrd'
        })
        //expect(res.body.message).toEqual("Invalid email or password")
        expect(res.status).toBe(401)
    })
})


