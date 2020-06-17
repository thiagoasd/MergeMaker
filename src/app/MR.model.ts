export class MergeRequest {
    issue: number = 0;
    dev: string = '';
    func: string = '';
    lean: string = '';
    info: string = '';
    massas: Array<Massa> = new Array<Massa>();
    siglas: Array<Sigla> = new Array<Sigla>();
    telas: Array<Tela> = new Array<Tela>();
}

export class Massa {
    cpf: string;
    banco: string;
    agencia: string;
    conta: string;
    observacao: string;
}


export class Sigla {
    usuario: string;
    senha: string;
    observacao: string;
}


export class Tela {
    codigo: string;
    titulo: string;
    observacao: string;
    validacoes: Array<Validacao> = new Array<Validacao>();
}

export class Validacao {
    validacao: string;
}