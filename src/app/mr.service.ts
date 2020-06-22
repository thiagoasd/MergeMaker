import { Injectable } from '@angular/core';
import { Massa, Sigla, Validacao, Tela, MergeRequest } from './MR.model';
import { FormGroup, FormArray } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class MRService {

  constructor() { }

  public getMergeRequestText(MR: MergeRequest) {

    // MR = <MergeRequest>{
    //   dev: 'Thiago',
    //   func: 'Solicitação historico',
    //   info: 'Muitos campos',
    //   issue: 3,
    //   lean: 'Histo-Solic',
    //   massas: [
    //     <Massa>{cpf: '01383440433', agencia: '0001', banco: '0033', conta: '00000001', observacao: 'Conta 1' },
    //     <Massa>{cpf: '13634089415', agencia: '0002', banco: '0034', conta: '00000002', observacao: 'Conta 2' }
    //   ],
    //   siglas: [
    //     <Sigla>{ usuario: 'T631756', senha: 'S@ntander17', observacao: 'Possui Transações' },
    //     <Sigla>{ usuario: 'T871H98', senha: 'S@ntander17', observacao: 'Possui Saldo' }
    //   ],
    //   telas: [
    //     <Tela>{
    //       codigo: 'BRPC004', titulo: 'Solicitação de historico', validacoes: [
    //         <Validacao>{ validacao: 'Validacao 1' },
    //         <Validacao>{ validacao: 'Validacao 2' },
    //         <Validacao>{ validacao: 'Validacao 3' },
    //       ]
    //     },
    //     <Tela>{
    //       codigo: 'BRPC005', titulo: 'Consulta pessoas', observacao: 'Acessivel pelo botão ao lado do campo "Conta"', validacoes: [
    //         <Validacao>{ validacao: 'Validacao 1' },
    //         <Validacao>{ validacao: 'Validacao 2' },
    //         <Validacao>{ validacao: 'Validacao 3' },
    //         <Validacao>{ validacao: 'Validacao 4' },
    //         <Validacao>{ validacao: 'Validacao 5' },
    //       ]
    //     }
    //   ]
    // }

    let text: string = "";

    let intro: string = this.getHeadline(MR.issue);

    let detalhe: string = this.getDetail(MR.info);

    let sigla: string = "";

    MR.siglas.forEach(sig => {
      sigla += this.getSigla(sig);
    });
    sigla +='\n' 

    let massa: string = this.getMassaTable(MR.massas);

    // MR.massas.forEach(mas => {
    //   massa += this.getMassa(mas);
    // });

    //massa += "\n";

    let checklist: string = "## Checklist \n\n";

    let telas: string = "";

    MR.telas.forEach(tela => {
      telas += this.getTelaText(tela);
    });


    text = intro + detalhe + sigla + massa + checklist + telas;

    return text;
  }

  public getMergeRequest(form: FormGroup) {
    let MR: MergeRequest = new MergeRequest;

    MR.issue = Number(form.get('Issue').value);
    MR.info = form.get('Info').value;
    let Massas = (form.get('Massas') as FormArray); 1

    Massas.controls.forEach(control => {
      let massa_tmp = new Massa;
      massa_tmp.cpf = control.get('cpf').value;
      massa_tmp.banco = control.get('banco').value;
      massa_tmp.agencia = control.get('agencia').value;
      massa_tmp.conta = control.get('conta').value;
      massa_tmp.observacao = control.get('observacao').value;
      MR.massas.push(massa_tmp);
    });

    let Siglas = (form.get('Siglas') as FormArray);

    Siglas.controls.forEach(control => {
      let sigla_tmp = new Sigla;
      sigla_tmp.usuario = control.get('usuario').value;
      sigla_tmp.senha = control.get('senha').value;
      sigla_tmp.observacao = control.get('observacao').value;
      MR.siglas.push(sigla_tmp);
    });

    let Telas = (form.get('Telas') as FormArray);
    Telas.controls.forEach(control => {
      let tela_tmp = new Tela;
      let validacoes = new Array<Validacao>();
      tela_tmp.codigo = control.get('codigo').value;
      tela_tmp.titulo = control.get('titulo').value;
      tela_tmp.observacao = control.get('observacao').value;

      let validacoes_tmp = control.get('validacoes') as FormArray;
      validacoes_tmp.controls.forEach(valControl => {
        validacoes.push(valControl.value);
      });
      tela_tmp.validacoes = validacoes;
      MR.telas.push(tela_tmp);
    });

    return MR;

  }

  private getHeadline(issue: number): string {

    let tmp: string = "Closes #" + issue + "\n\n" + "# Este MR é relacionado a qual issue?\n\n" + "conectado à #" + issue
      + "\n";

    return tmp;
  }

  private getDetail(info: string): string {

    if (!info) { return '' }
    let tmp: string = "## Este MR precisa de atenção especial em algum detalhe?\n\n" + info + "\n\n";
    return tmp;
  }

  private getMassa(massa: Massa): string {


    let tmp: string = "";

    if (massa.cpf) {
      tmp += "CPF " + massa.cpf + " ";
    }

    if (massa.banco) {
      tmp += "Banco " + massa.banco + " ";
    }

    if (massa.agencia) {
      tmp += "Agencia " + massa.agencia + " ";
    }

    if (massa.conta) {
      tmp += "Conta " + massa.conta + " ";
    }

    if (massa.observacao) {
      tmp += "Obs: " + massa.observacao + "\n";
    }

    return tmp;

  }

  private getMassaTable(massas: Massa[]) {

    let tmp: string = "";

    tmp = "| CPF | Banco | Agência | Conta | Observação |\n";
    tmp += "|:---:|:-----:|:------:|:-----:|:----------:|\n";

    massas.forEach(massa => {
      tmp += "|" + massa.cpf + "|" + massa.banco + "|" + massa.agencia + "|" + massa.conta + "|" + massa.observacao + "|\n";
    });

    return tmp + '\n';

  }

  private getSigla(sigla: Sigla): string {
    let tmp: string = "";

    if (sigla.usuario) {
      tmp += "Usuario " + sigla.usuario + " ";
    }

    if (sigla.senha) {
      tmp += "Senha " + sigla.senha + " ";
    }

    if (sigla.observacao) {
      tmp += "Observação: " + sigla.observacao;
    }

    if (tmp) { tmp += '\n' }

    return tmp;

  }

  private getComboBoxes(validacoes: Array<Validacao>): string {
    let comboboxes: string = "";
    let count: number = 0;

    validacoes.forEach(validacao => {
      let tmp: string = "* " + (validacao.validacao);
      if (count < validacoes.length) {
        tmp += "\n";
      }
      count++;
      comboboxes += tmp;

    });

    return comboboxes;
  }

  private getTelaText(tela: Tela): string {

    let res: string = "";
    let headline: string = '[ ] ' + tela.codigo + ": " + tela.titulo + "\n";

    if (tela.observacao) {
      headline += tela.observacao + "\n";
    }

    let comboboxes: string = this.getComboBoxes(tela.validacoes);

    res += headline + "\n";
    res += comboboxes + "\n";

    return res;
  }

}
