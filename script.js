let campos;
const containerTelefone = document.getElementById('telefones-container');
const containerEmail = document.getElementById('emails-container');
containerEmail.innerHTML = '';
containerTelefone.innerHTML = '';
// -------------------- Máscara e validação de telefone --------------------
function aplicarMascaraTelefone(input) {
    input.addEventListener('input', function (e) {
        let valor = e.target.value.replace(/\D/g, ''); // remove tudo que não for número
        if (valor.length > 11) valor = valor.substring(0, 11); // limita a 11 dígitos (DDD + 9 + 8 números)

        // Coloca o DDD entre parênteses
        if (valor.length > 2) {
            valor = '(' + valor.substring(0, 2) + ') ' + valor.substring(2);
        }

        // Adiciona o espaço após o 9
        if (valor.length > 6) {
            valor = valor.substring(0, 6) + ' ' + valor.substring(6);
        }

        // Adiciona o traço antes dos últimos 4 números
        if (valor.length > 11) {
            valor = valor.substring(0, 11) + '-' + valor.substring(11);
        }

        e.target.value = valor;
    });
}

// Função para remover a máscara e deixar só números
function limparTelefoneFormatado(valorFormatado) {
    return valorFormatado.replace(/\D/g, ''); // remove tudo que não for número
}

// Exemplo de uso no envio do formulário
document.getElementById('meuForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Antes de enviar, pegar todos os campos de telefone e limpar a formatação
    const telefones = document.querySelectorAll('input[name="telefone[]"]');
    telefones.forEach(input => {
        input.value = input.value;
    });

    // Se fosse enviar de verdade:
    // this.submit();
});



function aplicarValidacaoTelefone(input) {
    input.addEventListener('blur', function (e) {
        const valor = e.target.value.replace(/\D/g, '');
        const erro = document.getElementById('erro-telefone');
        if (valor.length !== 11) {
            erro.textContent = "Telefone inválido. Use o formato (DD) 9 XXXX-XXXX";
        } else {
            erro.textContent = "";
        }
    });
}

// -------------------- Validação de e-mail --------------------
function validarEmailComProvedor(input) {
    input.addEventListener('blur', function (e) {
        const valor = e.target.value.trim();
        const erro = document.getElementById('erro-email');

        // Regex para verificar formato de e-mail
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/;
        if (!regex.test(valor)) {
            erro.textContent = "E-mail inválido.";
            return;
        }

        // Lista de provedores conhecidos
        const provedores = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com'];
        const dominio = valor.split('@')[1].toLowerCase();

        if (!provedores.includes(dominio)) {
            erro.textContent = "E-mail válido, mas provedor não reconhecido.";
            camposErro.push("E-mail válido, mas provedor não reconhecido.")
        } else {
            erro.textContent = ""; // Tudo certo
        }
    });
}
// -------------------- Validação de nome/sobrenome --------------------
function validarNome(id, erroId) {
    const input = document.getElementById(id);
    const erro = document.getElementById(erroId);
    input.addEventListener('blur', function () {
        const regex = /^[A-Za-zÀ-ÿ\s]+$/;
        if (!regex.test(input.value.trim())) {
            erro.textContent = "Use apenas letras e espaços.";
        } else {
            erro.textContent = "";
        }
    });
}

validarNome('nome', 'erro-nome');
validarNome('sobrenome', 'erro-sobrenome');

// -------------------- Aplicar validações iniciais --------------------
document.querySelectorAll('input[name="email[]"]').forEach(input => {
    validarEmailComProvedor(input)
});
document.querySelectorAll('input[name="telefone[]"]').forEach(input => {
    aplicarMascaraTelefone(input);
    aplicarValidacaoTelefone(input);
});

// -------------------- Adicionar/Remover campos --------------------
async function addEmail() {

    const div = document.createElement('div');

    const tipoEmail = campos.find(field => field.label === "Email");
    const opcoesDeTipoEmail = tipoEmail.config.settings.possible_types;

    div.className = 'campo-multiplo';

    // Traduz cada tipo
    const traducoes = await Promise.all(opcoesDeTipoEmail.map(tipo => traduzirPalavras([tipo])));

    let optionsHTML = '';
    traducoes.forEach(trad => {
        const t = trad[0]; // traduzirPalavras retorna array de objetos
        if (t.original === "other") {
            optionsHTML += `<option value="${t.original.toLowerCase()}" selected>${t.traduzido}</option>`;
        } else {
            optionsHTML += `<option value="${t.original.toLowerCase()}">${t.traduzido}</option>`;
        }
    });

    // Monta o HTML do campo
    div.innerHTML = `
                <select name="emailTipo[]">
                    ${optionsHTML}
                </select>
                <input type="email" name="email[]" placeholder="Email" />
                <button type="button" id="remove-email" class="remove-btn" onclick="removeCampo(this, 'email')">✖</button>
            `;

    containerEmail.appendChild(div);
    validarEmailComProvedor(div.querySelector('input'));
    // Atualiza botões de remoção
    const botoes = containerEmail.querySelectorAll('.remove-btn');
    botoes.forEach(btn => (btn.disabled = botoes.length === 1));
}


