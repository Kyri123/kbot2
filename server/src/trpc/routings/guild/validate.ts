import type { tRPC } from "@server/trpc/server";
import { z }         from "zod";
import { IMO_Guild } from "@shared/types/MongoDB";
import DB_Guilds     from "@server/mongodb/DB_Guilds";

export const guild_validate = ( tRPC : tRPC ) => {
	return tRPC.procedure
		.input( z.object( {
			guildId: z.string()
		} ) ).query<{
			tokenValid : boolean;
			guildData? : IMO_Guild;
		}>( async( { input, ctx } ) => {
			try {
				if ( input.guildId && ctx.userClass?.IsValid ) {
					const guildDocument = await DB_Guilds.findOne( {
						guildId: input.guildId,
						accountIds: { $in: ctx.userClass.Get.discordId }
					} );
					if ( guildDocument ) {
						return {
							tokenValid: true,
							guildData: guildDocument.toJSON()
						};
					}
				}
			}
			catch ( e ) {
			}
			return { tokenValid: false };
		} );
};