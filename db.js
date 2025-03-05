const mongoose = require('mongoose');


const mongoURI = 'mongodb://localhost:27017/prj'; // Local MongoDB


mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB successfully!');
})
.catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

module.exports = mongoose;