async function addTelefone() {

    const div = document.createElement('div');

    // Pega o campo "Telefone" dentro do array 'campos'
    const tipoTelefone = campos.find(field => field.label === "Telefone");
    const opcoesDeTipoTelefone = tipoTelefone.config.settings.possible_types;

    div.className = 'campo-multiplo';

    // Traduz cada tipo
    const traducoes = await Promise.all(opcoesDeTipoTelefone.map(tipo => traduzirPalavras([tipo])));

    let optionsHTML = '';
    traducoes.forEach(trad => {
        const t = trad[0]; // traduzirPalavras retorna array de objetos
        if (t.original === "other") {
            optionsHTML += `<option value="${t.original.toLowerCase()}" selected>${t.traduzido}</option>`;
        } else {
            optionsHTML += `<option value="${t.original.toLowerCase()}">${t.traduzido}</option>`;
        }
    });

    // Monta o HTML do campo de telefone
    div.innerHTML = `
                <select name="telefoneTipo[]">
                    ${optionsHTML}
                </select>
                <input type="tel" name="telefone[]" placeholder="Telefone" />
                <button type="button" id="remove-telefone" class="remove-btn" onclick="removeCampo(this, 'telefone')">✖</button>
            `;

    containerTelefone.appendChild(div);

    // Aplica as funções utilitárias
    aplicarMascaraTelefone(div.querySelector('input'));
    aplicarValidacaoTelefone(div.querySelector('input'));

    // Atualiza botões de remoção
    const botoes = containerTelefone.querySelectorAll('.remove-btn');
    botoes.forEach(btn => (btn.disabled = botoes.length === 1));
}

function removeCampo(botao, tipo) {
    const container = tipo === 'email'
        ? document.getElementById('emails-container')
        : document.getElementById('telefones-container');

    // Remove o campo
    if (container.children.length > 1) {
        container.removeChild(botao.parentNode);
    }

    // Se sobrou apenas 1 campo, desabilita o botão de remoção dele
    if (container.children.length === 1) {
        const ultimoBotao = container.querySelector('.remove-btn');
        if (ultimoBotao) {
            ultimoBotao.disabled = true;
        }
    }
}

// -------------------- Pikaday - Data de nascimento --------------------
// Inputs da data
const inputVisivel = document.getElementById('nascimento'); // mostra DD/MM/YYYY
const inputISO = document.getElementById('nascimento-iso'); // armazena YYYY-MM-DD 00:00:00

function setDate(date) {
    if (date instanceof Date && !isNaN(date)) {
        // Formato brasileiro no input visível
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        inputVisivel.value = `${day}/${month}/${year}`;

        // Formato americano no campo oculto
        inputISO.value = `${year}-${month}-${day} 00:00:00`;

        // Atualiza a marcação do calendário
        picker.setDate(date, true); // true = evita loop de eventos
    }
}

// Inicializa Pikaday
const picker = new Pikaday({
    field: inputVisivel,
    format: 'DD/MM/YYYY',
    i18n: {
        previousMonth: 'Mês Anterior',
        nextMonth: 'Próximo Mês',
        months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        weekdays: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
        weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    },
    yearRange: [1900, new Date().getFullYear()],
    toString(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    },
    parse(dateString) {
        const [day, month, year] = dateString.split('/').map(Number);
        return new Date(year, month - 1, day);
    },
    onSelect: setDate
});

