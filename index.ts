import { of, Observable, Observer, Subscription } from 'rxjs'; 
import { map } from 'rxjs/operators';

console.clear();
/* ==== Observable vs. Promise ==== */
const p: Promise<string> = new Promise(
  (res: (string) => void, rej: (any) => void) => res('Hello Thinkster Nation from Promise'));
p.then(res => console.log('Promise resolve:', res));
/*
  Observable and Stream is interchangeable
 */
const o: Observable<string> = new Observable(
  (observer: Observer<string>) => observer.next('Hello Thinkster Nation from Observable'));
o.subscribe(res => console.log('Observable next:', res));
/*
    Observable next: Hello Thinkster Nation from Observable
    Promise resolve: Hello Thinkster Nation from Promise
*/

console.clear();
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
 */
o1.subscribe(res => console.log('Observable next 1:', res));
o1.subscribe(res => console.log('Observable next 2:', res));
/*
    Observable next 1: Hello Thinkster Nation from Observable
    Observable next 2: Hello Thinkster Nation from Observable
    Promise resolve: Hello Thinkster Nation from Promises               // ... "leftovers" from above;
    Promise resolve 1: Hello Thinkster Nation from Promise
    Promise resolve 2: Hello Thinkster Nation from Promise
    Observable next 1: Hello Thinkster Nation from Observable 2nd time
    Observable next 2: Hello Thinkster Nation from Observable 2nd time    
 */

console.clear();
/* ==== Promises are eager; Observables are lazy ==== */
const p2: Promise<string> = new Promise(
  (res: (string) => void, rej: (any) => void) => {
    console.log('entering Promise ctor callback of p2');
    res("Hello from p2");
  }
)
const o2: Observable<string> = new Observable(
  (observer: Observer<string>) => {
    console.log('entering Observable ctor callback of o2');
    observer.next('Hello from o2');
  }
)
let num = 0;
const p3: Promise<string> = new Promise(
  (res: (string) => void, rej: (any) => void) => {
    console.log('entering Promise ctor callback of p3', num);
    res("Hello from p3");
  }
)
const o3: Observable<string> = new Observable(
  (observer: Observer<string>) => {
    console.log('entering Observable ctor callback of o3', num);
    observer.next('Hello from o3');
  }
)
num++;
p3.then((res: string) => console.log('p3 then (1)', res));
num++;
p3.then((res: string) => console.log('p3 then (2)', res));
num++;
o3.subscribe((res: string) => console.log('o3 subscribe (1)', res));
num++;
o3.subscribe((res: string) => console.log('o3 subscribe (2)', res));
/*
    entering Promise ctor callback of p2                                // no subscription to o2 => no console log; lazy!
    entering Promise ctor callback of p3 0                              // Promises: Ctor callback is called on promise instantiation
    entering Observable ctor callback of o3 3                           // Observables: Ctor callback is called on subscription 
    o3 subscribe (1) Hello from o3                                      
    entering Observable ctor callback of o3 4                           // Observables: Ctor callback is called on subscription 
    o3 subscribe (2) Hello from o3                                      
    Promise resolve: Hello Thinkster Nation from Promises               // ... "leftovers" from above;
    Promise resolve 1: Hello Thinkster Nation from Promise              // ... "leftovers" from above;
    Promise resolve 2: Hello Thinkster Nation from Promise              // ... "leftovers" from above;
    p3 then (1) Hello from p3                                           // Promises seems to react slower
    p3 then (2) Hello from p3
    Observable next 1: Hello Thinkster Nation from Observable 2nd time  // ... "leftovers" from above;
    Observable next 2: Hello Thinkster Nation from Observable 2nd time  // ... "leftovers" from above;
 */

console.clear();
/* ==== Promises are not cancelable; Observables are cancelable ==== */
/*
    If you unsubscribe a subscription to an Observable
    ... the observer action will not be called any longer.
    This is useful to ignore asynchronous server responses 
    ... when you are no longer interested in them.    
    To do the same with Promises, 
    ... you need special libraries (like Bluebird)
 */
const o4: Observable<number> = new Observable(
  (observer: Observer<number>) => {
    let num: number = 0;
    const interval = setInterval(_ => {
      num++;
      console.log('o4 ctor callback', num);
      observer.next(num);
    }, 1000);
    setTimeout(_ => clearInterval(interval), 10000);
  }
)
const o4Subscription: Subscription = o4.subscribe((n: number) => console.log('o4 subscription', n));
setTimeout(_ => o4Subscription.unsubscribe(), 6000);
/*
    Promise resolve: Hello Thinkster Nation from Promises               // ... "leftovers" from above;
    Promise resolve 1: Hello Thinkster Nation from Promise              // ... "leftovers" from above;
    Promise resolve 2: Hello Thinkster Nation from Promise              // ... "leftovers" from above;
    p3 then (1) Hello from p3                                           // ... "leftovers" from above;
    p3 then (2) Hello from p3                                           // ... "leftovers" from above;
    Observable next 1: Hello Thinkster Nation from Observable 2nd time  // ... "leftovers" from above;
    Observable next 2: Hello Thinkster Nation from Observable 2nd time  // ... "leftovers" from above;
    o4 ctor callback 1
    o4 subscription 1
    o4 ctor callback 2
    o4 subscription 2
    o4 ctor callback 3
    o4 subscription 3
    o4 ctor callback 4
    o4 subscription 4
    o4 ctor callback 5
    o4 subscription 5
    o4 ctor callback 6
    o4 ctor callback 7
    o4 ctor callback 8
    o4 ctor callback 9
 */
