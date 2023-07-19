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

createCourse();
