# Cents - Relatório de Desenvolvimento

Bem-vindo à documentação do Cents!

Encontras aqui os detalhes sobre o Cents, desde uma visão de alto nível até às decisões de implementação de baixo nível, num relatório de desenvolvimento de software organizado por tipo de atividade:


- [Como Correr a Aplicação](#como-correr-a-aplicação)
- [Modelação de Negócio](#modelação-de-negócio)
  - [Visão do Produto](#visão-do-produto)
  - [Funcionalidades e Pressupostos](#funcionalidades-e-pressupostos)
- [Requisitos](#requisitos)
  - [User Stories](#user-stories)
  - [Modelo de Domínio](#modelo-de-domínio)
- [Arquitetura e Design](#arquitetura-e-design)
  - [Arquitetura Lógica](#arquitetura-lógica)
  - [Arquitetura Física](#arquitetura-física)
  - [Protótipo Vertical](#protótipo-vertical)
- [Validação de Requisitos](#validação-de-requisitos)
- [Gestão do Projeto](#gestão-do-projeto)
  - [Sprint 0](#sprint-0)
  - [Sprint 1](#sprint-1)
  - [Sprint 2](#sprint-2)
  - [Sprint 3](#sprint-3)
  - [Entrega Final](#entrega-final)

As contribuições são esperadas exclusivamente pela equipa inicial, mas poderemos abri-las à comunidade após o curso, em todas as áreas e tópicos: requisitos, tecnologias, desenvolvimento, experimentação, testes, etc...

Entre em contacto connosco!

Obrigado!

---

## Membros da Equipa

| Nome | Email |
| ---- | ----- |
| Pedro Cunha Gonçalves de Melo | up202406050@edu.fe.up.pt |
| Daniel Filipe Cidade de Azeredo Lobo | up202306056@edu.fe.up.pt |
| Luís Miguel Branco Sampaio Costa | up202404078@edu.fe.up.pt |
| José Dinis Rocha Melo Maçorano dos Santos | up202405578@edu.fe.up.pt |
| Afonso Sofia de Moura | up202403939@edu.fe.up.pt |
---

## Como Correr a Aplicação

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão LTS recomendada)
- [Expo Go](https://expo.dev/go) instalado no dispositivo móvel (iOS ou Android)

### Instalação

```bash
# Clonar o repositório
git clone <url-do-repositório>
cd <pasta-do-projeto>

# Instalar dependências
npm install
```

### Execução

```bash
# Iniciar em modo Expo Go
npx expo start --go

# Limpar cache (caso necessário, recomendado em caso de erros inesperados)
npx expo start --go -c
```

Após iniciar, abre a aplicação **Expo Go** no teu dispositivo e lê o QR code exibido no terminal.

### Build Local com EAS

    Instalar o EAS CLI globalmente:
    Bash

    npm install -g eas-cli

    Fazer login na conta da Expo:
    Bash

    eas login

3. **Executar o build localmente**:
   - Para **Android** (Gera um ficheiro `.apk`):
     ```bash
     eas build --profile development --platform android --local
     ```
   - Para **iOS** (Requer macOS com Xcode instalado; gera um build para Simulador):

     ```bash
     eas build --profile development --platform ios --local

     ```

Nota: A compilação de builds locais exige o ambiente de desenvolvimento mobile respetivo esteja configurado (ex: Android Studio para builds Android).

---

## Modelação de Negócio

### Visão do Produto

O Cents é uma aplicação focada em simplificar, organizar e otimizar as compras de supermercado do consumidor final. O seu principal objetivo é permitir que o utilizador pesquise produtos de forma intuitiva, os adicione a uma lista e descubra rapidamente as opções mais económicas.

Quer o utilizador prefira a máxima poupança (combinando compras em várias lojas diferentes) ou a conveniência (comprando tudo num só supermercado), a aplicação adapta-se através de ferramentas de filtragem inteligentes. Além da poupança, o Cents traz valor real durante a ida ao supermercado, oferecendo uma checklist interativa que facilita o acompanhamento dos produtos já recolhidos, garantindo uma experiência de compras mais rápida e sem esquecimentos.

### Funcionalidades e Pressupostos

**Funcionalidades**

**Pesquisa de Produtos por Categoria** - Exploração e adição de produtos à lista de compras organizados pelas respetivas categorias.

**Otimização de Preços (Toggle Mix/Loja Única)** - Na aba da lista de compras, o utilizador pode alternar entre ver o "melhor preço absoluto" (um mix de produtos em diferentes lojas) ou restringir a lista para ver apenas os produtos de uma loja específica.

**Checklist Interativa de Compras** - Modo de visualização desenhado para o momento da compra. Ao clicar num produto da lista, este é "riscado", a sua cor muda para cinzento e é movido para o fim da lista. Se o carrinho for esvaziado, o ecrã adapta-se apresentando um estado de "Lista vazia".

**Pesquisa de Supermercados e Horários** - Descoberta de supermercados próximos com base na localização atual do GPS do utilizador ou através de uma localização introduzida manualmente (suportada pela API do Photon). Os resultados incluem a apresentação dos horários de funcionamento de cada loja.

**Sistema de Utilizadores (Conta vs. Convidado)** - A aplicação pode ser explorada como convidado ou através da criação de uma conta de utilizador para acesso a funcionalidades extra.

**Sincronização na Cloud** - Para utilizadores com conta registada, a sua lista de compras sincroniza automaticamente em tempo real com a base de dados (Firestore), permitindo não perder os dados.

**Gestão de Conta Segura** - Sistema de recuperação de conta através do envio de e-mails. Na funcionalidade de alteração de e-mail da conta, é enviado um e-mail de verificação para o novo endereço, obrigando à confirmação da sua existência antes de efetivar a mudança.

**Personalização da Interface (Dark/Light Mode)** - Suporte nativo para modo claro e modo escuro, adaptando-se às preferências do utilizador.

**Pressupostos**

- A aplicação utiliza o Firebase como infraestrutura principal para os serviços de Autenticação (Auth) e Base de Dados em tempo real (Firestore).
- Atualmente, todos os produtos, os supermercados disponíveis e os seus respetivos horários de funcionamento presentes no Firestore são dados simulados (mocks) para efeitos de prova de conceito e demonstração de funcionamento.
- A pesquisa e conversão de localizações personalizadas inseridas pelo utilizador dependem do serviço externo da API do Photon.
- Assume-se que o utilizador necessita de uma ligação ativa à internet para sincronizar a lista na cloud, pesquisar supermercados noutras localizações e efetuar login/alteração de credenciais.

---

## Happiness Meters

<p align="center">
  <img src="docs/happinessMeters/happiness.png"/>
</p>

---

## Requisitos

### User Stories

As user stories foram criadas e geridas no [GitHub Projects](https://github.com/orgs/FEUP-LEIC-ES-2025-26/projects). Segue-se um resumo das histórias identificadas:

Autenticação e Gestão de Conta

- Enquanto utilizador, quero ser recebido por um ecrã inicial claro, com opções fáceis para entrar com conta ou aceder como convidado.
- Enquanto utilizador não registado, quero criar uma conta na aplicação, de modo a guardar e sincronizar a minha lista de compras.
- Enquanto utilizador registado, quero fazer login na aplicação, de modo a ter acesso à minha informação guardada.
- Enquanto utilizador registado, quero ter acesso a uma aba de conta para visualizar o meu perfil (nome e foto).
- Enquanto utilizador registado, quero conseguir recuperar a minha palavra-passe e alterar o meu e-mail de forma segura, para garantir o acesso e a segurança da minha conta.

Supermercados e Localização

- Enquanto utilizador, quero pesquisar supermercados perto de mim usando a minha localização atual ou uma localização que eu defina manualmente.
- Enquanto utilizador, quero filtrar a lista de supermercados pela distância e verificar se estão abertos agora.
- Enquanto utilizador, quero consultar o horário de funcionamento dos supermercados para conseguir planear as minhas compras.

Produtos e Lista de Compras (Carrinho)

- Enquanto utilizador, quero conseguir pesquisar e explorar produtos organizados por uma dada categoria.
- Enquanto utilizador, quero adicionar produtos à minha lista de compras e gerir as suas quantidades num ecrã dedicado.
- Enquanto utilizador, quero visualizar os dados básicos do produto e comparar os seus preços em diferentes supermercados.
- Enquanto utilizador, quero escolher na minha lista de compras entre a opção de "melhor preço absoluto" (mix de supermercados) ou restringir os produtos a uma loja específica.
- Enquanto utilizador, quero uma checklist interativa dos produtos que vou comprar (onde os itens clicados ficam riscados, a cinzento, e movem-se para o fundo), para me organizar melhor durante as compras na loja.

Personalização

- Enquanto utilizador, quero escolher o tema da aplicação (modo claro e escuro), para que a interface se ajuste às minhas preferências.

### Modelo de Domínio

<p align="center">
  <img src="docs/domain/domain_model.png"/>
</p>

O modelo de domínio é composto por 13 classes que representam os conceitos centrais do sistema. A entidade principal é o `UtilizadorRegistado`, que possui um `Carrinho` com `ItemCarrinho` e `Produtos`, uma lista de `Favoritos`, `CarrinhosFavoritos` e `HistoricoCarrinho`. Os `Supermercados` têm `Localizacao`, `Horarios` e praticam preços via `PrecoProduto`. O `UtilizadorAnonimo` pode usar o `Carrinho`, mas não tem acesso a funcionalidades exclusivas de utilizadores registados.

Para mais detalhes: [Modelo de Domínio PDF](docs/domain/domain_model.pdf)

---

## Arquitetura e Design

A arquitetura da aplicação segue uma organização em camadas, separando a interface do utilizador da lógica de negócio. A camada de apresentação é composta por ecrãs e componentes reutilizáveis, enquanto a lógica da aplicação é gerida por hooks e constantes partilhadas. Esta separação facilita a manutenção e evolução do código ao longo do projeto.

### Arquitetura Lógica

<p align="center">
  <img src="docs/architecture/package_diagram.png"/>
</p>

A arquitetura lógica organiza o sistema em quatro camadas: Presentation (Navigation, Screens, Components), Logic (Hooks, Utils), Data (Firebase Config, Constants) e External Services (Firebase Firestore, expo-location, Firebase Auth). Os ecrãs utilizam os componentes e hooks, os hooks utilizam utils e acedem ao Firebase e ao GPS.

Para mais detalhes: [Diagrama de Pacotes PDF](docs/architecture/package_diagram.pdf)

### Arquitetura Física

<p align="center">
  <img src="docs/architecture/deployment_diagram.png"/>
</p>

A aplicação corre num dispositivo móvel (iOS/Android) em React Native com Expo, comunicando com o Firebase Cloud (Firestore, Auth, Storage) via HTTPS/REST. O GPS é acedido nativamente via `expo-location` e os dados são persistidos localmente via `AsyncStorage`. A distribuição é feita através da App Store (iOS) e Google Play (Android).

Para mais detalhes: [Diagrama de Deployment PDF](docs/architecture/deployment_diagram.pdf)

### Protótipo Vertical

O protótipo vertical implementado no Sprint 0 foca-se na funcionalidade central de pesquisa e localização de supermercados. Esta _thin vertical slice_ prova a viabilidade das integrações nativas com React Native e Expo.

Através da integração com o GPS do dispositivo e a base de dados Firebase Firestore, o sistema consegue ler as coordenadas do utilizador, extrair as lojas ativas, calcular a distância usando a fórmula de Haversine e verificar se cada loja se encontra dentro do seu horário de funcionamento. Os resultados são apresentados numa lista pesquisável por nome.

**Screenshots**

<p align="center">
  <img src="https://github.com/user-attachments/assets/3b7f33f3-70fb-4801-a752-c7375f5432c8" alt="Ecrã de supermercados" width="220"/>
  &nbsp;&nbsp;&nbsp;
  <img src="https://github.com/user-attachments/assets/3eb2d83a-2b1f-4a3c-abb8-6a7da684bb11" alt="Ecrã de login" width="220"/>
  &nbsp;&nbsp;&nbsp;
  <img src="https://github.com/user-attachments/assets/6ea33589-7b4d-43be-bfef-e5af379c1d89" alt="Ecrã de registo" width="220"/>
</p>

Nota: Nesta iteração, alguns botões e elementos interativos ainda não se encontram totalmente operacionais. Estes elementos fazem parte das funcionalidades planeadas para os sprints seguintes.

---

## Validação de Requisitos

No início do projeto, realizámos um questionário ao nosso público-alvo (com a participação de 21 respondentes) para validar a utilidade da aplicação e compreender as funcionalidades com maior procura. Este processo foi fundamental para refinar o nosso Product Backlog (PBL) com base em dados quantitativos, focando o esforço de desenvolvimento no MVP.

Link do formulário: [https://tally.so/r/pbWPjV]

### Resultados

<table>
  <tr>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/3b69b073-2f68-47d7-9514-6b5654dd4f09" alt="Ordenação e Feedback de Funcionalidades" width="100%" />
    </td>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/4cdc7b88-41b6-43e4-b1bc-d9616ece3cbc" alt="Hábitos de Consumo e Adesão da Ideia" width="100%" />
    </td>
  </tr>
</table>

### Principais Conclusões e Impacto no PBL:

- **Priorização da Checklist:** 95.2% dos utilizadores (20 em 21) consideram importante planear as compras (38.1% faz sempre lista e 57.1% faz ocasionalmente). Isto levou-nos a priorizar a implementação da checklist interativa (Issue #117) para substituir dinamicamente o fluxo tradicional de papel ou notas.
- **Implementação do Modo Convidado:** A validação inicial da utilidade da aplicação registou uma aceitação massiva, com 95.2% dos inquiridos a avaliar a ideia principal com nota igual ou superior a 4 (61.9% com pontuação máxima de 5). Para mitigar qualquer atrito que reduza a retenção desta base de utilizadores, removeu-se a obrigatoriedade de registo, adotando um "Modo Convidado" assíncrono via Firebase.
- **Toggle de Poupança vs. Conveniência:** Confirmou-se a volatilidade do perfil de consumo: 47.6% dos inquiridos procura ativamente o supermercado com melhores promoções e 28.6% chega a deslocar-se a várias lojas na mesma semana, enquanto 23.8% prioriza a conveniência de uma loja única. Esta métrica validou o desenvolvimento do algoritmo de otimização bifuncional no carrinho.
- **Corte de Funcionalidades (Limpeza do MVP):** Funcionalidades secundárias como a partilha de listas (Carrinho Partilhado) obtiveram a pior classificação no ecossistema de prioridades (média de 5.0, ocupando o último lugar isolado). Por registarem um rácio de rejeição ou indiferença acentuado, foram descartadas do backlog operacional para salvaguardar a entrega atempada das componentes críticas.

## Gestão do Projeto

A gestão do projeto é feita através do [GitHub Projects](https://github.com/orgs/FEUP-LEIC-ES-2025-26/projects), onde são registadas e acompanhadas todas as user stories, tarefas e o progresso de cada sprint.

**Definição de Pronto**

- A user story tem mockup associado.
- A user story foi estimada pela equipa.
- A user story tem acceptance tests definidos.
- A user story está no Sprint Backlog no board do projeto.

**Definição de Concluído**

- O pull request foi revisto e aprovado.
- Os acceptance tests e unit tests passaram.
- A funcionalidade foi testada num dispositivo móvel real.

---

### Sprint 0

#### Board do Projeto

Início do Sprint 0

<img src="https://github.com/user-attachments/assets/e2998a46-3ed9-4d1e-95ed-2b9f2bca8401" width="500"/>

Fim do Sprint 0

<img src="https://github.com/user-attachments/assets/10d80d9f-aecc-4b83-94a2-e41f0917c993" width="500"/>

#### Funcionalidades Implementadas

- Pesquisa de supermercados por @dcl674
- Página de login por @JoseSantos56
- Página de registo por @JoseSantos56
- DependaBot e scripts de DevOps por @bcdtrak

#### Retrospetiva

**O que correu bem**

- Desenho do Protótipo: A equipa conseguiu implementar um protótipo funcional centrado na funcionalidade principal da app, demonstrando com sucesso o propósito do produto.

**O que fazer de forma diferente**

- Distribuição de Trabalho: A distribuição de tarefas foi desequilibrada, com alguns elementos a implementar significativamente mais do que outros. A equipa irá abordar este ponto no próximo sprint.

**Questões em aberto**

- Base de Dados de Produtos: É necessário definir uma estratégia para popular a base de dados de produtos, manualmente ou via API, de modo a que a funcionalidade de pesquisa de produtos funcione corretamente.

---

### Sprint 1

#### Board do Projeto

Início do Sprint 1

<img src="https://github.com/user-attachments/assets/cb98a252-7637-4e3f-8416-4e824a064c73" width="700"/>

Fim do Sprint 1

<img src="https://github.com/user-attachments/assets/ab155f3f-cc39-499b-8973-756fc6681ab4" width="700"/>

#### Funcionalidades Implementadas

- Pesquisa de produtos por @dcl674
- Seleção de localização por @bcdtrak
- Filtros por distância e estado da loja (aberto/fechado) por @dcl674
- Página de perfil pessoal por @lluissampaio
- Página de login por @JoseSantos56
- Página de registo por @JoseSantos56

#### Retrospetiva

**O que correu bem**

- Implementação Paralela: A equipa implementou 3 funcionalidades em simultâneo e integrou-as sem grandes conflitos, progredindo em várias frentes ao mesmo tempo.
- Distribuição de Trabalho: A carga de trabalho foi distribuída de forma mais equilibrada, resultando num aumento de produtividade em comparação com o sprint anterior.

**O que fazer de forma diferente**

- Comunicação: A comunicação entre os elementos da equipa foi escassa, o que dificultou a implementação de algumas funcionalidades planeadas e reduziu a produtividade global. A equipa irá estabelecer check-ins mais regulares.

**Questões em aberto**

- Integração Carrinho-Base de Dados: É necessário definir como ligar o carrinho do utilizador à base de dados, de modo a obter os metadados necessários para os cálculos de preço.

---

### Sprint 2

#### Board do projeto

##### Antes

<img width="892" height="854" alt="image" src="https://github.com/user-attachments/assets/f7cbd25d-cbb2-4de9-a468-45318a95c55a" />

##### Depois

<img width="539" height="877" alt="imagem" src="https://github.com/user-attachments/assets/cf14b3c4-76cb-4264-a12a-f6a47f598fbd" />

#### Funcionalidades Implementadas

- Ecrã Inicial por @lluissampaio
  Landing page com as opções de login, registo ou entrada rápida como convidado.
- Página de Produtos por @dcl674
  Página com preços em diversos supermercados e mais informações como nutriscore, ecoscore e quantidade. Permite adicionar produtos ao carrinho.
- Página de horários de supermercados por @bcdtrak
  Página com horário completo do supermercado selecionado
- Carrinho de Compras por @lluissampaio
  Gestão da lista de compras com um toggle que permite calcular o melhor preço num "mix" de supermercados ou restringir tudo a uma só loja. Conecção à firestore.
- Recuperação e Gestão de Conta por @JoseSantos56
  Ecrã para recuperar a password e lógica de segurança (verificação por e-mail) ao alterar os dados do utilizador.
- Dark/Light Mode por @bcdtrak
  Suporte nativo para alternar entre modo claro e escuro em toda a aplicação.

#### Retrospetiva

**O que correu bem**

- Implementação Paralela: A equipa implementou 7 funcionalidades em simultâneo e integrou-as sem grandes conflitos, progredindo em várias frentes ao mesmo tempo.
- Distribuição de Trabalho: A carga de trabalho foi distribuída de forma mais equilibrada, resultando num aumento de produtividade em comparação com o sprint anterior.

**O que fazer de forma diferente**

- Organização: A equipa poderia se ter organizado melhor para conseguir realizar as features mais atempadamente.

**Questões em aberto**

- Como melhorar a segurança da app.

#### Ferramentas de IA Utilizadas

- Gemini, GLM, Claude, Deepseek

#### Prompts Relevantes

1 - Como é que resolvo as dependencias do projeto?
2 - A app não está a abrir no expo go, o que faço para resolver?
3 - O meu workflow do Github Actions não esta a dar upload dos build artifacts, como resolvo?
4 - Consegues explicar-me como funciona o Zustand? Explica-me como instalar e a sintaxe específica.
5 - O que devo fazer para sincronizar o FireStore com o "users/{uid}/cart/default" através de um hook?

#### Código Gerado por IA

- "package.json"
- "firebaseConfig.js"
- Parte de "/store/useCartStore.js"

#### PBIs com label "MisterAI"

- Nada foi totalmente criado com IA, apenas foi usado como um assistente para ajudar na implementação e na correção de alguns bugs mais complexos.

### Sprint 3

#### Board do projeto

##### Antes

<img width="540" height="874" alt="imagem" src="https://github.com/user-attachments/assets/8ae5cb67-94c8-4cc6-997d-e287eb9d613e" />

##### Depois

#### Funcionalidades Implementadas

- Pesquisa de produto por categoria por @dcl674
  Funcionalidade que permite pesquisar produtos de modo mais eficiente através de filtros por categorias, otimizando o processo de seleção de um modo intuitivo.
- Edição do perfil por @lluissampaio
  Permite personalização da conta do utilizador, proporcionando uma experiência mais agradável.
- Gestão de conta por @lluissampaio
  Secção adicionada para alteração de informações relativas à segurança e manutenção conta do utilizador.
- Página de ajuda por @lluissampaio
  Página criada com o intuito de orientar e ajudar o utilizador no seu uso da aplicação.
- Checklist Interativa por @bcdtrak
  Modo prático para usar dentro da loja: ao clicar num produto do carrinho, ele fica "riscado", a cinzento e desce para o fim da lista.
- Página "Sobre Nós" por @noloseiiird
  Página com os devidos créditos aos autores da aplicação.
- Botão de limpeza de texto por @noloseiiird
  Pequena conveniência em barras de pesquisa para apagar rapidamente todo o texto inserido.

#### Retrospetiva

**O que correu bem**

- Implementação Paralela: A equipa implementou 7 funcionalidades em simultâneo e integrou-as sem grandes conflitos, progredindo em várias frentes ao mesmo tempo.
- Organização: A equipa usufruiu das frameworks disponibilizadas para organização do sprint, utilizando-as ao seu máximo potencial para acelerar a integração das features sem conflitos.

**O que fazer de forma diferente**

- Delegação de tarefas: A distribuição de tarefas entre os membros da equipa foi ligeiramente desequilibrada, dificultando o progresso a nível de funcionalidades novas na aplicação.
- Comunicação: A comunicação, embora tenha melhorado comparativemente ao início, revelou-se escassa, o que, por vezes, levou a repetição desnecessária de tarefas.

**Questões em aberto**

Como estruturar a demo?
Como fazer o pitch?

# Ferramentas de IA Utilizadas

- Gemini, GLM, Claude, Deepseek

# Prompts Relevantes

- "O Detox está a demorar muito tempo a completar os testes, podes ver o meu ficheiro de configuração e, se necessário, alterar para que funcione melhor?"
- "Estou a ter um erro de build no Detox, podes me ajudar a resolvê-lo?"

# Código Gerado por IA

- ".detoxrc.js"

# PBIs com label "MisterAI"

- Nada foi totalmente criado com IA, apenas foi usado como um assistente para ajudar na implementação e na correção de alguns bugs mais complexos.
---

### Entrega Final

#### Final Product

##### Perceived business value: 
- A aplicação implementa todas as funcionalidades necessárias para cumprir o seu propósito, adicionando funcionalidades extra para proporcionar conveniência ao utilizador. Apesar de o *core* ser a poupança de dinheiro via uma "rota" de compras personalizada com base em preços, existem features de consulta do horário dos supermercados, para planear as compras atempadamente, e uma checklist de compras, para que o utilizador possa atualizar em tempo-real a sua lista de produtos a adquirir. Apesar de não ser uma aplicação extensiva relativamente a funcionalidades, cada uma está fortemente integrada para proporcionar uma experiência de utilizador agradável, o que resulta num valor acrescido e numa experiência suave e fácil de entender/interagir com.

##### Technical external quality (usability): 
- A interface é limpa e segue padrões de design modernos, cumprindo as expectativas do utilizador. As interações com os menus e toda a experiência de utilizador são o foco principal da aplicação, sendo bastante intuitivas, suaves e bem integradas. Não existem funcionalidades escondidas, a aplicação tem uma curva de aprendizagem bastante suave e um teor elevado de *discoverability*, o utilizador consegue internalizar o *workflow* rapidamente.

##### Technical internal quality (code quality): 
- O código segue a estrutura *standard* de projetos de React Native, organizando a *codebase* em pastas separadas para cada tipo de biblioteca utilizada. Este modelo permitiu-nos criar um código bastante modular, extensível e auto-documentativo, isto é, meramente olhando para a estrutura de ficheiro, é possível ter uma ideia do funcionamento da aplicação. A qualidade do código revelou-se, de um modo geral, boa, tendo evoluído gradualmente desde o primeiro sprint, à medida que fomos aprendendo e utilizando boas práticas de desenvolvimento de código em React Native. Implementamos, na pipeline de DevOps, um workflow para manutenção da formatação e estilo do código, o que o tornou mais legível e consistente, aumentando a sua qualidade. De uma maneira geral, o código segue as *guidelines* genéricas de React Native, o que permite que qualquer desenvolvedor com conhecimento da framework consiga assimilar o funcionamento da aplicação rapidamente e começar a desenvolver código. A cobertura de testes foi extensiva, testando exaustivamente cada funcionalidade da aplicação e as bibliotecas que integram o *backend*. Os testes de aceitação percorrem o workflow do user na aplicação, testando as diversas interações possíveis. Deste modo, foram necessários 5 testes de aceitação para validar totalmente a aplicação.


