import jwt, { JwtPayload } from "jwt-decode";
import { ERoles }          from "../Enum/ERoles";
import { DefaultUser }     from "../Default/Auth.Default";
import { IMO_UserAccount } from "@shared/types/MongoDB";

export class User {
	private JsonWebToken;
	private UserData : IMO_UserAccount & Partial<JwtPayload>;

	constructor( JsonWebToken : string ) {
		this.JsonWebToken = JsonWebToken;
		try {
			this.UserData = jwt( JsonWebToken );
		}
		catch ( e ) {
			this.UserData = {
				...DefaultUser
			};
		}
	}

	public get IsValid() {
		return this.GetTimeLeft() > 0;
	}

	public get Get() {
		return this.UserData;
	}

	public setUserData( Data : IMO_UserAccount ) {
		this.UserData = {
			...this.UserData,
			...Data
		};
	}

	public GetTimeLeft() {
		if ( this.UserData?.exp ) {
			return Math.max( this.UserData.exp - Date.now() / 1000, 0 );
		}
		return 0;
	}

	public GetUserImage() {
		return this.IsValid ? "/images/default/unknown.png" : "/images/default/unknown.png";
	}

	public HasPermssion( Permssion : ERoles ) {
		return this.UserData.role >= Permssion && this.IsValid;
	}
}
