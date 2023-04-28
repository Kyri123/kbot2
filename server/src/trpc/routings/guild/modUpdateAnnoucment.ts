import { handleTRCPErr } from "@server/lib/Express.Lib";
import { TRPCError }     from "@trpc/server";
import z                 from "zod";
import {
	guildProcedure,
	router
}                        from "@server/trpc/trpc";
import DB_ModUpdates     from "@server/mongodb/DB_ModUpdates";
import DB_Guilds         from "@server/mongodb/DB_Guilds";
import {
	MO_Mod,
	MO_ModUpdate
}                        from "@shared/types/MongoDB";
import DB_Mods           from "@server/mongodb/DB_Mods";

export const guild_modUpdateAnnoucment =
	router( {
		watchedmods: guildProcedure.query<{
			mods : MO_ModUpdate[]
		}>( async( { ctx } ) => {
			const mods = await DB_ModUpdates.find<MO_ModUpdate>( { guildId: ctx.guildId || "0" } );
			return { mods };
		} ),

		mods: guildProcedure.query<{
			mods : MO_Mod[]
		}>( async() => {
			const mods = await DB_Mods.find<MO_Mod>( {} );
			return { mods };
		} ),

		updateconfig: guildProcedure.input( z.object( {
			data: z.object( {
				modsUpdateAnnouncement: z.boolean(),
				modsAnnounceHiddenMods: z.boolean(),
				suggestionChannelId: z.string().refine( e => ( !isNaN( parseFloat( e ) ) || e === "" ), "Invalid channel input" ),
				bugChannelId: z.string().refine( e => ( !isNaN( parseFloat( e ) ) || e === "" ), "Invalid channel input" ),
				changelogForumId: z.string().refine( e => ( !isNaN( parseFloat( e ) ) || e === "" ), "Invalid channel input" ),
				updateTextChannelId: z.string().refine( e => ( !isNaN( parseFloat( e ) ) || e === "" ), "Invalid channel input" ),
				RolePingRules: z.array( z.object( {
					roleId: z.string().refine( e => ( !isNaN( parseFloat( e ) ) || e === "" ), "Invalid role input" ),
					modRefs: z.array( z.string() )
				} ) ),
				blacklistedMods: z.array( z.string() ),
				ficsitUserIds: z.array( z.string() )
			} )
		} ) ).mutation<{
			message : string
		}>( async( { input, ctx } ) => {
			const { guildId } = ctx;
			try {
				if ( guildId ) {
					const guild = await DB_Guilds.findOne( { guildId: guildId } );
					if ( guild ) {
						guild.options = {
							...guild.options,
							...input.data
						};

						for ( const [ k, v ] of Object.entries( input.data ) ) {
							guild.options[ k ] = v;
						}

						if ( await guild.save() ) {
							const guild = await DB_Guilds.findOne( { guildId: guildId } );
							if ( guild ) {
								return { message: `Config updated successfully.` };
							}
						}
					}
				}
			}
			catch ( e ) {
				handleTRCPErr( e );
			}
			throw new TRPCError( { message: "Something goes wrong!", code: "INTERNAL_SERVER_ERROR" } );
		} )
	} );