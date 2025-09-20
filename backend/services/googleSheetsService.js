const { google } = require("googleapis");
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

class GoogleSheetsService {
  constructor() {
    this.spreadsheetId = process.env.GOOGLE_SHEET_ID;
    this.authClient = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
  }

  async verifyLogin(username, password) {
      try {
        // 1. Pega todos os usuários do Google Sheets
        const users = await this.getUsers();

        // 2. Encontra o usuário
        const user = users.find(u => u.username === username);
        if (!user) {
          return { success: false };
        }

        // 3. Verifica a senha com bcrypt
        const match = await bcrypt.compare(password, user.senha);
        if (!match) {
          return { success: false };
        }

        // 4. Retorna sucesso e dados do usuário (sem a senha)
        const { senha: _, ...userData } = user;
        return { success: true, user: userData };
      } catch (error) {
        console.error('Erro ao verificar login:', error);
        return { success: false };
      }
  }

  // Função para buscar disciplinas conforme perfil
  async getDashboardData(user) {
    const auth = await this.authClient.getClient();
    const sheets = google.sheets({ version: "v4", auth });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: "Disciplinas!A1:B100", // Nome Disciplina | Instrutor Username
    });

    const rows = res.data.values;
    if (!rows || rows.length < 2) {
      throw new Error("Nenhuma disciplina encontrada.");
    }

    const dados = rows.slice(1);
    let disciplinas;
    if (user.tipo === "Administrador") {
      disciplinas = dados.map(row => row[1]); // Todas as disciplinas
    } else if (user.tipo === "Instrutor") {
      disciplinas = dados
        .filter(row => row[0] && row[0].toLowerCase() === user.username.toLowerCase())
        .map(row => row[1]);
    } else {
      disciplinas = [];
    }

    return {
      user,
      disciplinas
    };
  }

 

  async salvarFrequencia({ disciplina, data, presencas }) {
    const auth = await this.authClient.getClient();
    const sheets = google.sheets({ version: 'v4', auth });

    const values = presencas.map(p => [
      disciplina,
      data,
      p.aluno,
      p.presente ? 'Sim' : 'Não'
    ]);

    const res = await sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: 'Chamadas!A:D', // Colunas: Disciplina | Data | Aluno | Presente
      valueInputOption: 'USER_ENTERED',
      resource: { values }
    });

    return res.data;
  }

  async getAlunosDisciplina(disciplina) {
    const auth = await this.authClient.getClient();
    const sheets = google.sheets({ version: 'v4', auth });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: 'AlunosDisciplina!A:B', // Colunas: Disciplina | Aluno
    });

    const rows = res.data.values;
    if (!rows || rows.length < 2) return [];

    const dados = rows.slice(1);
    return dados
      .filter(row => row[0].toLowerCase() === disciplina.toLowerCase())
      .map(row => row[1]); // retorna array de nomes de alunos
  }

  async getValues(range) {
    const auth = await this.authClient.getClient();
    const sheets = google.sheets({ version: "v4", auth });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range
    });

    return res.data.values;
  }

  async salvarDisciplina({ instrutor, disciplina }) {
    const auth = await this.authClient.getClient();
    const sheets = google.sheets({ version: 'v4', auth });

    const values = [[instrutor, disciplina]];

    const res = await sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: 'Disciplinas!A:B', // Colunas: Instrutor | Disciplina
      valueInputOption: 'USER_ENTERED',
      resource: { values }
    });

    return res.data;
  }

  async getInstrutores() {
    const auth = await this.authClient.getClient();
    const sheets = google.sheets({ version: 'v4', auth });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: 'Usuarios!A1:E100', // ID | Nome | Username | Senha | Tipo
    });

    const rows = res.data.values;
    if (!rows || rows.length < 2) return [];

    const dados = rows.slice(1); // remove cabeçalho
    return dados
      .map(row => ({
        id: row[0],
        nome: row[1],
        username: row[2]
      }));
  }

  async salvarAluno({ nome, dataNascimento, pai, mae, email, status }) {
    const auth = await this.authClient.getClient();
    const sheets = google.sheets({ version: 'v4', auth });

    const values = [[nome, dataNascimento, pai, mae, email, status]];

    const res = await sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: 'Alunos!A:F', // Colunas: Nome | DataNascimento | Pai | Mae | Email | Status
      valueInputOption: 'USER_ENTERED',
      resource: { values }
    });

    return res.data;
  }

  async addUser(nome, username, senha, tipo) {
    const auth = await this.authClient.getClient();
    const sheets = google.sheets({ version: 'v4', auth });

    const id = uuidv4();
    const senhaHash = await bcrypt.hash(senha, 10);

    const values = [[id, nome, username, senhaHash, tipo]];

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID, // sua planilha
      range: 'Usuarios!A:E', // aba e colunas
      valueInputOption: 'RAW',
      resource: { values },
    });

    return { success: true, id };
  }

  async getUsers() {
    try {
      const auth = await this.authClient.getClient();
      const sheets = google.sheets({ version: 'v4', auth });

      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID, // ID da planilha
        range: 'Usuarios!A:E' // ajuste o nome da aba e intervalo
      });

      const rows = response.data.values;
      if (!rows || rows.length === 0) {
        return [];
      }

      // Primeira linha são os cabeçalhos: ID, Nome, Username, Senha, Tipo
      const headers = rows[0];
      const data = rows.slice(1).map((row, index) => ({
        id: row[0] || index + 1,
        nome: row[1] || '',
        username: row[2] || '',
        senha: row[3] || '',
        tipo: row[4] || ''
      }));

      return data;
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      throw error;
    }
  }

}

module.exports = new GoogleSheetsService();
