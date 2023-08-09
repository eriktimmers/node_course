const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB!', err));

const courseSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        minlength: 5,
        maxlengthe: 25
    },
    category: {
        type: String,
        required: true,
        enum: ['web', 'mobile', 'network'],
        lowercase: true,
        // uppercase: true,
        trim: true
    },
    author: String,
    tags: {
        type: Array,
        validate: {
            validator: async function(v) {
                return new Promise(
                    function(resolve, reject) {
                        setTimeout(() => {
                            resolve(v && v.length > 0);
                        }, 2000);
                    }
                );
            },
            message: 'A course should at least have one tag,'
        }
    },
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    price: {
        type: Number,
        required: function() { return this.isPublished },
        min: 10,
        max: 200,
        get: v => Math.round(v),
        set:  v => Math.round(v)
    }
});

const Course = mongoose.model('Course', courseSchema); // create Class

async function createCourse() {
    const course = new Course({
        name: 'Angular Course',
        category: 'Web',
        author: 'Mosh',
        tags: ['frontend'],
        isPublished: true,
        price: 15.8
    });

    try {
        const result = await course.save();
        console.log(result);
    }
    catch (ex) {
        for (field in ex.errors)
            console.log(ex.errors[field].message);
    }

}

async function getCourses() {
    const pageNumer = 2;
    const pageSize = 10;


    const courses = await Course
        // .find({ author: 'Mosh', isPublished: true })
        .find({ _id: '64d34f8048a6412bcd960e56' })
        // .skip((pageNumber - 1) * pageSize)
        // .limit(pageSize)
        .sort({ name: 1 });
        // .count()
        // .select({ name: 1, tags: 1 })
    console.log(courses[0].price);
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

// removeCourse('64c6502d16e90b9802fdff41');
getCourses();
//createCourse();