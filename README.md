# Organização das Salas Unidas (OSU) 🎓🏛️

Plataforma digital para organização, gestão de delegações, comitês, projetos de resolução e votações do evento escolar **Organização das Salas Unidas (OSU)**.

---

## 📌 Sobre o Projeto

A **Organização das Salas Unidas (OSU)** é um projeto pedagógico interdisciplinar inspirado no modelo das Nações Unidas (ONU), adaptado à realidade escolar e comunitária. Cada turma ou grupo representa uma delegação responsável por debater temáticas urgentes, defender posições, formular propostas de melhoria coletiva e votar resoluções práticas para o ambiente escolar e seu entorno.

A plataforma tem como finalidade centralizar:
- Cadastro e organização das delegações (turmas/salas participantes).
- Distribuição de comitês temáticos (Educação, Meio Ambiente, Convivência Escolar, Cultura e Tecnologia).
- Submissão, leitura e emendas aos Projetos de Resolução.
- Painel interativo de votação em tempo real e ata digital das sessões plenárias.
- Acompanhamento das resoluções aprovadas e cronograma de execução das ações.

---

## 🚀 Funcionalidades

- **Painel Geral (Dashboard):** Visão geral da edição atual, comitês ativos, número de delegados e cronograma de debates.
- **Delegações & Salas:** Listagem de salas participantes, seus representantes oficiais e países/temas designados.
- **Comitês Temáticos:** Salas de discussão e regras procedimentais para cada eixo temático.
- **Livro de Resoluções:** Elaboração colaborativa de documentos de resolução oficial com artigos e justificativas.
- **Mesa Diretora & Votações:** Ferramenta para contagem de votos (a favor, contra, abstenção) com quórum em tempo real.
- **Painel de Notícias & Comunicados:** Avisos rápidos da comissão organizadora para todos os participantes.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Ícones & UI:** Lucide React
- **Armazenamento e Estado:** LocalStorage / Mock API extensível para integração com backend
- **Controle de Versão:** Git & GitHub

---

## 💻 Como Executar Localmente

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/menezesjuan/osu-plataforma.git
cd osu-plataforma
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Acesse no navegador:
```
http://localhost:5173
```

---

## 📂 Estrutura de Diretórios

```
osu-plataforma/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   ├── committees/
│   │   ├── delegations/
│   │   ├── resolutions/
│   │   └── voting/
│   ├── context/
│   ├── data/
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── README.md
```

---

## 📜 Licença

Projeto desenvolvido sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.
