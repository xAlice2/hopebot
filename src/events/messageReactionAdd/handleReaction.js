const tools = require('../../utils/tools')
const getLocalCommands = require('../../utils/getLocalCommands');
const { AttachmentBuilder } = require('discord.js')
//TEMPORARY
//Just for fetching message reactions

module.exports = async (client, ...msgreaction) => {
    let reaction = msgreaction[0]
    let user = msgreaction[1]

    if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			return console.error('Something went wrong when fetching the message:', error);	
		}
	}

    try{
        if (!tools.isLeader(user.id)) return;

        
        if(reaction.emoji.name == '📝'){
            await reaction.remove()
            var firstreaction = reaction.message.reactions.cache.values().next().value
            var users = await firstreaction.users.fetch()

            var format1 = ''
            users.forEach(user => {
                format1 += user.username.replaceAll("_", "\\" + "_") + '\n\n'
            })
            
            let msgs = []
            if(format1.length <= 2000){
                return await user.send(format1)
            }
            while(format1.length >= 2000){
                let splitIdx = format1.slice(0,2000).lastIndexOf('\n')
                msgs.push(format1.slice(0,splitIdx))
                format1 = format1.slice(splitIdx)
            }
            msgs.push(format1)

            msgs.forEach(async msg => {
                await user.send(msg)
            })
            return

            //return await user.send({ files: [new AttachmentBuilder(Buffer.from(format1)).setName("originalFormat.txt"), new AttachmentBuilder(Buffer.from(format2)).setName("newFormat.txt")] })
        }
    }catch(error){
        console.log("reactionerr: "+error)
    }
};
