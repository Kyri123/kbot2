import { User }          from "../class/User.Class";
import { UploadedFile }  from "express-fileupload";
import { EDesignerSize } from "../Enum/EDesignerSize";
import {
	FilterQuery,
	QueryOptions
}                        from "mongoose";
import {
	IMO_BlueprintPack,
	IMO_Tag,
	IMO_UserAccount
}                        from "./MongoDB";

export type RequestWithUser<T = any> = {
	UserClass? : T;
}

export type IRequestBody<T> = RequestWithUser<User> & Partial<T>;

export type TRequest_Unknown<UseUser extends boolean = true, UserType = any> = IRequestBody<unknown, UseUser, UserType>;

// ----------------------------------------
// ----------------- Auth -----------------
// ----------------------------------------

export type TRequest_Auth_Modify = IRequestBody<{
	UserID : string;
	Remove : boolean;
	Data : Partial<IMO_UserAccount>;
}>;
export type TRequest_Auth_Logout = IRequestBody<{
	Token : string;
}>;
export type TRequest_Auth_SignIn = IRequestBody<{
	Login : string;
	Password : string;
}>;
export type TRequest_Auth_SignUp = IRequestBody<{
	Login : string;
	EMail : string;
	Password : string;
	RepeatPassword : string;
}>;
export type TRequest_Auth_Vertify = IRequestBody<{
	Token : string
}>;

// -------------------------------------------
// ----------------- BP_Util -----------------
// -------------------------------------------

export type TRequest_BPU_ParseBlueprint = IRequestBody<{
	BlueprintName : string;
}>;

export type TRequest_BPU_ReadBlueprint = IRequestBody<{
	Id : string;
}>;

// --------------------------------------
// ----------------- BP -----------------
// --------------------------------------

export type TRequest_BP_Questionary<T = any> = IRequestBody<{
	Filter : FilterQuery<T>,
	Options : QueryOptions<T>
}>;

// ---------------------------------------
// ----------------- BPP -----------------
// ---------------------------------------

export type TResponse_BPP_Manage_PUT = IRequestBody<{ PackInformation : Partial<IMO_BlueprintPack> }>;
export type TResponse_BPP_Manage_POST = IRequestBody<{ ID : string, PackInformation : Partial<IMO_BlueprintPack> }>;
export type TResponse_BPP_Manage_DELETE = IRequestBody<{ ID : string }>;
export type TResponse_BPP_Manage_SUB = IRequestBody<{ ID : string }>;

export type TResponse_BPP_Admin_PUT = TResponse_BPP_Manage_PUT;
export type TResponse_BPP_Admin_POST = TResponse_BPP_Manage_POST;
export type TResponse_BPP_Admin_DELETE = TResponse_BPP_Manage_DELETE;

// -------------------------------------------
// ----------------- BP_User -----------------
// -------------------------------------------

export type TRequest_BPUser_ToggleLike = IRequestBody<{
	Id : string;
}>;
export type TRequest_BPUser_Create = IRequestBody<{
	BlueprintName : string;
	BlueprintDesc : string;
	BlueprintTags : string[];
	BlueprintMods : string[];
	DesignerSize : EDesignerSize;
}>;
export type TRequest_BPUser_Create_Files = Partial<{
	SBP : UploadedFile;
	SBPCFG : UploadedFile;
	Image : UploadedFile;
}>

export type TRequest_BPUser_Edit = IRequestBody<{
	BlueprintId : string;
	BlueprintName : string;
	BlueprintDesc : string;
	BlueprintTags : string[];
	BlueprintMods : string[];
	DesignerSize : EDesignerSize;
}>;
export type TRequest_BPUser_Edit_Files = Partial<{
	Image : UploadedFile;
}>

// ----------------------------------------
// ----------------- Tags -----------------
// ----------------------------------------

export type TRequest_Tags_Modify = IRequestBody<{
	Remove : boolean;
	Id : string;
	Data : Partial<IMO_Tag>;
}>;
