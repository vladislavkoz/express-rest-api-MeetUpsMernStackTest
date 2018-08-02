const mongoose = require('mongoose')
const GuestSchema = new mongoose.Schema({
  firstName: {type: String },
  lastName: {type: String },
  createdAt: {type: Date, default: Date.now },
    password: {type:String, required: true},
    email: {type: String, required: true},
    skills:[
      {
        name:{type: String}
      }
    ]
});

GuestSchema.statics.addNewSkillById = function(id,skill) {
 return  this.findOneAndUpdate(
    {_id: id},
    {$push: {skills:{name:skill}}}
    ,{new:true});
}

GuestSchema.statics.removeSkillById = function(id,skillId) {
  return  Guest.findByIdAndUpdate(id,
    {$pull: {'skills':{_id:skillId}}},
    {new:true});
 }

 GuestSchema.statics.updateSkillById = function(id,skillId,newSkillName) {
  return  Guest.findOneAndUpdate(
    {_id:id,
        'skills._id':skillId},
        { $set: {'skills.$.name':newSkillName}},
        {new:true});
 }


const Guest = mongoose.model('Guest', GuestSchema, 'guests');

module.exports = Guest;