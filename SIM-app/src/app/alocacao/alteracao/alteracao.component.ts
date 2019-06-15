import { NgModule } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Aula } from '../aula';
import { Monitor } from '../monitor';
import { AulaService } from '../aula.service';
import { MonitorService } from '../monitor.service';

@Component({
  selector: 'app-root',
  templateUrl: './alteracao.component.html',
  styleUrls: ['./alteracao.component.css']
})
export class AlteracaoComponent implements OnInit {
  
  constructor(private aulaService: AulaService, private monitorService: MonitorService) { }

  monitores: Monitor[];
  aulas: Aula[] = [];
  data: string;
  diaSelect: Aula;
  monitoresAlocados: string;
  erroAloc:boolean = false;
  ngOnInit() {
    this.aulaService.getAulas()
    .then(as => this.aulas = as)
    .catch(erro => alert(erro));
    this.monitorService.getMonitores()
    .then(as => this.monitores = as)
    .catch(erro => alert(erro));
  }

  
  buscar() : void {

    
    this.aulaService.getAulas()
    .then(as => this.aulas = as)
    .catch(erro => alert(erro));
    this.monitorService.getMonitores()
    .then(as => this.monitores = as)
    .catch(erro => alert(erro));
    for(var i = 0; i < this.aulas.length; i++) {
      if(this.aulas[i].data == this.data) {
        console.log(this.aulas[i])
        this.diaSelect = this.aulas[i];
        this.monitoresAlocados = this.monitoresString(this.diaSelect.monitores);
        this.erroAloc = false;
        break;
      }
    }
  }

  monitoresString(monitores: Monitor[]) : string{
    if(monitores.length == 0) {
      return "";
    } else {
      var result:string = "";
      monitores.forEach(m => {
        if(m) result += m.nome + " ";
      })
      console.log(result.substr(0, result.length-1));
      return result.substr(0, result.length-1);
    }
  }

  atualizarAula() : void {
    this.diaSelect.monitores = this.getMonitores(this.diaSelect.diaSemana);
 
    if(this.diaSelect.monitores != undefined)
    this.aulaService.atualizar(this.diaSelect)
    .then(as => {
      if(as) {

        this.diaSelect = undefined;
        this.monitoresAlocados = undefined;
        this.data = "";
        for(var i = 0; i < this.aulas.length; i++) {
          if (this.aulas[i].data == as.data) {
            this.aulas[i] = as;
          }
        }
      }
    })
    .catch(erro => alert(erro));
    else{
        this.diaSelect = undefined;
        this.monitoresAlocados = undefined;
        this.data = "";
        this.erroAloc = true;
    }
    
  }
checkDisp(diaCheck, dispo) : boolean{
  if(diaCheck == "segunda-feira")
  return dispo[0];
  if(diaCheck == "terca-feira")
  return dispo[1];
  if(diaCheck == "quarta-feira")
  return dispo[2];
  if(diaCheck == "quinta-feira")
  return dispo[3];
  if(diaCheck == "sexta-feira")
  return dispo[4];
}
  getMonitores(diaCheck) : Monitor[] | undefined {
    var result = [];
    
    if(this.monitoresAlocados == undefined || this.monitoresAlocados == "")
    return result;
    else
    var names = this.monitoresAlocados.split(" ");
    names.forEach(nome => {
        let mon = this.monitores.find(e => e.nome == nome);
        if(this.checkDisp(diaCheck,mon.disponibilidade))
        result.push(mon);
        else{
           return undefined
        } 
  
    });

    if(result.length >0)
    return result;
    else
    return undefined;
  }

}
