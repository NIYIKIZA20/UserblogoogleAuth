import { describe, it, expect, jest } from "@jest/globals"
import { User } from "../src/database/models/User"
import { prefix, userResponse } from "./setup"
import supertest from "supertest"
import { app } from "../src/server"
const request = supertest(app)

describe('create A user', () => {
    describe('Starting from 400', () => {
        it('having an unexpected column', async () => {
            const res = await request.post(`${prefix}users`)
                .send({
                    email: 'jbniyikiza20@gmail.com',
                    name: 'jb',
                    password: 'Password12345',
                    gender: 'male',
                    role: 'user' // This should fail as role is not allowed in creation
                })
            expect(res.status).toBe(400)
            expect(res.body.message).toContain('role')
            expect(res.body.success).toBe(false)
        })
        it('create user successfully', async () => {
            const res = await request.post(`${prefix}users`)
                .send({
                    email: 'jbniyikiza20@gmail.com',
                    name: 'jb',
                    password: 'Password12345',
                    gender: 'male',
                })
            expect(res.status).toBe(201)
            expect(res.body.success).toBe(true)
            expect(res.body.message).toBe('User added successfully')
            expect(res.body.data).toHaveProperty('id')
        })
        it('user already exists', async () => {
            const res = await request.post(`${prefix}users`)
                .send({
                    email: 'jbniyikiza20@gmail.com',
                    name: 'jb',
                    password: 'Password12345',
                    gender: 'male',
                })
            expect(res.status).toBe(409)
            expect(res.body.message).toBe('User already exists')
            expect(res.body.success).toBe(false)
        })
    })
})
describe('Get All Users', () => {
    it("list of users", async () => {

        const users = await request.get(`${prefix}users`)
            .set('Authorization', `Bearer ${userResponse.token}`)

        expect(users.status).toBe(200)
    })

    it('Getting All users Failed', async () => {
        jest.spyOn(User, 'findOne').mockRejectedValue(new Error())
        const users = await request.get(`${prefix}users`)
            .set('Authorization', `Bearer ${userResponse.token}`)
        expect(users.status).toBe(500)
    })
    it('getting 500 error', async () => {
        jest.spyOn(User, 'findOne').mockRejectedValue(new Error())
        const res = await request.post(`${prefix}login`).send({
            email: 'admin@admin.com',
            password: 'password'
        })
        expect(res.status).toBe(500)
    })

    // it('getting 500 error', async () => {
    //     jest.spyOn(User, 'create').mockRejectedValue(new Error())
    //     const res = await request.post(`${prefix}users`)
    //         .send({
    //             email: 'userexample@gmail.com',
    //             name: 'fab',
    //             password: 'password',
    //             gender: 'male',
    //         })
    //     expect(res.status).toBe(500)
    // })

})