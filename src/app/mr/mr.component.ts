import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { MRService } from '../mr.service';
import { DocService } from '../doc.service';
import { fstat } from 'fs';

@Component({
  selector: 'app-mr',
  templateUrl: './mr.component.html',
  styleUrls: ['./mr.component.css']
})
export class MRComponent implements OnInit {

  MergeForm: FormGroup;
  Siglas: FormArray;
  result: string;
  constructor(private MRService: MRService, private DocService: DocService) { }

  ngOnInit(): void {
    this.MergeForm = new FormGroup({
      Issue: new FormControl(''),
      Dev: new FormControl(''),
      Lean: new FormControl(''),
      Func: new FormControl(''),
      Info: new FormControl(''),
      Massas: new FormArray([]),
      Siglas: new FormArray([]),
      Telas: new FormArray([])
    });

    this.addSigla();
    this.addMassa();
    this.addTela();
  }

  createMassa(): FormGroup {
    return new FormGroup({
      cpf: new FormControl(''),
      banco: new FormControl(''),
      agencia: new FormControl(''),
      conta: new FormControl(''),
      observacao: new FormControl('')
    })
  }

  addMassa(): void {
    this.Massas.push(this.createMassa());
  }

  createSigla(): FormGroup {
    return new FormGroup({
      usuario: new FormControl(''),
      senha: new FormControl(''),
      observacao: new FormControl('')
    })
  }

  addSigla(): void {
    this.Siglas = this.MergeForm.get('Siglas') as FormArray;
    this.Siglas.push(this.createSigla());
  }

  createTela(): FormGroup {
    return new FormGroup({
      codigo: new FormControl(''),
      titulo: new FormControl(''),
      observacao: new FormControl(''),
      validacoes: new FormArray([])
    })
  }

  addTela(): void {
    let novaTela = this.createTela();
    let validacoes = novaTela.get('validacoes') as FormArray;
    validacoes.push(new FormControl(''));
    this.Telas.push(novaTela);
  }

  createValidacao(indice: FormArray) {
    indice.push(new FormControl(''));
  }

  onSubmit() {

    this.DocService.mrToDoc(this.MergeForm);
    this.result = this.MRService.getMergeRequestText(this.MRService.getMergeRequest(this.MergeForm));
  }

  get Issue() {
    return this.MergeForm.get('Issue') as FormControl;
  }
  get Telas() {
    return this.MergeForm.get('Telas') as FormArray;
  }
  get Massas() {
    return this.MergeForm.get('Massas') as FormArray;
  }
  get validacoes() {
    return new FormArray([new FormControl('')]);
  }

}
