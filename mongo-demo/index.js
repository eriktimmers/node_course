const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB!', err));

const courseSchema = new mongoose.Schema({
    name: String,
    author: String,
    tags: [ String ],
    date: { type: Date, default: Date.now },
    isPublished: Boolean
});

const Course = mongoose.model('Course', courseSchema); // create Class

async function createCourse() {
    const course = new Course({
        name: 'Angular Course',
        author: 'Mosh',
        tags: ['node', 'frontend'],
        isPublished: true
    });

    const result = await course.save();
    console.log(result);
}

async function getCourses() {
    const pageNumer = 2;
    const pageSize = 10;


    const courses = await Course
        .find({ author: 'Mosh', isPublished: true })
        .skip((pageNumber - 1) * pageSize)
        .limit(10)
        .sort({ name: 1 })
        .count();
        // .select({ name: 1, tags: 1 })
    console.log(courses);
}


async function updateCourse(id) {
    const course = await Course.findById(id)
    if (!course) return;

    course.isPublished = true;
    course.author = 'Another Author';

    // course.set({
    //     isPublished: true,
    //     author: 'Yet Another Author'
    // });

    const result = await course.save();
    console.log(result);
}

async function updateCourse2(id) {
    const result = await Course.updateOne({ _id: id }, {
        $set:  {
            author: 'Mosh',
            isPublished: false
        }
    });
    console.log(result);
}

async function updateCourse3(id) {
    const course = await Course.findByIdAndUpdate(id, {
        $set:  {
            author: 'Freddy',
            isPublished: true
        }
    }, { new: true });
    console.log(course);
}

async function removeCourse(id) {
    const result = await Course.deleteOne({ _id: id });
    // const result = await Course.findByIdAndDelete(id);
    console.log(result);
}

removeCourse('64b7d5fc1a63424739680dd8');