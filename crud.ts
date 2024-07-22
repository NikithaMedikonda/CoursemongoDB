import express, { Request, Response } from 'express';
import { Course } from './schema';

export const courseRouter = express.Router();

courseRouter.get('/all', async (req: Request, res: Response) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) {
        res.send("error")
        console.log("Error:",err);
    }
});

courseRouter.get('/:id', async(req: Request, res: Response) => {
    try {
        const course = await Course.findById(req.params.id);
        res.send(course)
    } 
    catch (err) {
        res.send("error")
        console.log("Error:",err);
    }
    
});

courseRouter.post('/', async (req: Request, res: Response) => {
    const course = new Course({
        name: req.body.name,
        level: req.body.level,
        prerequisites: req.body.prerequisites 
    });
    try {
        const newCourse = await course.save();
        res.json(newCourse);
    } catch (err) {
        res.send("error")
        console.log("Error:",err);
    }
});


courseRouter.put('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (req.body.name != null) {
            (course as any).name = req.body.name;
        }
        if (req.body.level != null) {
            (course as any).level = req.body.level;
        }
        if (req.body.prerequisites != null) {
            (course as any).prerequisites = req.body.prerequisites; 
        }
        const updatedCourse = await (course as any).save();
        res.json(updatedCourse);
    } catch (err) {
        res.send("error")
        console.log("Error:",err);
    }
});

courseRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        const course = await Course.findById(req.params.id);
        await (course as any).deleteOne();
        res.json({ message: 'Deleted course' });
    } catch (err) {
        res.send("error")
        console.log("Error:",err);
    }
});


