import express from 'express'
import {courseRouter} from './crud'
export const router = express.Router()

router.use('/courses',courseRouter);


