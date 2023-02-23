
const mongoose=require('mongoose');
const cities=require('./cities');
const {places,descriptors}=require('./seedhelper');
const Intern = require('../models/Intern');

mongoose.connect('mongodb://localhost:27017/InternShip', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];
const d=Date.now();

const seedDB = async () => {
    await Intern.deleteMany({});
    for (let i = 0; i < 10; i++) {
        const random10 = Math.floor(Math.random() * 10);
        const vac = Math.floor(Math.random() * 5) + 10;
        const inter = new Intern({
            location: `${cities[random10].city}, ${cities[random10].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            link:'https://www.wipro.com/',
            modified: d,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random10].longitude,
                    cities[random10].latitude,
                ]
            },
            lastDate: d,
            author: '6252a0cab8ad662fe08d7279',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            vac: 50
        })
        await inter.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})