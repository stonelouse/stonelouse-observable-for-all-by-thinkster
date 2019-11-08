import { of, Observable, Observer } from 'rxjs'; 
import { map } from 'rxjs/operators';

/* ==== Observable vs. Promise ==== */
console.clear();

let p: Promise<string> = new Promise(
  (res: (string) => void, rej: (any) => void) => res('Hello Thinkster Nation from Promise'));
p.then(res => console.log('Promise resolve:', res));

/*
  Observable and Stream is interchangeable
 */
let o: Observable<string> = new Observable(
  (observer: Observer<string>) => observer.next('Hello Thinkster Nation from Observable'));
o.subscribe((res) => console.log('Observable next:', res));
