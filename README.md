# :pencil2: Tascom Editor

Este projeto foi desenvolvido com o objetivo de permitir ao usuário confeccionar e gerenciar seus documentos eletrônicos.

O acesso a criação dos documentos é liberado por sistema. Cada sistema terá um registro no banco de dados e este registro estará vinculado aos documentos. Dessa forma cada sistema terá acesso apenas aos seus documentos.

Os dados dos documentos poderão ser manipulados através de uma API RESTfull. Cada sistema terá uma usuário que será utilizado para se autenticar na interface e/ou api do Tascom Editor.

## Tipos de Campos

A seguir, estão descrito os tipos de campos que o Tascom Editor suporta no momento:

### Text

Campo de input simples de texto. Deve ser utilizados para textos curtos, de no máximo 1 linha.

_Ex: Nome do paciente, Diagnóstico, Nome da empresa..._

### Number

Campo de input de número. Utilizado para inserir dados numéricos.

_Ex: Idade, Dias de internação, Peso, Altura..._

### Textarea

Campo de input de textos longos. Utilizado para inserção de textos extensos, com mais de 1 linha.

_Ex: Observações, Conduta, Cuidados, Justificativas..._

### Date

Campo de input de datas.

_Ex: Data de nascimento, Data de internação, Data de óbito..._

### Label

Elemento de exibição de texto. Não tem nenhuma iteração com o usuário, permite apenas escrever um texto com uma ou mais linhas.

_Ex: Avisos, Orientações, Dicas..._

### Checkbox

Campo de multipla escolha.

_Ex: Comorbidades..._

### Radio

Campo de escolha única.

_Ex: Sexo, Estado Civil, Sim ou Não..._

### Select

Campo de opções pré-definidas. O usuário poderá limitar as opções que o usuário poderá selecionar.

_Ex: Cid, Tipo de Ocupação, Tipo do Atendimento..._

---

## Rotas

---

## Banco de Dados

O Tascom Editor trabalha com o MongoBD, um banco não relacional basedo em documentos. A baixo, seguem os exemplo das collections que compõem o banco de dados:

### system

Armazena os dados do sistema que irá utilizar o Tascom Editor.

```json
{
    "_id": 1,
    "name": "APS",
    "tag": "aps",
    "companies": [1, 2, 3],
    "active": true
}
```

| Campo     | Descrição                                                      |
| :-------- | :------------------------------------------------------------- |
| \_id      | Código único para o registro                                   |
| name      | Nome do sistema                                                |
| tag       | Abreviação do sistema                                          |
| companies | Códigos da empresas caso o sistema trabalhe com multi-empresas |
| active    | Informa se o sistema está ativo                                |

### documents

Armazena os documentos e toda a sua estrutura, estilo, campos e configurações.

