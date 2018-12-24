
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'keys'})
export class KeysPipe implements PipeTransform {
  transform(value, args:string[]) : any {
    let temp = Object.keys(value);
    return temp;
  }
}

@Pipe({ name: 'iconColor' })
export class IconColor implements PipeTransform {
  transform(allScript: any[]) {
    return allScript.filter(script => script.parent==null);
  }
}

@Pipe({ name: 'notUndefined' })
export class notUndefined implements PipeTransform {
  transform(allScript: any[]) {
    return allScript.filter(script => script!=undefined);
  }
}

@Pipe({ name: 'pads' })
export class pads implements PipeTransform {
  transform(allScript: any[], controller) {
    let ret = allScript.filter(s=>{return (s!=null && s.parent_id==controller.id)});
    return ret;
  }
}

@Pipe({ name: 'toArray' })
export class toArray implements PipeTransform {
  transform(number) {
    let ret =  Array.from(new Array(parseInt(number)),(val,index)=>index+1);
    return ret;
  }
}

@Pipe({ name: 'toClassCss' })
export class toClassCss implements PipeTransform {
  transform(string) {
    if (string==undefined){
      return '';
    }
    string = string.replace(/\s|\//g,'-');
    return string;
  }
}

@Pipe({ name: 'minMax' })
export class minMax implements PipeTransform {
  transform(number, type) {
    if (type=='Send'){
      if (number==-70){
        number = '-inf'
      }
      return number+' dB'
    }
    if (type=='Volume'){
      if (number==-69){
        number = '-inf'
      }
      return number+' dB'
    }
    if (type=='Pan'){
      if (number<0){
        number = number*-1+'L'
      }else{
        if(number>0){
          number = number+'R'
        }
        else{
          number = 'C'
        }
      }
      return number
    }

    if (type=='Tempo'){
      return number+' bpm'
    }
    return number
  }
}