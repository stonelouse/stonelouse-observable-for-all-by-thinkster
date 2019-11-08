import { of, Observable, Observer } from 'rxjs'; 
import { map } from 'rxjs/operators';

/* ==== Observable vs. Promise ==== */
console.clear();

const p: Promise<string> = new Promise(
  (res: (string) => void, rej: (any) => void) => res('Hello Thinkster Nation from Promise'));
p.then(res => console.log('Promise resolve:', res));

/*
  Observable and Stream is interchangeable
 */
const o: Observable<string> = new Observable(
  (observer: Observer<string>) => observer.next('Hello Thinkster Nation from Observable'));
o.subscribe(res => console.log('Observable next:', res));


/* ==== Single for Promises vs. Multiple Use for Observables ==== */
// You can resolve the promise only once! Subsequent resolving has no effect!
const p1: Promise<string> = new Promise(
  (res: (string) => void, rej: (any) => void) => {
    res('Hello Thinkster Nation from Promise');
    setTimeout(_ => res('Hello Thinkster Nation from Promise 2nd time'), 1000);
});
const o1: Observable<string> = new Observable(
  (observer: Observer<string>) => {
    observer.next('Hello Thinkster Nation from Observable');
    setTimeout(_ => observer.next('Hello Thinkster Nation from Observable 2nd time'));
});

p1.then(res => console.log('Promise resolve 1:', res));
p1.then(res => console.log('Promise resolve 2:', res));
/*
    Promise resolve 1: Hello Thinkster Nation from Promise
    Promise resolve 2: Hello Thinkster Nation from Promise
 */
o1.subscribe(res => console.log('Observable next 1:', res));
o1.subscribe(res => console.log('Observable next 2:', res));
/*
    Observable next 1: Hello Thinkster Nation from Observable
    Observable next 2: Hello Thinkster Nation from Observable
    Observable next 1: Hello Thinkster Nation from Observable 2nd time
    Observable next 2: Hello Thinkster Nation from Observable 2nd time    
 */