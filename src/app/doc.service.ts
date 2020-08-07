import { Injectable } from '@angular/core';
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Header, Alignment, AlignmentType, ISectionOptions, PageBreak, Table, TableRow, TableCell, ParagraphStyle, Media } from "docx";
import { Sigla, MergeRequest, Massa, Tela, Validacao } from './MR.model';
import { FormArray, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class DocService {
  doc: Document;
  paragraphs: Array<Paragraph | Table>;
  constructor() { }

  public getMergeRequest(form: FormGroup): MergeRequest {
    let MR: MergeRequest = new MergeRequest;

    MR.issue = Number(form.get('Issue').value);
    MR.dev = form.get('Dev').value;
    MR.func = form.get('Func').value;
    MR.lean = form.get('Lean').value;
    MR.info = form.get('Info').value;
    let Massas = (form.get('Massas') as FormArray);

    Massas.controls.forEach(control => {
      let massa_tmp = new Massa;
      massa_tmp.titulo = control.get('titulo').value;
      massa_tmp.valor = control.get('valor').value;
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
        let tmp = new Validacao()
        tmp.validacao = valControl.value
        validacoes.push(tmp);
      });
      tela_tmp.validacoes = validacoes;
      MR.telas.push(tela_tmp);
    });

    return MR;

  }

  mrToDoc(form: FormGroup) {

    this.doc = new Document();
    this.paragraphs = new Array<Paragraph | Table>();
    const MR: MergeRequest = this.getMergeRequest(form);

    const dev = MR.dev;
    const issue = MR.issue;
    const func = MR.func;
    const lean = MR.lean;

    this.addTitulo(func, issue, lean);
    this.addInfo(MR.info);
    this.addSiglas(MR.siglas);
    this.addMassas(MR.massas);
    this.addTelas(MR.telas);



    this.doc.addSection({ children: this.paragraphs })
    Packer.toBlob(this.doc).then((buffer) => {
      saveAs(buffer, this.getFileName(issue, func) + ".docx");
    });

  }

  // private getMassaText(massa: Massa): string {

  //   let tmp: string = "";

  //   if (massa.cpf) {
  //     tmp += "CPF: " + massa.cpf + " ";
  //   }

  //   if (massa.banco) {
  //     tmp += "Banco: " + massa.banco + " ";
  //   }

  //   if (massa.agencia) {
  //     tmp += "Agencia: " + massa.agencia + " ";
  //   }

  //   if (massa.conta) {
  //     tmp += "Conta: " + massa.conta;
  //   }

  //   if (massa.observacao) {
  //     tmp += "Obs: " + massa.observacao + "\n";
  //   }

  //   return tmp;
  // }

  public addTitulo(func: string, issue: number, lean: string) {

    this.paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Lean: " + lean, bold: true, })],
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Issue #" + issue + ": " + func, color: "black" })],
        heading: HeadingLevel.HEADING_2,
        alignment: AlignmentType.CENTER
      }),
      new Paragraph({
        children: [
          new TextRun('').break()]
      })
    )
  }

  public addInfo(info: string): string {

    if (!info) { return; }

    this.paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Infos adicionais", bold: true, color: 'black' })],
        heading: HeadingLevel.HEADING_2,
      }),
      new Paragraph({
        children: [
          new TextRun({ text: info, color: "black" })],
      }),
      new Paragraph({
        children: [
          new TextRun('').break()]
      })
    )
  }


  public addSiglas(siglas: Array<Sigla>) {

    if (siglas.length < 1) { return; }

    this.paragraphs.push(new Paragraph({ children: [new TextRun({ text: "Siglas", bold: true, color: 'black' })], heading: HeadingLevel.HEADING_2 }));
    this.paragraphs.push(new Paragraph({ children: [new TextRun('').break()] }));

    let rows: Array<TableRow> = new Array<TableRow>();

    const margens = { top: 100, bottom: 100, left: 200, right: 200 }
    let header: TableRow = new TableRow({ children: [], tableHeader: true });
    header.addChildElement(new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Usuário', bold: true })], alignment: AlignmentType.CENTER })], margins: margens }))
    header.addChildElement(new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Senha', bold: true })], alignment: AlignmentType.CENTER })], margins: margens }))
    header.addChildElement(new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Observação', bold: true })], alignment: AlignmentType.CENTER })], margins: margens }))
    rows.push(header);


    siglas.forEach(sigla => {
      let row: TableRow = new TableRow({ children: [] });
      row.addChildElement(new TableCell({ children: [new Paragraph({ text: sigla.usuario, alignment: AlignmentType.CENTER })], margins: margens }))
      row.addChildElement(new TableCell({ children: [new Paragraph({ text: sigla.senha, alignment: AlignmentType.CENTER })], margins: margens }))
      row.addChildElement(new TableCell({ children: [new Paragraph({ text: sigla.observacao, alignment: AlignmentType.CENTER })], margins: margens }))
      rows.push(row);
    });


    this.paragraphs.push(new Table({ rows: rows }));
    this.paragraphs.push(new Paragraph({ children: [new TextRun('').break()] }));
  }

  public addMassas(massas: Array<Massa>) {

    if (massas.length < 1) { return; }

    this.paragraphs.push(new Paragraph({ children: [new TextRun({ text: "Massa", bold: true, color: 'black' })], heading: HeadingLevel.HEADING_2 }));
    this.paragraphs.push(new Paragraph({ children: [new TextRun('').break()] }));

    let rows: Array<TableRow> = new Array<TableRow>();

    const margens = { top: 100, bottom: 100, left: 200, right: 200 }
    let header: TableRow = new TableRow({ children: [], tableHeader: true });
    
    massas.forEach(massa => {
      header.addChildElement(new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: massa.titulo, bold: true })], alignment: AlignmentType.CENTER })], margins: margens }))
    });
    rows.push(header);

    let row: TableRow = new TableRow({ children: [] });
    massas.forEach(massa => {
      row.addChildElement(new TableCell({ children: [new Paragraph({ text: massa.valor, alignment: AlignmentType.CENTER })], margins: margens }))
    });
    rows.push(row);

    this.paragraphs.push(new Table({ rows: rows }));
    this.paragraphs.push(new Paragraph({ children: [new TextRun('').break()] }));

  }

  public addTelas(telas: Array<Tela>) {

    if (telas.length < 1) { return; }
    let paragraphsTelas: Paragraph[] = new Array<Paragraph>();
    paragraphsTelas.push(new Paragraph({
      children: [
        new TextRun({ text: "Telas", bold: true, color: 'black' }),
        new TextRun('').break()
      ], heading: HeadingLevel.HEADING_2
    }));

    telas.forEach(tela => {

      paragraphsTelas.push(new Paragraph({
        children: [
          new TextRun({ text: "Tela " + tela.codigo + ": " + tela.titulo, bold: true, color: 'black' })
        ], heading: HeadingLevel.HEADING_3
      })
      );

      let paragraph = new Paragraph({});

      if (tela.observacao) {
        paragraph = new Paragraph({
          children: [
            new TextRun({ text: tela.observacao, italics: true }),
            new TextRun('').break()
          ],
        })
        paragraphsTelas.push(paragraph);
      } else {
        paragraph = new Paragraph(new TextRun('').break());
        paragraphsTelas.push(paragraph);
      };

      tela.validacoes.forEach(validacao => {
        paragraph = new Paragraph(
          {
            text: validacao.validacao,
            bullet: { level: 0 }
          }
        );
        paragraphsTelas.push(paragraph);
      });
      paragraphsTelas[paragraphsTelas.length - 1].addChildElement(new TextRun('').break());
    });
    this.paragraphs = this.paragraphs.concat(paragraphsTelas);

  }

  public getFileName(num: number, func: string): string {
    return "Merge Request - Issue #" + num + " - " + func;
  }
}
