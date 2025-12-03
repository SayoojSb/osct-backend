const Contribution = require('../models/Contribution')

exports.createNew = async( title, repoName, description, prLink, status, difficulty, userId) => {
    const newContribution = new Contribution({ title, repoName, description, prLink, status, difficulty, createdBy: userId})
    await newContribution.save()
    return { message : "Contribution created successfully", newContribution}
}

exports.getAll = async(userId, page=1, limit=10, search, status, difficulty, sort="latest") => {
    const pageNumber = Number(page)
    const limitNumber = Number(limit)
    const query = {"createdBy": userId}
    if(status){
        query.status = status
    }
    if(difficulty){
        query.difficulty = difficulty
    }
    if (search){
        const searchCondition = {
            $or : [
                { title : { $regex : search, $options : "i" } },
                { repoName : { $regex : search, $options : "i" } }
            ]
        }
        query.$or = searchCondition.$or
    }

    const sortOption = {}
    if ( sort==="latest" ){
        sortOption.createdAt = -1
    }
    else if ( sort==="oldest" ){
        sortOption.createdAt = 1
    }
    else if ( sort==="title-asc" ){
        sortOption.title = 1
    }
    else if ( sort==="title-desc" ){
        sortOption.title = -1
    }
    else {
        sortOption.createdAt = -1
    }

    const skip = (pageNumber - 1) * limitNumber

    // db query (filtering)
    const contributions = await Contribution.find(query).sort(sortOption).skip(skip).limit(limitNumber);
    const totalItems = await Contribution.countDocuments(query);
    const totalPages = Math.ceil( totalItems/ limitNumber);

    return { contributions, totalItems, totalPages, currentPage : pageNumber}

}

exports.updateStatus = async( contributionId, userId, newStatus ) => {
    const filtered = await Contribution.findOne( { _id : contributionId })
    // is contribution found ?
    if (!filtered){
        return { error : "Contribution not found"}
    }
    // checking ownership.
    if ( filtered.createdBy.toString() != userId ){
        return { error : "Not authorized"}
    }
    // updating
    await Contribution.updateOne( { _id : filtered._id }, { $set : { status : newStatus }})
    const result = await Contribution.findOne( { _id : contributionId })
    return result
}

exports.updateContribution = async (contributionId, userId, updateData) => {
    const filtered = await Contribution.findOne( { _id : contributionId })
    // is contribution found ?
    if (!filtered){
        return { error : "Contribution not found"}
    }
    // checking ownership.
    if ( filtered.createdBy.toString() != userId ){
        return { error : "Not authorized"}
    }
    // updating
    await Contribution.updateOne( { _id : filtered._id }, { $set : updateData })
    const result = await Contribution.findOne( { _id : contributionId })
    return result
}

exports.deleteContribution = async (contributionId, userId) => {
    const filtered = await Contribution.findOne( { _id : contributionId })
    // is contribution found ?
    if (!filtered){
        return { error : "Contribution not found"}
    }
    // checking ownership.
    if ( filtered.createdBy.toString() != userId ){
        return { error : "Not authorized"}
    }
    // updating
    await Contribution.deleteOne( { _id : filtered._id } )
    return { message: "Contribution deleted successfully" }

}

exports.getSingle = async (contributionId, userId) => {
    const filtered = await Contribution.findOne( { _id : contributionId })
    // is contribution found ?
    if (!filtered){
        return { error : "Contribution not found"}
    }
    // checking ownership.
    if ( filtered.createdBy.toString() != userId ){
        return { error : "Not authorized"}
    }
    // updating
    return filtered
}
