import { connect } from "./connect";
import * as fs from 'fs';
import csv from 'csv-parser';
import {Course} from "./schema"
import {router} from './router'
import express from "express"

const app = express();
app.use(express.json());
app.use('/',router);

connect();

const readCSVFile = async (filepath: string): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        const results: any[] = [];
        const stream = fs.createReadStream(filepath)
        stream.pipe(csv())
            .on('data', (data: any) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error: string) => reject(error))
    })
}

const coursePath = "/Users/admin/Documents/Courses/course.csv";

const insertRecord = async (data: any) => {
    try {
        const { name, level, prelevel, prename } = data;
        let course = await Course.findOne({ name, level });
        if (!course) {
            course = await Course.create({ name, level });
            console.log(`Inserted course: ${name} (${level})`);
        }

        if (prelevel && prename) {
            let preCourse = await Course.findOne({ name: prename, level: prelevel });
            if (!preCourse) {
                preCourse = await Course.create({ name: prename, level: prelevel });
                console.log(`Created prerequisite course: ${prename} (${prelevel})`);
            } else if (preCourse) {
                course.prerequisites.push(preCourse._id);
                await course.save();
                console.log(`Inserted course: ${name} (${level}) with prerequisite: ${prename} (${prelevel})`);
            } else {
                console.error(`Failed to find or create prerequisite course: ${prename} (${prelevel})`);
            }
        } else {
            console.log(`Inserted course without prerequisites: ${name} (${level})`);
        }
    } catch (error) {
        console.error("Error inserting course:", error);
    }
}

const insert = async () => {
    try {
        const courseData: any[] = await readCSVFile(coursePath);      
        for (const data of courseData) {
            await insertRecord(data);
        }
        console.log("All courses and prerequisites inserted successfully");
    } catch (error) {
        console.error("Error inserting courses and prerequisites:", error);
    } 
};

// insert();

app.listen(3000,() => {
    console.log(`Server is running on http://localhost:`);
});