```json
{
    "_id": 1,
    "name": "Ficha Inicial",
    "system_id": 1,
    "company_id": 2,
    "active": true,
    "created_at": "2022-01-01T00:00:00-03:00",
    "updated_at": "2022-01-01T00:00:00-03:00",
    "version": 1,
    "pages": 2,
    "size": {
        "width": 800,
        "height": 1000
    },
    "versions": [
        {
            "number": 1,
            "created_at": "2022-01-01T00:00:00-03:00",
            "updated_at": "2022-01-01T00:00:00-03:00",
            "fields": [
                {
                    "_id": "99ce7ff0-b150-11ec-98b2-7592572f6de7",
                    "label": "Nome",
                    "placeholder": "Texto",
                    "type": "text",
                    "position": {
                        "x": 0,
                        "y": 0
                    },
                    "size": {
                        "width": "428px",
                        "height": "80px"
                    },
                    "styles": {
                        "fontSize": 14,
                        "color": "#fff",
                        "borderRadius": 5
                    },
                    "required": false,
                    "useRichText": true
                },
                {
                    "_id": "0de74290-b15c-11ec-8a81-8f0dbfe5d20b",
                    "label": "Atendimento",
                    "placeholder": "Texto",
                    "type": "text",
                    "position": {
                        "x": 435,
                        "y": 0
                    },
                    "size": {
                        "width": "173px",
                        "height": "80px"
                    },
                    "styles": {
                        "fontSize": 14,
                        "color": "#fff",
                        "borderRadius": 5
                    },
                    "required": false
                },
                {
                    "_id": "18582460-b15c-11ec-8a81-8f0dbfe5d20b",
                    "label": "Descricao",
                    "placeholder": "Caixa de texto",
                    "type": "textarea",
                    "position": {
                        "x": 0,
                        "y": 90
                    },
                    "size": {
                        "width": "800px",
                        "height": "125px"
                    },
                    "styles": {
                        "fontSize": 14,
                        "color": "#fff",
                        "borderRadius": 5
                    },
                    "required": false
                },
                {
                    "_id": "217e5dc0-b15c-11ec-8a81-8f0dbfe5d20b",
                    "label": "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facilis magni ipsum nostrum. Reiciendis odio harum quas perferendis architecto ipsum voluptatum unde nihil placeat voluptates impedit, ducimus nulla! Eaque, hic nisi?",
                    "placeholder": "Rótulo",
                    "type": "label",
                    "position": {
                        "x": 0,
                        "y": 220
                    },
                    "size": {
                        "width": "800px",
                        "height": "85px"
                    },
                    "styles": {
                        "fontSize": 14,
                        "color": "#fff",
                        "borderRadius": 5
                    },
                    "required": false
                },
                {
                    "_id": "4b9cfd50-b15c-11ec-8a81-8f0dbfe5d20b",
                    "label": "Data de nascimento",
                    "placeholder": "Data",
                    "type": "date",
                    "position": {
                        "x": 620,
                        "y": 0
                    },
                    "size": {
                        "width": "180px",
                        "height": "80px"
                    },
                    "styles": {
                        "fontSize": 14,
                        "color": "#fff",
                        "borderRadius": 5
                    },
                    "required": false
                },
                {
                    "_id": "aadb9e70-b15c-11ec-8a81-8f0dbfe5d20b",
                    "label": "Diagnostico",
                    "placeholder": "Texto",
                    "type": "text",
                    "position": {
                        "x": 0,
                        "y": 316
                    },
                    "size": {
                        "width": "800px",
                        "height": "80px"
                    },
                    "styles": {
                        "fontSize": 14,
                        "color": "#fff",
                        "borderRadius": 5
                    },
                    "required": false
                },
                {
                    "_id": "5482cd80-bb7c-11ec-9550-95871a6fb583",
                    "label": "Pergunta?",
                    "type": "yesOrNot",
                    "position": {
                        "x": 438,
                        "y": 777
                    },
                    "size": {
                        "width": 155,
                        "height": 50
                    },
                    "styles": {},
                    "required": false,
                    "useRichText": false
                },
                {
                    "_id": "ae67c210-bb86-11ec-a204-e1cd46e40a27",
                    "label": "Teste 1",
                    "type": "checkbox",
                    "position": {
                        "x": 0,
                        "y": 1087
                    },
                    "size": {
                        "width": 135,
                        "height": 50
                    },
                    "styles": {},
                    "required": false,
                    "useRichText": false
                },
                {
                    "_id": "b45bf560-bb86-11ec-a204-e1cd46e40a27",
                    "label": "Teste 2",
                    "type": "checkbox",
                    "position": {
                        "x": 0,
                        "y": 1133
                    },
                    "size": {
                        "width": 136,
                        "height": 50
                    },
                    "styles": {},
                    "required": false,
                    "useRichText": false
                },
                {
                    "_id": "4cdb6e20-bb8b-11ec-aa51-c79594e9c0b3",
                    "label": "Radio",
                    "type": "radio",
                    "position": {
                        "x": 151,
                        "y": 1087
                    },
                    "size": {
                        "width": 649,
                        "height": 53
                    },
                    "styles": {},
                    "required": false,
                    "useRichText": false,
                    "options": [
                        {
                            "label": "Opção 12",
                            "value": "1"
                        },
                        {
                            "label": "Opção 23",
                            "value": "2"
                        },
                        {
                            "label": "Opção 34",
                            "value": "3"
                        },
                        {
                            "label": "Opção 45",
                            "value": "4"
                        },
                        {
                            "label": "Opção 56",
                            "value": "5"
                        }
                    ],
                    "orientation": "row"
                },
                {
                    "_id": "e51d83e0-bf6d-11ec-be87-6dee43b2c900",
                    "label": "Tipo de alta",
                    "type": "select",
                    "tag": "select-tipo-alta",
                    "position": {
                        "x": 0,
                        "y": 1200
                    },
                    "size": {
                        "width": 800,
                        "height": 52
                    },
                    "options": [
                        {
                            "label": "Médica",
                            "value": "1"
                        },
                        {
                            "label": "A pedido",
                            "value": "2"
                        },
                        {
                            "label": "Após procedimento",
                            "value": "3"
                        },
                        {
                            "label": "Óbito",
                            "value": "4"
                        }
                    ],
                    "styles": {},
                    "required": false,
                    "useRichText": false
                }
            ],
            "status": "published",
            "publised_at": "2022-01-01T00:00:00-03:00",
            "active": true
        }
    ]
}
```

