import joi from "joi"

export const AddCommentSchema = joi.object({
    content: joi.string()
        .min(20).message('Comment must be at least 20 characters long')
        .max(1000).message('Comment cannot exceed 1000 characters')
        .required()
        .trim()
});
export const CommentParamsSchema = joi.object({
    id: joi.string().min(24)
})