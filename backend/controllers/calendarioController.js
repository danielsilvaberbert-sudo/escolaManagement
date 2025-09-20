function gerarDatas(diasSemana, dataInicio, dataFim) {
  const datas = [];
  let atual = new Date(dataInicio);
  const fim = new Date(dataFim);

  while (atual <= fim) {
    // getDay(): 0=Dom, 1=Seg, ..., 6=Sab
    if (diasSemana.includes(atual.getDay())) {
      datas.push(new Date(atual));
    }
    atual.setDate(atual.getDate() + 1);
  }
  return datas;
}

exports.salvarCalendario = async (req, res) => {
  try {
    const { disciplina, diasSemana, dataInicio, dataFim } = req.body;
    if (!disciplina || !diasSemana || !dataInicio || !dataFim) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    const datasGeradas = gerarDatas(diasSemana, dataInicio, dataFim)
                          .map(d => d.toISOString().split('T')[0]);

    // Aqui salva na planilha (exemplo)
    await googleSheetsService.appendValues(
      'Calendario',
      datasGeradas.map(data => [disciplina, data])
    );

    res.json({ message: 'Calendário salvo com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao salvar calendário' });
  }
};