// Atualização manual pelo input
inputVisivel.addEventListener('input', () => {
    let valor = inputVisivel.value.replace(/\D/g, ''); // remove tudo que não for número

    if (valor.length > 2 && valor.length <= 4) {
        valor = valor.substring(0, 2) + '/' + valor.substring(2);
    } else if (valor.length > 4) {
        valor = valor.substring(0, 2) + '/' + valor.substring(2, 4) + '/' + valor.substring(4, 8);
    }

    inputVisivel.value = valor;

    // Atualiza a marcação no calendário conforme digita
    if (valor.length === 10) { // formato completo DD/MM/YYYY
        const [day, month, year] = valor.split('/').map(Number);
        const date = new Date(year, month - 1, day);

        if (!isNaN(date)) {
            setDate(date); // atualiza os campos e o calendário
        }
    }
});


// -------------------- Validação geral no envio --------------------
document.getElementById('meuForm').addEventListener('submit', function (e) {
    e.preventDefault();
    let valido = true;
    const camposErro = [];

    // Nome e sobrenome
    ['nome', 'sobrenome'].forEach(id => {
        const input = document.getElementById(id);
        const regex = /^[A-Za-zÀ-ÿ\s]+$/;
        if (!regex.test(input.value.trim())) {
            document.getElementById('erro-' + id).textContent = "Campo inválido.";
            valido = false;
            camposErro.push("nome ou Sobrenome Inválido")
        } else {
            document.getElementById('erro-' + id).textContent = "";
        }
    });

    // Email
    document.querySelectorAll('input[name="email[]"]').forEach(input => {
        const valor = input.value.trim();
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/;

        if (!regex.test(valor)) {
            document.getElementById('erro-email').textContent = "E-mail inválido.";
            valido = false;
            camposErro.push("E-mail Inválido");
        } else {
            // Checa provedor
            const provedores = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com'];
            const dominio = valor.split('@')[1].toLowerCase();
            if (!provedores.includes(dominio)) {
                document.getElementById('erro-email').textContent = "E-mail válido, mas provedor não reconhecido.";
                valido = false;
                camposErro.push("E-mail válido, mas provedor não reconhecido.");
            } else {
                document.getElementById('erro-email').textContent = "";
            }
        }
    });


    // Telefone
    document.querySelectorAll('input[name="telefone[]"]').forEach(input => {
        const valor = input.value.replace(/\D/g, '');
        if (valor.length !== 11) {
            document.getElementById('erro-telefone').textContent = "Telefone inválido.";
            valido = false;
            camposErro.push("Telefone Inválido")
        }
    });

    // Data
    if (!inputISO.value) {
        document.getElementById('erro-nascimento').textContent = "Data inválida.";
        valido = false;
        camposErro.push("Data Inválida")
    } else {
        document.getElementById('erro-nascimento').textContent = "";
    }

    // Selects
    ['produto', 'aiesec', 'conheceu'].forEach(id => {
        if (document.getElementById(id).value === "") {
            document.getElementById('erro-' + id).textContent = "Selecione uma opção.";
            valido = false;
            camposErro.push(`Selecione uma opção de ${id}.`)
        } else {
            document.getElementById('erro-' + id).textContent = "";
        }
    });

    // Checkbox
    if (!document.getElementById('politica').checked) {
        document.getElementById('erro-politica').textContent = "Você deve aceitar.";
        valido = false;
        camposErro.push("você de aceitas o termo")
    } else {
        document.getElementById('erro-politica').textContent = "";
    }

    // -------------------- Mostrar dados no alerta --------------------
    if (valido) {
        const nome = document.getElementById('nome').value
        const sobrenome = document.getElementById('sobrenome').value

        const emails = Array.from(document.querySelectorAll('input[name="email[]"]')).map((el, i) => {
            const select = document.querySelectorAll('select[name="emailTipo[]"]')[i];
            const textoTipoOriginal = select.value;
            const textoTipoTraduzido = select.selectedOptions[0].text;
            return {
                email: el.value,
                tipo: textoTipoOriginal,
                tipoTraduzido: textoTipoTraduzido
            };
        });

        const telefones = Array.from(document.querySelectorAll('input[name="telefone[]"]')).map((el, i) => {
            const select = document.querySelectorAll('select[name="telefoneTipo[]"]')[i];
            const textoTipoOriginal = select.value;
            const textoTipoTraduzido = select.selectedOptions[0].text;

            return {
                numero: el.value,
                tipo: textoTipoOriginal,
                tipoTraduzido: textoTipoTraduzido
            };
        });

        const telefonesEnvio = telefones.map(t => ({
            numero: limparTelefoneFormatado(t.numero),
            tipo: t.tipo
        }));

        const emailsEnvio = emails.map(e => ({
            email: e.email,
            tipo: e.tipo
        }))


        const produtoSolicitado = document.getElementById('produto');
        const aiesecProxima = document.getElementById('aiesec');
        const meioDivulgacao = document.getElementById('conheceu');

        const dados = `
        Nome: ${nome}

        Sobrenome: ${sobrenome}

        Emails: ${emails.map((email) => `${email.email} (${email.tipoTraduzido})`).join('\n\t\t')}

        Telefones: ${telefones.map((telefone) => `${telefone.numero} (${telefone.tipoTraduzido})`).join('\n\t\t')}

        Data de Nascimento: ${inputVisivel.value}

        Produto: ${produtoSolicitado.options[produtoSolicitado.selectedIndex].textContent}

        AIESEC: ${aiesecProxima.options[aiesecProxima.selectedIndex].textContent}

        Como conheceu: ${meioDivulgacao.options[meioDivulgacao.selectedIndex].textContent}

        Aceitou Política: Sim`;
        //Mostra os dados no Modal que vai aparecer
        document.getElementById("DadosAqui").textContent = dados;
        const myModal = new bootstrap.Modal(document.getElementById('exampleModalLong'));
        myModal.show();

        const botaoConfirmar = document.getElementById("botaoConfirmar");

        //Se o usuário clicar em Confirmar, vai para a função da lógica de envio
        botaoConfirmar.addEventListener("click", function (e) {

            const tituloModal = document.getElementById("exampleModalLongTitle");

            const botaoRemover = document.getElementById("botaoCancelar");
            botaoRemover.style.display = 'none';

            document.getElementById("DadosAqui").textContent = "Entraremos em contato em breve!";
            tituloModal.textContent = "Dados enviados com sucesso!"

            botaoConfirmar.textContent = "Ok"

            //Caso a pessoa click em OK, recarrega a página e reseta o forms
            botaoConfirmar.addEventListener("click", function (e) {

                forms = document.getElementById("meuForm");
                forms.reset();
                location.reload();
            });

            const botaoFechar = document.getElementById("botaoFechar");
            botaoFechar.addEventListener("click", function (e) {

                forms = document.getElementById("meuForm");
                forms.reset();
                location.reload();
            });

            // this.submit(); // Removido para simular envio sem recarregar a página

        })


    } else {
        //Mostra os dados no Modal que vai aparecer
        document.getElementById("DadosAqui").textContent = `Informação Incorreta

        Por favor, corrija os erros e tente novamente.
        ${camposErro.map(campo => `- ${campo}`).join('\n')}`;
        const myModal = new bootstrap.Modal(document.getElementById('exampleModalLong'));
        myModal.show();
    }
});



