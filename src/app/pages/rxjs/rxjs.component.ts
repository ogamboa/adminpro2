import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscriber, interval, Subscription } from 'rxjs';
import { retry, take, map, filter } from 'rxjs/operators';


@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent {

  public intervalSubs: Subscription;

  constructor() {

  //  this.retornaObservable().pipe(
  //    retry(2)
  //  ).subscribe(
  //   valor => console.log('Subs:', valor),
  //   error => console.warn ('Error', error),
  //   () => console.log('Obs terminado')
  // );

  this.intervalSubs = this.retornaIntervalo()
  .subscribe( console.log )

  }

ngOnDestroy(): void{
  this.intervalSubs.unsubscribe();
}

retornaIntervalo():Observable<number>{
  return interval(1000)
  .pipe(
   // take(10),
    map( valor => valor + 1),
    filter(valor => (valor % 2 === 0) ? true:false )
  );
}

retornaObservable():Observable<number>{
  const obs$ = new Observable<number>( observer=> {

  let i= -1;

      const intervalo = setInterval( () => {

      i++;
      observer.next(i);

      if (i===4){
        clearInterval(intervalo);
        observer.complete();
      }

      if (i===2){
        observer.error('Se llego a 2');
      }

    },1000);

   });
   return obs$;
}

}
