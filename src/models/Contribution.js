const mongoose = require("mongoose")

const contributionSchema = new mongoose.Schema(
    {
        title : {type : String, required : true},
        repoName : {type : String, required : true},
        description : {type : String, required : true},
        prLink : {type : String, required : true},
        status : {type : String, required : true},
        difficulty : {type : String, required : true},
        createdBy : {type : mongoose.Schema.Types.ObjectId, ref : 'User', required : true},
    },
    {timestamps : true}
)

module.exports = mongoose.model('Contribution', contributionSchema)