/* eslint-disable @typescript-eslint/no-explicit-any */

export class Timepiece extends Set {
	constructor(array: any[] | undefined, at: null | number) {
		super(array);
		
		this.at = at;
		
	}
	
	at;
	
}
