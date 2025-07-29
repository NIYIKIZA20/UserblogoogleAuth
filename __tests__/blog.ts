import { describe, it, expect, jest } from "@jest/globals"
import { Blog } from "../src/database/models/Blog"
import { prefix, userResponse } from "./setup"
import supertest from "supertest"
import { app } from "../src/server"
const request = supertest(app)

// describe('Blog Operations', () => {
    describe('Get All Blogs', () => {
        it('should get all blogs successfully', async () => {
            const res = await request.get(`${prefix}blogs`)
                .set('Authorization', `Bearer ${userResponse.token}`)
            expect(res.status).toBe(200)
            expect(res.body.success).toBe(true)
            expect(res.body.message).toBe('Blogs retrieved successfully')
        })

// it('should handle database error when getting blogs', async () => {
        //     jest.spyOn(Blog, 'findAll').mockRejectedValue(new Error())
        //     const res = await request.get(`${prefix}blogs`)
        //         .set('Authorization', `Bearer ${userResponse.token}`)
        //     expect(res.status).toBe(500)
        // })
    describe('Create Blog', () => {
        it('should create blog successfully', async () => {
            const res = await request.post(`${prefix}blogs`)
                .set('Authorization', `Bearer ${userResponse.token}`)
                .field('title', 'Test Blog')
                .field('description', 'This is a test blog description that is longer than 20 characters')
                .field('content', 'Test content')
                .field('isPublished', 'true')
            
            expect(res.status).toBe(201)
            expect(res.body.success).toBe(true)
            expect(res.body.message).toBe('Blog created successfully')
        })

        it('should fail with invalid blog data', async () => {
            const res = await request.post(`${prefix}blogs`)
                .set('Authorization', `Bearer ${userResponse.token}`)
                .field('title', 'Test')
                .field('description', 'Short')
                .field('isPublished', 'true')
            
            expect(res.status).toBe(400)
        })

        it('should handle database error when creating blog', async () => {
            jest.spyOn(Blog, 'create').mockRejectedValue(new Error())
            const res = await request.post(`${prefix}blogs`)
                .set('Authorization', `Bearer ${userResponse.token}`)
                .field('title', 'Test Blog')
                .field('description', 'This is a test blog description that is longer than 20 characters')
                .field('content', 'Test content')
                .field('isPublished', 'true')
            
            expect(res.status).toBe(500)
        })
    })
    describe('Get Single Blog', () => {

        it('should get blog by id successfully', async () => {
            const blog = await Blog.create({
                title: 'Test Blog',
                description: 'This is a test blog description that is longer than 20 characters',
                content: 'Test content',
                isPublished: true,
                author: 'test-author-id',
                slug: 'test-blog',
                blog_image_url: 'test-url'
            })

            const res = await request.get(`${prefix}blogs/${blog.id}`)
            expect(res.status).toBe(200)
expect(res.body.success).toBe(true)
            expect(res.body.message).toBe('Blog retrieved successfully')
        })

        it('should return 404 for non-existent blog', async () => {
            const res = await request.get(`${prefix}blogs/non-existent-id`)
            expect(res.status).toBe(404)
expect(res.body.message).toBe('Blog not found')
        })

    })
    describe('Update Blog', () => {

        it('should update blog successfully', async () => {
            const blog = await Blog.create({
                title: 'Test Blog',
                description: 'This is a test blog description that is longer than 20 characters',
                content: 'Test content',
                isPublished: true,
                author: 'test-author-id',
                slug: 'test-blog',
                blog_image_url: 'test-url'
            })

            const res = await request.put(`${prefix}blogs/${blog.id}`)
                .set('Authorization', `Bearer ${userResponse.token}`)
                .send({
                    title: 'Updated Blog Title',
                    content: 'Updated content'
                })
            expect(res.status).toBe(200)
expect(res.body.success).toBe(true)
            expect(res.body.message).toBe('Blog updated successfully')
        })
        
it('should handle database error when updating blog', async () => {
            jest.spyOn(Blog, 'update').mockRejectedValue(new Error())
            const res = await request.put(`${prefix}blogs/some-id`)
                .set('Authorization', `Bearer ${userResponse.token}`)
                .send({
                    title: 'Updated Title'
                })
            expect(res.status).toBe(500)
        })
    it('should handle database error when updating blog', async () => {
           jest.spyOn(Blog, 'update').mockRejectedValue(new Error())
            const res = await request.put(`${prefix}blogs/some-id`)
               .set('Authorization', `Bearer ${userResponse.token}`)
               .send({
                   title: 'Updated Title'
               })
        expect(res.status).toBe(500)
   })
    })

    describe('Delete Blog', () => {
        it('should delete blog successfully', async () => {
            const blog = await Blog.create({
                title: 'Test Blog',
                description: 'This is a test blog description that is longer than 20 characters',
                content: 'Test content',
                isPublished: true,
                author: 'test-author-id',
                slug: 'test-blog',
                blog_image_url: 'test-url'
            })

            const res = await request.delete(`${prefix}blogs/${blog.id}`)
                .set('Authorization', `Bearer ${userResponse.token}`)
            expect(res.status).toBe(200)
           // expect(res.body.success).toBe(true)
           // expect(res.body.message).toBe('Blog deleted successfully')
        })
    })
})