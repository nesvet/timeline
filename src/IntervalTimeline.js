import { indexToTs, tsToIndex } from "./common";
import { Timeline } from "./Timeline";
import { Timepiece } from "./Timepiece";


export class IntervalTimeline extends Timeline {
	
	set(value, from, to) {
		if (typeof from != "number" || typeof to != "number") {
			from = null;
			to = null;
		}
		
		const tsString = `${from}-${to}`;
		const mtsString = this.m.get(value);
		
		if (tsString !== mtsString) {
			if (mtsString)
				this.remove(value);
			
			this.m.set(value, tsString);
			
			if (from === null)
				this.limbo.add(value);
			else {
				const fromIndex = tsToIndex(from);
				const toIndex = tsToIndex(to);
				
				for (let ts = from, index = fromIndex; index < toIndex; ts += 86_400_000, index++)
					if (!this.a[index]?.add(value))
						this.a[index] = new Timepiece([ value ], ts);
				
				if (fromIndex < this.firstIndex) {
					this.firstIndex = fromIndex;
					this.startAt = indexToTs(fromIndex);
				}
				
				if (toIndex === this.a.length)
					this.endAt = indexToTs(toIndex);
			}
		}
		
	}
	
	remove(value) {
		
		if (this.m.size > 1) {
			
			const tsString = this.m.get(value);
			
			if (tsString) {
				this.m.delete(value);
				
				if (tsString === "null-null")
					this.limbo.delete(value);
				else {
					const [ from, to ] = tsString.split(/-/);
					const fromIndex = tsToIndex(parseInt(from));
					const toIndex = tsToIndex(parseInt(to));
					
					for (let index = fromIndex; index < toIndex; index++) {
						const piece = this.a[index];
						if (piece.size > 1)
							piece.delete(value);
						else
							delete this.a[index];
					}
					
					if (fromIndex === this.firstIndex && !this.a[this.firstIndex]) {
						do
							this.firstIndex++;
						while (!this.a[this.firstIndex]);
						this.startAt = indexToTs(this.firstIndex);
					}
					if (toIndex === this.a.length && !this.a[this.a.length - 1]) {
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
	
}

Timeline.Interval = IntervalTimeline;
