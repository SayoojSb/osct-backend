const Contribution = require('../models/Contribution')

exports.createNew = async( title, repoName, description, prLink, status, difficulty, userId) => {
    const newContribution = new Contribution({ title, repoName, description, prLink, status, difficulty, createdBy: userId})
    await newContribution.save()
    return { message : "Contribution created successfully", newContribution}
}