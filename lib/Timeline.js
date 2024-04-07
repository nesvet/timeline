import { indexToTs, tsToIndex } from "./common";
import { Timepiece } from "./Timepiece";


export class Timeline {
	constructor() {
		
		this.clear();
		
	}
	
	clear() {
		
		this.a = [];
		this.m = new Map();
		this.firstIndex = 4294967294;
		this.startAt = null;
		this.endAt = null;
		
	}
	
	set(value, at) {
		
		const mat = this.m.get(value);
		
		if (at !== mat) {
			if (mat)
				this.remove(value);
			
			const index = tsToIndex(at);
			
			if (!this.a[index]?.add(value))
				this.a[index] = new Timepiece([ value ], at);
			
			this.m.set(value, at);
			
			if (index < this.firstIndex) {
				this.firstIndex = index;
				this.startAt = indexToTs(index);
			}
			
			if (index === this.a.length - 1)
				this.endAt = indexToTs(index);
		}
		
	}
	
	remove(value) {
		
		if (this.m.size > 1) {
			
			const at = this.m.get(value);
			
			if (at) {
				this.m.delete(value);
				
				const index = tsToIndex(at);
				
				const piece = this.a[index];
				
				if (piece.size > 1)
					piece.delete(value);
				else {
					delete this.a[index];
					
					if (index === this.firstIndex) {
						do
							this.firstIndex++;
						while (!this.a[this.firstIndex]);
						this.startAt = indexToTs(this.firstIndex);
					} else if (index === this.a.length - 1) {
						do
							this.a.length--;
						while (!this.a[this.a.length - 1]);
						this.endAt = indexToTs(this.a.length - 1);
					}
				}
			}
		} else if (this.m.has(value))
			this.clear();
		
	}
	
	delete = this.remove;
	
	getValues(from, to, includeEnd) {
		let index = this.startAt >= from ? this.firstIndex : tsToIndex(from);
		let toIndex = this.endAt <= to ? this.a.length - 1 : tsToIndex(to);
		
		if (includeEnd)
			toIndex++;
		
		const values = new Set();
		
		for (let piece; index < toIndex; index++)
			if ((piece = this.a[index]))
				for (const value of piece)
					values.add(value);
		
		return values;
	}
	
	getRange(from, to = this.endAt, includeEnd) {
		let index = tsToIndex(from);
		let toIndex = tsToIndex(to);
		if (includeEnd)
			toIndex++;
		
		const range = [];
		
		for (let ts = from; index < toIndex; ts += 86_400_000)
			range.push(this.a[index++] || new Timepiece(undefined, ts));
		
		return range;
	}
	
	getRangeMap(from, to = this.endAt, includeEnd) {
		let index = tsToIndex(from);
		let toIndex = tsToIndex(to);
		if (includeEnd)
			toIndex++;
		
		const rangeMap = new Map();
		
		for (let ts = from; index < toIndex; ts += 86_400_000)
			rangeMap.set(ts, this.a[index++] || new Timepiece(undefined, ts));
		
		return rangeMap;
	}
	
	get size() {
		return this.m.size;
	}
	
}
