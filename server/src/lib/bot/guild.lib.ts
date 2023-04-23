import DB_Guilds from "@server/mongodb/DB_Guilds";
import { BC }    from "@server/lib/System.Lib";

// update a guild or add a new one
export const UpdateGuild = async( [ guildId, guildName ] : [ string, string ] ) => {
	try {
		await DB_Guilds.create( { guildId, guildName } );
		SystemLib.LogWarning( "bot", `New Guild added to Database:${ BC( "Cyan" ) }`, guildName );
	}
	catch ( e ) {
		try {
			await DB_Guilds.findOneAndUpdate( { guildId }, { guildName } );
		}
		catch ( e ) {
		}
	}
};