### documents_completed

Armazena os dados preenchidos nos documentos.

```json
{
    "_id": 1,
    "document_id": 1,
    "system_id": 1,
    "company_id": 1,
    "version": 1,
    "fields": [
        {
            "_id": "99ce7ff0-b150-11ec-98b2-7592572f6de7",
            "label": "Nome",
            "placeholder": "Texto",
            "type": "text",
            "value": "Heytor"
        },
        {
            "_id": "0de74290-b15c-11ec-8a81-8f0dbfe5d20b",
            "label": "Atendimento",
            "placeholder": "Texto",
            "type": "text",
            "value": "1234567"
        },
        {
            "_id": "4b9cfd50-b15c-11ec-8a81-8f0dbfe5d20b",
            "label": "Data de nascimento",
            "placeholder": "Data",
            "type": "date",
            "value": "2020-12-21"
        },
        {
            "_id": "aadb9e70-b15c-11ec-8a81-8f0dbfe5d20b",
            "label": "Diagnostico",
            "placeholder": "Texto",
            "type": "text",
            "value": "A90 - Dengue"
        },
        {
            "field_id": "18582460-b15c-11ec-8a81-8f0dbfe5d20b",
            "label": "Descricao",
            "placeholder": "Caixa de texto",
            "type": "textarea",
            "value": "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facilis magni ipsum nostrum. Reiciendis odio harum quas perferendis architecto ipsum voluptatum unde nihil placeat voluptates impedit, ducimus nulla! Eaque, hic nisi?"
        }
    ],
    "status": "canceled",
    "created_by": 1,
    "created_at": "2022-01-01T00:00:00-03:00",
    "canceled_by": 1,
    "canceled_at": "2022-01-01T00:00:00-03:00"
}
```

---

# TODO

## Backend

- ⬜ Autenticação JWT
- Rotas
  - Autenticação
    - ⬜ Gerar token
    - ⬜ Validar token
    - ⬜ Autenticar usuario
  - ⬜ CRUD Usuários
  - ⬜ CRUD Sistema
  - CRUD Estrutura Documento
    - ⬜ Versionamento
    - ⬜ API para retorno dos campos
    - ⬜ Validação dos tipos dos campos
    - ⬜ Impressão do documento
  - ⬜ CRUD Preenchimento Documento

## Frontend

- ⬜ Autenticação
- ⬜ Permissões
- ⬜ Menu
- (CRUD) Lista, formulários e visualização:
  - ⬜ Usuários
  - ⬜ Sistemas
  - ✅ Estrutura do Documento
    - ✅ Alterar nome do documento
    - ✅ Publicar documento
    - ✅ Desativar documento
    - ✅ Listar versões do documento
    - ✅ Visualizar versões anteriores
    - ✅ Iniciar uma nova versão com status de 'building' ao salvar o documento
    - ✅ Exibir última data/hora que foi salvo
    - ✅ Carregar a versão com o status de 'building' se tiver, se não, carregar a atual
    - ✅ Excluir versão em construção do documento
    - ✅ Criar versão a partir de uma versão antiga selecionada
    - ✅ Publicar ou excluir somente versões com status 'building'
    - ✅ Ao criar um campo, adiciona-lo em uma posição x e y que o usuário possa ver em tela
    - ✅ Comparar estados do documento que está sendo preenchido e o salvo no banco para verificar se existem alterações não salvas
  - ⬜ Preenchimento do Documento
    - ✅ Tela para preenchimento do documento
    - ✅ Salvar
    - ✅ Concluir
    - ✅ Cancelar
    - ✅ Exibir para preenchimento o documento da versão atual (com status de 'published')
    - ✅ Adaptar preenchimento do documento baseado na versão atual
    - ✅ Adicionar verificação de documento em preenchimento e não permitir criar um novo até que documento em uso seja concluído ou excluído
    - ✅ Adaptação do layout para tablets
    - ⬜ Impressão do documento (Deixar responsabilidade para o back)
    - ✅ Tela integrada para preenchimento do documento por sistemas externos
    - ✅ Validações dos campos do documento
- ⬜ Incluir debounce nos campos de pesquisa
- ⬜ Incluir loading quando o backend estiver funcionando
- ✅ Incluir componentes de feedback (toasts e messages)
- ⬜ Armazenar a última página antes de deslogar por sessão expirada
