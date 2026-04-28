# CHEAPY Development Report

Welcome to the documentation of Cheapy!

You can find here details about Cheapy, from a high-level vision to low-level implementation decisions, a kind.
of Software Development Report, organized by type of activities:

- [Business modeling](#Business-Modelling)
  - [Product Vision](#Product-Vision)
  - [Features and Assumptions](#Features-and-Assumptions)
- [Requirements](#Requirements)
  - [User stories](#User-stories)
  - [Domain model](#Domain-model)
  - [User interfaces](#User-interfaces)
- [Architecture and Design](#Architecture-And-Design)
  - [Logical architecture](#Logical-Architecture)
  - [Physical architecture](#Physical-Architecture)
  - [Functional prototype](#Functional-Prototype)
- [Project management](#Project-Management)
  - [Sprint 0](#Sprint-0)
  - [Sprint 1](#Sprint-1)
  - [Sprint 2](#Sprint-2)
  - [Sprint 3](#Sprint-3)
  - [Final Release](#Final-Release)

Contributions are expected to be made exclusively by the initial team, but we may open them to the community, after the course, in all areas and topics: requirements, technologies, development, experimentation, testing, etc.

Please contact us!

Thank you!

---

## Business Modelling

O produto surge na necessidade do consumidor final saber onde o cesto de produtos que pretende comprar está mais barato, acompanhado promoções diárias cruzando dados de vários supermercados. A partir desta ideia inicial surgem outras features para a aplicação, por exemplo, recomendações de produtos com base no historico, dividir o cesto de compras em 2 supermercados, entre outras.

Business modeling in software development involves defining the product's vision, understanding market needs, aligning features with user expectations, and setting the groundwork for strategic planning and execution.

### Product Vision

E se houvesse uma aplicação que informasse o utilizador de onde o seu cesto de compras é mais barato, ajudando-o a poupar dinheiro? Cheapy resolve este problema. Dado um cesto de produtos selecionados pelo utilizador, a aplicação analisa os preços nos principais supermercados portugueses e descobre onde o preço final do cesto é mais barato.

Além disso, se o utilizador tiver disponibilidade de ir a mais do que um supermercado e quiser poupar ainda mais, tem também a opção de receber a informação da melhor escolha de supermercado relativamente a cada produto selecionado.

A aplicação destaca-se no mercado devido à sua capacidade de atualização avançada, conseguindo obter os preços dos produtos em tempo real.

Esta aplicação surge na necessidade do consumidor final saber onde o cesto de produtos que pretende comprar é mais barato naquele exato momento, acompanhando as ofertas diárias de cada supermercado de modo que este consiga planear eficazmente as suas compras.

Partindo da ideia inicial, surgem outras funcionalidades potencialmente interessantes, tais como, por exemplo, recomendações de produtos com base no histórico, partilha do cesto de compras entre diversos utilizadores, entre outras.

### Features and Assumptions

**Implementadas (Protótipo Vertical)**
- **Pesquisa e Filtro de Lojas** - O utilizador pode pesquisar supermercados pelo nome e filtrar os resultados da sua zona em tempo real.
- **Horário e Estado** - Indicação em tempo real do estado da loja (Aberto/Fechado) e exibição do horário de funcionamento do dia atual.
- **Geolocalização (Smart Feature)** - Cálculo da distância real entre a localização atual do utilizador (via GPS/Cache do telemóvel) e os supermercados disponíveis.
- **Autenticação (UI)** - Ecrã inicial de Login e estrutura base de proteção de rotas preparada.

**Planeadas (Backlog / Próximos Sprints)**
- **Feature principal** - Dado um cesto de produtos, a app dá output ao supermercado/loja onde o preço final é mais barato (já com as promoções).
- **Feature secundária (Otimização)** - Utilizador tem liberdade de querer comprar o cesto de compras apenas num supermercado ou em mais que um, conseguindo preços ainda mais baixos.
- **Recomendações** - Com base no histórico de compras, recomendar certos produtos.
- **Símbolo pegada de carbono** - Se o produto tiver pouca pegada de carbono e for produzido de forma favorável ao ambiente terá um símbolo ecológico indicador.
- **Símbolo nutricional** - Indicador da qualidade nutricional de cada produto.
- **Perfil** - Cada utilizador terá um perfil próprio com as suas informações pessoais e histórico.
- **Carrinho partilhado** - Um carrinho colaborativo que pode ser partilhado e editado por vários utilizadores ao mesmo tempo.
- **Modo offline** - Acesso ao carrinho de compras sem necessidade de ligação à internet, permitindo consultar a lista dentro do supermercado.
- **Definições** - Menu de gestão da aplicação, gestão de notificações e preferências de utilizador.

## Happiness Meters

<p align="center">
  <img src="docs/happinessMeters/happiness.png"/>
</p>

## Requirements

### User Stories

Enquanto utilizador não registado, quero registar uma conta na aplicação, de modo a guardar toda a informação necessária.

Enquanto utilizador registado, quero fazer login na aplicação, de modo a ter acesso a toda a minha informação.

Enquanto utilizador registado, quero ver o meu perfil, para que possa saber se estou na minha conta.

Enquanto utilizador, quero seleccionar os supermercados onde a pesquisa vai ser feita, para escolher os meus preferidos.

Enquanto utilizador, quero filtrar a lista de supermercados pela distância e verificar os que estão abertos agora, para decidir rapidamente onde fazer compras.

Enquanto utilizador, quero consultar o horário de funcionamento dos supermercados, para planear as minhas compras de forma mais eficiente.

Enquanto utilizador, quero ver se os produtos são ecológicos, para diminuir a minha pegada ambiental.

Enquanto utilizador, quero consultar onde o meu carrinho de compras é mais barato, para que possa poupar dinheiro.

Enquanto utilizador, quero esvaziar o carrinho para que não tenha que remover manualmente cada produto do carrinho.

<!--
In this section you should describe all kinds of requirements for your module: functional and non-functional requirements.

For LEIC-ES-2025-26, the requirements will be gathered and documented as user stories.

Please add in this section a concise summary of all the user stories (not each user story!).

**User stories as GitHub Project Items**
The user stories themselves should be created and described as items in your GitHub Project with the label "user story".

A user story is a description of a desired functionality told from the perspective of the user or customer. A starting template for the description of a user story is *As a < user role >, I want < goal > so that < reason >.*

Name the item with either the full user story or a shorter name (recommended). In the “comments” field, add relevant notes, mockup images, and acceptance test scenarios, linking to the acceptance tests when available, and finally estimate value and effort.

**INVEST in good user stories**.
You may add more details after, but the shorter and complete, the better. In order to decide if the user story is good, please follow the [INVEST guidelines](https://xp123.com/articles/invest-in-good-stories-and-smart-tasks/).

**User interface mockups**.

**Acceptance tests**.
For each user story you should write also the acceptance tests (textually in [Gherkin](https://cucumber.io/docs/gherkin/reference/)), i.e., a description of scenarios (situations) that will help to confirm that the system satisfies the requirements addressed by the user story.

**Value and effort**.
At the end, it is good to add a rough indication of the value of the user story to the customers (e.g. [MoSCoW](https://en.wikipedia.org/wiki/MoSCoW_method) method) and the team should add an estimation of the effort to implement it using points in a kind-of-a Fibonnacci scale (1,2,3,5,8,13,20,40, no idea).

-->

### Functional prototype

O protótipo vertical implementado foca-se na funcionalidade central de pesquisa e localização de supermercados. Através da integração com o hardware do telemóvel (GPS) e a base de dados (Firebase Firestore), o sistema consegue ler as coordenadas do utilizador, extrair as lojas ativas, calcular a distância em linha reta usando a fórmula de Haversine e verificar em tempo real se a loja se encontra aberta. Esta *slice* vertical prova a viabilidade das integrações nativas usando React Native e Expo.

### Domain model

<p align="center">
  <img src="docs/domain/domain_model.png"/>
</p>

O modelo de domínio é composto por 13 classes que representam os conceitos centrais do sistema. A entidade principal é o UtilizadorRegistado, que possui um Carrinho com ItemCarrinho e Produtos, uma lista de Favoritos, CarrinhosFavoritos e HistoricoCarrinho. Os Supermercados têm Localizacao, Horarios e praticam preços via PrecoProduto. O UtilizadorAnonimo pode usar o Carrinho mas não tem acesso a funcionalidades exclusivas de utilizadores registados.

Para mais detalhes: [Domain Model PDF](docs/domain/domain_model.pdf)

## Architecture and Design


A arquitetura da aplicação segue uma organização em camadas, separando a interface do utilizador da lógica de negócio. A camada de apresentação é composta por ecrãs e componentes reutilizáveis, enquanto a lógica da aplicação é gerida por hooks e constantes partilhadas. Esta separação facilita a manutenção e evolução do código ao longo do projeto.

### Logical architecture

<p align="center">
  <img src="docs/architecture/package_diagram.png"/>
</p>

A arquitetura lógica organiza o sistema em quatro camadas: Presentation (Navigation, Screens, Components), Logic (Hooks, Utils), Data (Firebase Config, Constants) e External Services (Firebase Firestore, expo-location). Os ecrãs utilizam os componentes e hooks, os hooks utilizam utils e acedem ao Firebase e ao GPS.

Para mais detalhes: [Architecture PDF](docs/architecture/package_diagram.pdf)

### Physical architecture

<p align="center">
  <img src="docs/architecture/deployment_diagram.png"/>
</p>

A aplicação corre num dispositivo móvel (iOS/Android) em React Native com Expo, comunicando com o Firebase Cloud (Firestore, Auth, Storage) via HTTPS/REST. O GPS é acedido nativamente via expo-location e os dados são persistidos localmente via AsyncStorage. A distribuição é feita através da App Store (iOS) e Google Play (Android).

Para mais detalhes: [Architecture PDF](docs/architecture/deployment_diagram.pdf)

### Functional prototype

<!--
To help on validating all the architectural, design and technological decisions made, we usually implement a functional prototype, a thin vertical slice of the system integrating as much technologies as we can.

In this subsection please describe which feature, or part of it, you have implemented, and how, together with a snapshot of the user interface, if applicable.

At this phase, instead of a complete user story, you can simply implement a small part of a feature that demonstrates thay you can use the technology, for example, show a screen with the app credits (name and authors).
-->

## Project management

<!--
Software project management is the art and science of planning and leading software projects, in which they are planned, implemented, monitored and controlled.

In the context of ESOF, we recommend each team to adopt a set of project management practices and tools capable of registering tasks, assigning tasks to team members, adding estimations to tasks, monitor tasks progress, and therefore being able to track their projects.

Common practices of managing agile software development with Scrum are: backlog management, release management, estimation, Sprint planning, Sprint development, acceptance tests, and Sprint retrospectives.

You can find below information and references related with the project management:

* Backlog management: Product backlog and Sprint backlog in a [Github Projects board](https://github.com/orgs/FEUP-LEIC-ES-2023-24/projects/64);
* Release management: [v0](#), v1, v2, v3, ...;
* Sprint planning and retrospectives:
  * plans: screenshots of Github Projects board at begin and end of each Sprint;
  * retrospectives: meeting notes in a document in the repository, addressing the following questions:
    * Did well: things we did well and should continue;
    * Do differently: things we should do differently and how;
    * Puzzles: things we don’t know yet if they are right or wrong;
    * list of a few improvements to implement next Sprint;

-->

### Sprint 0

#### Mockups

![Screenshot_20260410_135451_Expo_Go](https://github.com/user-attachments/assets/3b7f33f3-70fb-4801-a752-c7375f5432c8)

![Screenshot_20260410_112341_Expo_Go](https://github.com/user-attachments/assets/3eb2d83a-2b1f-4a3c-abb8-6a7da684bb11)

![Screenshot_20260410_112401_Expo_Go](https://github.com/user-attachments/assets/6ea33589-7b4d-43be-bfef-e5af379c1d89)

#### Project Board
Start of sprint 0
<img width="537" height="638" alt="imagem" src="https://github.com/user-attachments/assets/e2998a46-3ed9-4d1e-95ed-2b9f2bca8401" />

End of sprint 0
<img width="535" height="642" alt="imagem" src="https://github.com/user-attachments/assets/10d80d9f-aecc-4b83-94a2-e41f0917c993" />

#### Retrospective
- Did well:
	- Prototype Design: The team was able to design a barebones prototype with a core app feature, being able to showcase the purpose of the app successfully.
- Do differently:
	- Work Distribution. The tasks were assgined in a disproportionate manner, with some team members implementing a lot of features and other team members doing less work.	
- Puzzles:
	- Product Database: We need to find a way to populate the product database of the app (either manually or via an API), so that the product search functionality works.

 #### Features Implemented

- Navbar by @dcl674
- Ability to search supermarkets by @dcl674
- Base for register page by @JoseSantos56
- Base for login page by @JoseSantos56
- DependaBot and scripts for DevOps by @bcdtrak

### Sprint 1

#### Project Board
Start of sprint 1
<img width="892" height="598" alt="imagem" src="https://github.com/user-attachments/assets/cb98a252-7637-4e3f-8416-4e824a064c73" />

End of sprint 1
<img width="890" height="718" alt="imagem" src="https://github.com/user-attachments/assets/ab155f3f-cc39-499b-8973-756fc6681ab4" />

#### Retrospective:

- Did well:
	- Parallel Task Implementation: The team successfully implemented 3 features simultaneously and combined them without many problems, progressing greatly in various fronts.
	- Work Distribution: The workload was fairly distributed between the team elements, which caused an increase in productive development in comparison with the previous sprint.
- Do differently:
	- Communication: The communication between team elements was sparse which lead to some difficulties in implementing the planned features, impairing productivity.
- Puzzles:
	- Implementation of the Cart-Database: We need to find a way to connect the user's cart to the database in order to fetch the metadata required for the price calculations.

#### Features Implemented

- Ability to search Products by @dcl674
- Ability to choose a location by @bcdtrak
- Added filters by distance and by state (aberto / fechado) by @dcl674
- Simple personal page by @lluissampaio
- Login page by @JoseSantos56
- Register page by @JoseSantos56

### Sprint 2

### Sprint 3

### Sprint 4

### Final Release
