import * as path            from "path";
import { Server }           from "socket.io";
import http                 from "http";
import express              from "express";
import { InstallRoutings }  from "./routings/initRouter";
import process              from "process";
import * as mongoose        from "mongoose";
import "@kyri123/k-javascript-utils/lib/useAddons";
import fs                   from "fs";
import fileUpload           from "express-fileupload";
import { SystemLib_Class }  from "@server/lib/System.Lib";
import {
	IEmitEvents,
	IListenEvents
}                           from "@shared/types/SocketIO";
import DB_UserAccount       from "@server/mongodb/DB_UserAccount";
import { ERoles }           from "@shared/Enum/ERoles";
import { TaskManagerClass } from "@server/tasks/TaskManager";

global.__BaseDir = __dirname;
global.__RootDir = path.join( __BaseDir, "../.." );
global.__MountDir = path.join( __RootDir, "mount" );
( !fs.existsSync( path.join( __MountDir, "Logs" ) ) ) && fs.mkdirSync( path.join( __MountDir, "Logs" ), { recursive: true } );
global.__LogFile = path.join( __MountDir, "Logs", `${Date.now()}.log` );

global.SystemLib = new SystemLib_Class();

global.Api = express();
global.HttpServer = http.createServer( global.Api );

global.SocketIO = new Server<IListenEvents, IEmitEvents>( global.HttpServer, {
	path: "/api/v1/io/",
	cors: {
		origin: "*",
		methods: [ "GET", "POST", "PUT", "PATCH", "DELETE" ],
		credentials: false
	}
} );

Api.use( express.json() );
Api.use( express.urlencoded( { extended: true } ) );
Api.use( fileUpload( {
	useTempFiles: true,
	tempFileDir: "/tmp/"
} ) );
Api.use( express.static( path.join( __BaseDir, "../..", "dist" ), { extensions: [ "js" ] } ) );

Api.use( function( req, res, next ) {
	res.setHeader( "Access-Control-Allow-Origin", "*" );
	res.setHeader( "Access-Control-Allow-Methods", "GET, POST" );
	res.setHeader(
		"Access-Control-Allow-Headers",
		"X-Requested-With,content-type"
	);
	res.setHeader( "Access-Control-Allow-Credentials", "true" );
	next();
} );

mongoose
	.connect(
		`mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}`,
		{
			user: process.env.MONGODB_USER,
			pass: process.env.MONGODB_PASSWD
		}
	)
	.then( async() => {
		global.DownloadIPCached = [];
		// Sockets need to connect on a room otherwise we will not be able to send messages
		SocketIO.on( "connection", function( socket ) {
			const query = socket.handshake.query;
			const roomName = query.roomName;
			if ( !roomName || Array.isArray( roomName ) ) {
				socket.disconnect( true );
				return;
			}
			socket.join( roomName as string );
		} );

		SystemLib.Log( "[DB] Connected... Start API and SOCKETIO" );

		global.Router = express.Router();
		await InstallRoutings( path.join( __BaseDir, "routings/router" ) );

		Api.use( Router );
		Api.get( "*", function( req, res ) {
			res.sendFile( path.join( __RootDir, "dist", "index.html" ) );
		} );

		if ( !await DB_UserAccount.findOne() ) {
			const NewUser = new DB_UserAccount();
			NewUser.email = "admin@kmods.de";
			NewUser.username = "Kyrium";
			NewUser.role = ERoles.admin;
			NewUser.setPassword( "123456" );
			SystemLib.LogWarning( "[DB] Default user was created. Kyrium | 123456 | admin@kmods.de" );
			await NewUser.save();
		}

		global.TaskManager = new TaskManagerClass();
		await TaskManager.Init();

		HttpServer.listen( 80, async() =>
			SystemLib.Log(
				"[API/SOCKETIO] API listen on port",
				80
			)
		);
	} );
