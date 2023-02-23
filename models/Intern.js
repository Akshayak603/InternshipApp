const mongoose=require('mongoose');
const Review = require('./review');

const Schema=mongoose.Schema;

const opts={toJSON :{virtuals: true}};

const InternSchema=new Schema({
    modified: Date ,
    title: String,
    image: String,
    vac: Number,//number of vaccancy
    description: String,
    link: String,
    lastDate: Date,
    location: String,//where is the Intern
    geometry: {
      type: {
          type: String,
          enum: ['Point'],
          required: true
      },
      coordinates: {
          type: [Number],
          required: true
      }
  },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
  },
    reviews: [
      {
          type: Schema.Types.ObjectId,
          ref: 'Review'
      }
  ]
},opts);

InternSchema.virtual('properties.popUpMarkup').get(function () {
  return `
  <strong><a href="/interns/${this._id}">${this.title}</a><strong>
  <p>${this.description.substring(0, 20)}...</p>`
});

  InternSchema.pre('save', function(next) {
    this.modified = Date.now();
    next();
  });

  InternSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})
module.exports=mongoose.model('Intern',InternSchema);