// Função genérica para traduzir palavras usando LibreTranslate
async function traduzirPalavras(palavras) {
    // 1. Tabela interna de termos comuns (manual, sem JSON externo)
    const dicionarioBase = {
        home: "Casa",
        main: "Principal",
        mobile: "Celular",
        other: "Outro",
        private_fax: "Fax Privado",
        work: "Trabalho",
        work_fax: "Fax do Trabalho"
    };

    // 2. Traduz cada palavra
    const traducao = palavras.map(palavra => {
        const limpa = palavra.toLowerCase().trim();
        // tenta tradução direta
        if (dicionarioBase[limpa]) {
            return { original: palavra, traduzido: dicionarioBase[limpa] };
        }
        // caso não ache, tenta deduzir algo
        if (limpa.includes('fax')) return { original: palavra, traduzido: 'Fax' };
        if (limpa.includes('phone')) return { original: palavra, traduzido: 'Telefone' };
        // fallback
        return { original: palavra, traduzido: palavra };
    });

    return traducao;
}





async function preencherDropdown() {


    //__________________________________________BOTÃO PRODUTO____________________________________________________

    // Cria o menu suspenso
    const dropdown = document.getElementById('produto');
    dropdown.innerHTML = '';
    dropdown.setAttribute("disabled", "")

    // Cria um botão com a frase "Carregando" enquanto o Menu Suspenso está desativado
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Carregando';
    dropdown.appendChild(defaultOption);

    defaultOption.setAttribute('disabled', '');
    defaultOption.setAttribute('selected', '');

    //____________________________________________________________________________________________________


    //__________________________________BOTÃO AIESEC MAIS PRÓXIMA_______________________________________

    // Cria o menu suspenso
    const dropdown_AiesecProx = document.getElementById('aiesec');
    dropdown_AiesecProx.innerHTML = '';
    dropdown_AiesecProx.setAttribute("disabled", "")

    // Cria um botão com a frase "Carregando" enquanto o Menu Suspenso está desativado
    const defaultOption_AiesecProx = document.createElement('option');
    defaultOption_AiesecProx.value = '';
    defaultOption_AiesecProx.textContent = 'Carregando';
    dropdown_AiesecProx.appendChild(defaultOption_AiesecProx);

    defaultOption_AiesecProx.setAttribute('disabled', '');
    defaultOption_AiesecProx.setAttribute('selected', '');

    //________________________________________________________________________________________________


    //___________________________BOTÃO COMO CONHECEU A AIESEC_________________________________________

    // Cria o menu suspenso
    const dropdown_Como_Conheceu = document.getElementById('conheceu');
    dropdown_Como_Conheceu.innerHTML = '';
    dropdown_Como_Conheceu.setAttribute("disabled", "")

    // Cria um botão com a frase "Carregando" enquanto o Menu Suspenso está desativado
    const defaultOption_Como_Conheceu = document.createElement('option');
    defaultOption_Como_Conheceu.value = '';
    defaultOption_Como_Conheceu.textContent = 'Carregando';
    dropdown_Como_Conheceu.appendChild(defaultOption_Como_Conheceu);

    defaultOption_Como_Conheceu.setAttribute('disabled', '');
    defaultOption_Como_Conheceu.setAttribute('selected', '');

    //_________________________________________________________________________________________________

    const url = 'https://baziaiesec.pythonanywhere.com/metadados-card';

    try {

        const response = await fetch(url);
        const data = await response.json();

        // Verificação de segurança mais completa
        campos = data?.data?.fields;

        //Verfica se o dado campos é não nulo
        if (!campos) {
            console.error("A comunicação não foi corretamente estabelecida. Recarregue a página");
            return;
        }
        addEmail();
        addTelefone();


        //____________________________Lógica Produtos_____________________________________________________

        // Encontra os produtos dentro dos objetos retornado pela API
        const produtos = campos.find(field => field.label === "Produto");
        const opcoesDeProduto = produtos.config.settings.options;

        // Colocando todos os produtos em uma variável chamada todosProdutos
        // A função reduce serve para fazer chamada recursiva de uma função em todos os elementos do array
        var todosProdutos = opcoesDeProduto.reduce(
            function (prev, curr) {

                if (curr.status == "active") {

                    return [...prev, { id: curr.id, text: curr.text }];
                }

                return [...prev]

            },
            []
        )

        const siglaProduto = ["gv", "gta", "gte"]
        const parametros = await ParamentroURL();
        const indiceSigla = siglaProduto.indexOf(parametros.tipoIntercambio);

        todosProdutos.forEach((produto, index) => {
            const newOption = document.createElement("option");
            newOption.value = produto.id;
            newOption.textContent = produto.text;

            // Se o índice da sigla for igual ao índice do produto
            if (index === indiceSigla) {
                newOption.selected = true;
            }

            dropdown.appendChild(newOption);
        });

        // Quando todas as opções estiverem prontas o botão se tranforma em "Selecione" e 
        // ativa o Menu Suspenso novamente
        defaultOption.textContent = "Selecione";
        dropdown.removeAttribute("disabled");

        //________________________________________________________________________________________________


        //____________________________Lógica Aiesec Mais Próxima__________________________________________

        const aiesecProx = campos.find(field => field.label === "Qual é a AIESEC mais próxima de você?");
        const aiesecs = aiesecProx.config.settings.options;


        var todasAiesecs = aiesecs.reduce(
            function (prev, curr) {

                if (curr.status == "active") {
                    return [...prev, { id: curr.id, text: curr.text }];
                }

                return [...prev]

            },
            []
        )
        const escritorios = [
            "AB",  // ABC
            "AJ",  // ARACAJU
            "BA",  // Bauru
            "BH",  // BELO HORIZONTE
            "BS",  // BRASÍLIA
            "CT",  // CURITIBA
            "FL",  // FLORIANÓPOLIS
            "FR",  // FRANCA
            "FO",  // FORTALEZA
            "JP",  // JOÃO PESSOA
            "LM",  // LIMEIRA
            "MZ",  // MACEIÓ
            "MN",  // MANAUS
            "MA",  // MARINGÁ
            "PA",  // PORTO ALEGRE
            "RC",  // RECIFE
            "RJ",  // RIO DE JANEIRO
            "SS",  // SALVADOR
            "SM",  // SANTA MARIA
            "GV",  // SÃO PAULO UNIDADE GETÚLIO VARGAS
            "MK",  // SÃO PAULO UNIDADE MACKENZIE
            "US",  // SÃO PAULO UNIDADE USP
            "SO",  // SOROCABA
            "UB",  // UBERLÂNDIA
            "VT",  // VITÓRIA
            "MC" // BRASIL (NACIONAL)
        ];
        const indiceSiglaCL = escritorios.indexOf(parametros.cl);
        todasAiesecs.forEach((aiesec, index) => {
            const newOption = document.createElement('option');
            newOption.value = aiesec.id;
            newOption.textContent = aiesec.text;
            // Se o índice da sigla for igual ao índice do produto
            if (index === indiceSiglaCL) {
                newOption.selected = true;
            }
            dropdown_AiesecProx.appendChild(newOption);
        });

        // Quando todas as opções estiverem prontas o botão se tranforma em "Selecione" e 
        // ativa o Menu Suspenso novamente
        defaultOption_AiesecProx.textContent = "Selecione";
        dropdown_AiesecProx.removeAttribute("disabled");


        //________________________________________________________________________________________________


        //______________________Lógica Como conheceu a AIESEC______________________________________________


        const comoConheceu = campos.find(field => field.label === "Como você conheceu a AIESEC?");
        const opçoes_Como_Conheceu = comoConheceu.config.settings.options;


        var todasOpcoes_Como_Conheceu = opçoes_Como_Conheceu.reduce(
            function (prev, curr) {

                if (curr.status == "active") {
                    return [...prev, { id: curr.id, text: curr.text }];
                }

                return [...prev]

            },
            []
        )
        function slugify(texto) {
            return texto
                .toLowerCase()                      // tudo minúsculo
                .normalize("NFD")                   // separa acentos
                .replace(/[\u0300-\u036f]/g, "")    // remove acentos
                .replace(/[^a-z0-9 -]/g, "")        // mantém hífen, remove outros especiais
                .trim()                              // remove espaços no início/fim
                .replace(/\s+/g, "-")               // substitui espaços por hífen
                .replace(/-+/g, "-");               // remove múltiplos hífens consecutivos
        }


        const listaAnuncio = todasOpcoes_Como_Conheceu.map(opcoes => slugify(opcoes.text));
        const indiceComoConheceuAiesec = listaAnuncio.indexOf(parametros.anuncio);
        console.log(listaAnuncio)
        todasOpcoes_Como_Conheceu.forEach((opcoes, index) => {
            const newOption = document.createElement('option');
            newOption.value = opcoes.id;
            newOption.textContent = opcoes.text;
            if (index === indiceComoConheceuAiesec) {
                newOption.selected = true;
            }
            dropdown_Como_Conheceu.appendChild(newOption);
        });

        // Quando todas as opções estiverem prontas o botão se tranforma em "Selecione" e 
        // ativa o Menu Suspenso novamente
        defaultOption_Como_Conheceu.textContent = "Selecione";
        dropdown_Como_Conheceu.removeAttribute("disabled");





        const tipoAnuncio = campos.find(field => field.label === "Como?");
        const opçoes_Tipo_Anuncio = tipoAnuncio.config.settings.options;

        var todasopçoes_Tipo_Anuncio = opçoes_Tipo_Anuncio.reduce(
            function (prev, curr) {

                if (curr.status == "active") {
                    return [...prev, { id: curr.id, text: curr.text }];
                }

                return [...prev]

            },
            []
        )

        const listaFormaAnuncio = todasopçoes_Tipo_Anuncio.map(opcoes => slugify(opcoes.text));
        const indiceFormaAnuncio = listaFormaAnuncio.indexOf(parametros.formaAnuncio);
        const idFormaAnuncio = todasopçoes_Tipo_Anuncio.filter(opcoes => opcoes.id == indiceFormaAnuncio).map(opcoes => opcoes.text);
        console.log(listaFormaAnuncio)




    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
}

async function ParamentroURL() {
    const params = new URLSearchParams(window.location.search);

    const cl = (params.get("utm_term") || "").toUpperCase();
    const tipoIntercambio = (params.get("utm_content") || "").toLowerCase();
    const campanha = decodeURIComponent(params.get("utm_campaign") || "");
    const anuncio = (params.get("utm_source") || "").toLowerCase();
    const formaAnuncio = (params.get("utm_medium") || "").toLowerCase();

    return {
        cl,
        tipoIntercambio,
        campanha,
        anuncio,
        formaAnuncio,
    };
}

preencherDropdown();