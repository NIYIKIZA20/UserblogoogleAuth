// import { describe, it, expect } from "@jest/globals";
// import { prefix, userResponse } from "./asetup";
// import supertest from "supertest";
// import { app } from "../src/server";
// const request = supertest(app);
// describe('Subscription Operations', () => {
//     describe('Create Subscription', () => {
//         it('should create subscription successfully', async () => {
//             const res = await request.post(`${prefix}subscriptions`)
//                 .send({
//                     email: 'newsubscriber@example.com'
//                 });
            
//             expect(res.status).toBe(201);
//             expect(res.body.success).toBe(true);
//             expect(res.body.data).toHaveProperty('id');
//             expect(res.body.data.email).toBe('newsubscriber@example.com');
//             expect(res.body.data.isActive).toBe(true);
//         });
//         it('should fail with invalid email', async () => {
//             const res = await request.post(`${prefix}subscriptions`)
//                 .send({
//                     email: 'invalid-email'
//                 });
            
//             expect(res.status).toBe(400);
//             expect(res.body.success).toBe(false);
//         });
//         it('should fail with duplicate email', async () => {
//             const res = await request.post(`${prefix}subscriptions`)
//                 .send({
//                     email: 'subscriber1@example.com'
//                 });
            
//             expect(res.status).toBe(409);
//             expect(res.body.success).toBe(false);
//         });
//     });
//     describe('Get Subscriptions', () => {
//         it('should get all subscriptions (admin only)', async () => {
//             const res = await request.get(`${prefix}subscriptions`)
//                 .set('Authorization', `Bearer ${userResponse.token}`);
            
//             expect(res.status).toBe(200);
//             expect(res.body.success).toBe(true);
//             expect(Array.isArray(res.body.data)).toBe(true);
//         });
//         it('should fail without admin access', async () => {
//             // First create a non-admin user and get their token
//             const userRes = await request.post(`${prefix}login`)
//                 .send({
//                     email: 'jane.smith@example.com',
//                     password: 'password'
//                 });
            
//             const res = await request.get(`${prefix}subscriptions`)
//                 .set('Authorization', `Bearer ${userRes.body.data}`);
            
//             expect(res.status).toBe(403);
//             expect(res.body.success).toBe(false);
//         });
//     });
//     describe('Update Subscription', () => {
//         it('should update subscription status (admin only)', async () => {
//             const res = await request.put(`${prefix}subscriptions/unsubscribe`)
//                 .send({
//                     email: 'subscriber1@example.com'
//                 });
            
//             expect(res.status).toBe(200);
//             expect(res.body.success).toBe(true);
//             expect(res.body.data.isActive).toBe(false);
//         });
//     });
// });