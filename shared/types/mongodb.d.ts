export interface IMongoDB {
	_id? : string,
	__v? : number,
	createdAt? : Date | string, // string on client side
	updatedAt? : Date | string // string on client side
}
