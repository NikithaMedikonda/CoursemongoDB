import mongoose, {Schema,model} from "mongoose";

enum courseLevel {
    sscLevel = "ssc",
    intermediateLevel = "intermediate",
    diplomaLevel = "diploma",
    engineeringLevel = "engineering",
    degreeLevel = "degree",
    medicalLevel = "medical"
}

const courseNames = {
    [courseLevel.sscLevel]: ["Maths", "Science"],
    [courseLevel.intermediateLevel]: ["MPC", "BiPC"],
    [courseLevel.diplomaLevel]: ["ECE","EEE","CSE"],
    [courseLevel.engineeringLevel]: ["ECE","EEE","CSE"],
    [courseLevel.degreeLevel]: ["BSc", "BCom"],
    [courseLevel.medicalLevel]: ["BPharm", "DPharm", "MBBS", "BDS"]
}

export const courseSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: true,
        validate: {  
            validator: function(v: string) {
                const course = (this as any).level as courseLevel;
                return courseNames[course] ? courseNames[course].includes(v) : false;
            },
            message: "Not valid"
        }
    },
    level: {
        type: String,
        required: true,
        enum: Object.values(courseLevel)
    },
    prerequisites: [{
        type : Schema.Types.ObjectId,
        ref : "Course"
    }]
});

export const Course = mongoose.model('Course', courseSchema);

