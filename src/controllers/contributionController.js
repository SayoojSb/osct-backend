const contributionService = require('../services/contributionService')

const createContribution = async(req,res) => {
    try{
        const { title, repoName, description, prLink, status, difficulty} = req.body;
        const userId = req.user.id;

        if (!title || !repoName || !description || !prLink || !status || !difficulty){
            return res.status(400).json({ message: "All fields required"})
        }

        const result = await contributionService.createNew( title, repoName, description, prLink, status, difficulty, userId)

        if (result.error){
            return res.status(400).json({ message : result.error})
        }

        res.status(201).json({ message : result.message, contribution : result.newContribution})
    }
    catch(err){
        console.log(err)
        res.status(500).json({ message: "Server error"})
    }
}