// ====== FUNÇÕES DE MARCAÇÃO ======

function atualizarInfoIsotopo() {
    const select = document.getElementById('radiofarmacoMestre');
    const selectedOption = select.options[select.selectedIndex];
    const isotopo = selectedOption.getAttribute('data-isotopo') || 'tc';
    isotopoAtual = isotopo;
    
    const infoDiv = document.getElementById('infoIsotopoSelecionado');
    const meiaVida = MEIA_VIDA_MIN[isotopo];
    const nome = NOME_ISOTOPO[isotopo];
    const cor = COR_ISOTOPO[isotopo];
    infoDiv.textContent = `🔬 Isótopo: ${nome} | Meia-vida: ${meiaVida} minutos`;
    infoDiv.className = `info-isotopo ${isotopo}`;
    
    document.getElementById('meiaVidaDisplay').textContent = `${meiaVida} min`;
    document.getElementById('meiaVidaDisplay').style.color = cor;
    const lambda = 0.693 / meiaVida;
    document.getElementById('lambdaDisplay').textContent = lambda.toFixed(6);
    
    const planIsotopo = document.getElementById('planIsotopo');
    const planIsotopoAgenda = document.getElementById('planIsotopoAgenda');
    if (planIsotopo) planIsotopo.value = isotopo;
    if (planIsotopoAgenda) planIsotopoAgenda.value = isotopo;
    
    const agora = new Date();
    const horarioMarcacao = document.getElementById('planHorarioMarcacao');
    const horarioUltimo = document.getElementById('planHorarioUltimo');
    const horarioPrimeira = document.getElementById('planHorarioPrimeira');
    const horarioMarcacaoAgenda = document.getElementById('planHorarioMarcacaoAgenda');
    
    if (horarioMarcacao && !horarioMarcacao.value) {
        const marc = new Date(agora);
        marc.setHours(8, 0, 0, 0);
        horarioMarcacao.value = marc.toISOString().slice(0, 16);
    }
    if (horarioMarcacaoAgenda && !horarioMarcacaoAgenda.value) {
        const marc = new Date(agora);
        marc.setHours(8, 0, 0, 0);
        horarioMarcacaoAgenda.value = marc.toISOString().slice(0, 16);
    }
    if (horarioPrimeira && !horarioPrimeira.value) {
        const primeira = new Date(agora);
        primeira.setHours(8, 30, 0, 0);
        horarioPrimeira.value = primeira.toISOString().slice(0, 16);
    }
    if (horarioUltimo && !horarioUltimo.value) {
        const ultimo = new Date(agora);
        ultimo.setHours(14, 30, 0, 0);
        horarioUltimo.value = ultimo.toISOString().slice(0, 16);
    }
    
    atualizarHorariosAgendaPadrao();
    setTimeout(() => { calcularPlanejamento(); calcularPacientes(); }, 100);
}

function calcularMarcacao() {
    const ativMarcacao = parseFloat(document.getElementById('atividadeMarcacaoMestre').value) || 0;
    const ativDisponivel = parseFloat(document.getElementById('atividadeDisponivelMestre').value) || 0;
    
    // Verifica se os elementos existem antes de tentar modificá-los
    const totalMarcado = document.getElementById('totalMarcado');
    const disponivelGerador = document.getElementById('disponivelGerador');
    const diferencaMarcacao = document.getElementById('diferencaMarcacao');
    const resultadoContainer = document.getElementById('resultadoMarcacaoContainer');
    
    // Se os elementos não existirem, apenas mostra um alerta ou log
    if (!totalMarcado || !disponivelGerador || !diferencaMarcacao) {
        console.log('📊 Marcação calculada:', {
            atividadeMarcacao: ativMarcacao.toFixed(2) + ' mCi',
            atividadeDisponivel: ativDisponivel.toFixed(2) + ' mCi',
            diferenca: (ativDisponivel - ativMarcacao).toFixed(2) + ' mCi'
        });
        return;
    }
    
    totalMarcado.textContent = `${ativMarcacao.toFixed(2)} mCi`;
    disponivelGerador.textContent = `${ativDisponivel.toFixed(2)} mCi`;
    const diferenca = ativDisponivel - ativMarcacao;
    diferencaMarcacao.textContent = `${diferenca.toFixed(2)} mCi`;
    diferencaMarcacao.style.color = diferenca >= 0 ? '#00ff64' : '#ff6b6b';
    if (resultadoContainer) {
        resultadoContainer.classList.add('ativo');
    }
}

function imprimirEtiquetaA4() {
    const radiofarmaco = document.getElementById('radiofarmacoMestre');
    const radiofarmacoNome = radiofarmaco.options[radiofarmaco.selectedIndex]?.text || '---';
    const atividadeTotal = document.getElementById('atividadeMarcacaoMestre').value || '---';
    const isotopo = isotopoAtual || 'tc';
    const nomeIsotopo = NOME_ISOTOPO[isotopo] || 'Tc-99m';
    const cor = COR_ISOTOPO[isotopo] || '#000';
    
    const loteFrasco = document.getElementById('loteFrasco')?.value || '_________';
    const validadeFrasco = document.getElementById('validadeFrasco')?.value || '';
    const volumeFrasco = document.getElementById('volumeFrasco')?.value || '5.0';
    const horaMarcacao = document.getElementById('horaMarcacaoKit')?.value || '--:--';
    const horaLimiteUso = document.getElementById('horaLimiteUso')?.value || '--:--';
    
    let validadeFormatada = validadeFrasco;
    if (validadeFrasco) {
        const partes = validadeFrasco.split('-');
        validadeFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    
    const agora = new Date();
    const dataAtual = agora.toLocaleDateString('pt-BR');
    
    const previewHTML = `
        <div style="font-family:'Arial',sans-serif;width:100%;max-width:180mm;min-height:120mm;padding:12mm;border:2px solid #1a237e;border-radius:10px;background:linear-gradient(135deg,#ffffff 0%,#f7fbff 100%);color:#000;margin:0 auto;display:flex;flex-direction:column;gap:4mm;box-sizing:border-box;position:relative;">
            <div style="display:flex;justify-content:space-between;align-items:center;font-size:16px;font-weight:bold;color:#1a237e;">
                <span>[R]</span>
                <span>${radiofarmacoNome.substring(0, 18)}</span>
                <span style="color:${cor};">${atividadeTotal} mCi</span>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:11px;color:#555;">
                <span>${nomeIsotopo}</span>
                <span>${dataAtual}</span>
                <span>${horaMarcacao}</span>
            </div>
            <div style="border-top:2px solid #1a237e;margin:2mm 0;"></div>
            <div style="display:flex;justify-content:center;font-size:18px;font-weight:bold;background:#fff3e0;padding:3mm 0;border-radius:6px;border:1px solid #ff6f00;color:#d32f2f;">
                ⏰ USAR ATÉ: ${horaLimiteUso}
            </div>
            <div style="display:flex;justify-content:space-between;font-size:10px;color:#666;">
                <span>Lote: ${loteFrasco}</span>
                <span>Vol: ${volumeFrasco} mL</span>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:10px;color:#666;">
                <span>Val.: ${validadeFormatada}</span>
                <span>Use EPI</span>
            </div>
            <div style="border-top:1px dashed #999;margin:2mm 0;"></div>
            <div style="font-size:11px;color:#444;line-height:1.4;">
                <strong>Verificar antes do uso</strong><br>
                Radiofármaco preparado para administração segura e rastreável.
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;color:#666;border-top:1px solid #ddd;padding-top:3mm;margin-top:auto;">
                <span style="font-weight:bold;">Responsável: ________________</span>
                <span style="font-weight:bold;color:#1a237e;">[R] RADIOCALC</span>
            </div>
        </div>
    `;

    const win = window.open('', '_blank', 'width=480,height=650');
    if (!win) {
        alert('⚠️ Por favor, permita pop-ups para imprimir a etiqueta.');
        return;
    }

    win.document.write(`
        <html><head><title>Etiqueta A4</title>
        <style>*{margin:0;padding:0;box-sizing:border-box;}@page{size:A4;margin:12mm;}body{font-family:Arial,sans-serif;background:#f0f0f0;padding:20px;display:flex;flex-direction:column;align-items:center;}h2{color:#1a237e;margin-bottom:10px;}.preview{background:#fff;padding:20px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.1);margin-bottom:15px;width:100%;max-width:210mm;}.preview-label{font-size:10px;color:#666;text-align:center;margin-top:8px;}.dados-resumo{background:#e3f2fd;border:1px solid #1a237e;border-radius:6px;padding:10px 16px;font-size:11px;color:#1a237e;max-width:450px;margin:10px 0;text-align:center;width:100%;}.dados-resumo strong{color:#d32f2f;}.btn-group{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:10px;}.btn-print{background:#1a237e;color:#fff;border:none;border-radius:6px;padding:12px 24px;font-size:12pt;cursor:pointer;}.btn-print:hover{background:#0d1442;}.btn-close{background:#d32f2f;color:#fff;border:none;border-radius:6px;padding:12px 24px;font-size:12pt;cursor:pointer;}.btn-close:hover{background:#a02020;}.info{background:#e8f5e9;border:1px solid #2e7d32;border-radius:6px;padding:10px 16px;font-size:11px;color:#1b5e20;max-width:450px;margin:10px 0;text-align:center;width:100%;}@media print{.no-print{display:none !important;}body{background:#fff;padding:0;}.preview{box-shadow:none;border:1px solid #ddd;width:100%;}}
        </style></head>
        <body>
            <h2>📄 Etiqueta A4</h2>
            <div class="dados-resumo">
                📋 <strong>${radiofarmacoNome}</strong> · 
                ${atividadeTotal} mCi · 
                Lote: <strong>${loteFrasco}</strong> · 
                Val.: <strong>${validadeFormatada}</strong> · 
                USAR ATE: <strong>${horaLimiteUso}</strong>
            </div>
            <div class="preview">
                <div style="display:flex;justify-content:center;">${previewHTML}</div>
                <div class="preview-label">Pré-visualização para impressão em folha A4</div>
            </div>
            <div class="info">✍️ A linha "Responsável: ______" é para <strong>preencher à mão</strong> após a impressão.</div>
            <div class="btn-group no-print">
                <button class="btn-print" onclick="window.print()">🖨️ Imprimir Etiqueta</button>
                <button class="btn-close" onclick="window.close()">✕ Fechar</button>
            </div>
        </body></html>
    `);
    win.document.close();
}

function aplicarPlanejamento() {
    const ativFinal = document.getElementById('planAtividadeFinal').textContent;
    const valor = parseFloat(ativFinal) || 0;
    if (valor <= 0) { alert('⚠️ Calcule o planejamento primeiro!'); return; }
    document.getElementById('atividadeMarcacaoMestre').value = valor.toFixed(1);
    document.getElementById('atividadeDisponivelMestre').value = (valor * 1.05).toFixed(1);
    
    const modo = document.querySelector('input[name="modoPlanejamento"]:checked').value;
    let horarioMarcacao;
    if (modo === 'simplificado') {
        horarioMarcacao = document.getElementById('planHorarioMarcacao').value;
    } else {
        horarioMarcacao = document.getElementById('planHorarioMarcacaoAgenda').value;
    }
    if (horarioMarcacao) document.getElementById('horarioMarcacaoMestre').value = horarioMarcacao;
    
    trocarAba('marcacao');
    setTimeout(() => { calcularMarcacao(); calcularPacientes(); }, 100);
}

// ==========================================
// EFICIÊNCIA DE MARCAÇÃO - COM DUAS PLACAS
// ==========================================

const KITS_MARCACAO = {
    kardia: {
        nome: 'KARDIA (MIBI)',
        formula: 'Placa 1 = (F2/F1+F2)×100 | Placa 2 = (F1/F1+F2)×100',
        purezaMinima: 90,
        descricao: '100 – (impureza placa 1 + impureza placa 2) ≥ 90%'
    },
    osteo: {
        nome: 'OSTEO (MDP)',
        formula: 'Placa 1 = (F1/F1+F2)×100 | Placa 2 = (F2/F1+F2)×100',
        purezaMinima: 90,
        descricao: '100 – (impureza placa 1 + impureza placa 2) ≥ 90%'
    },
    limpha: {
        nome: 'LIMPHA (FITATO)',
        formula: 'Placa = (F1/F1+F2)×100 ≤ 5%',
        purezaMinima: 95,
        descricao: '100 – (impureza placa) ≥ 95%',
        apenasUmaPlaca: true
    },
    reno: {
        nome: 'RENO (DMSA)',
        formula: 'Placa 1 = (F1/F1+F2)×100 | Placa 2 = (F2/F1+F2)×100',
        purezaMinima: 90,
        descricao: '100 – (impureza placa 1 + impureza placa 2) ≥ 90%'
    },
    nefro: {
        nome: 'NEFRO (DTPA)',
        formula: 'Placa 1 = (F1/F1+F2)×100 | Placa 2 = (F2/F1+F2)×100',
        purezaMinima: 90,
        descricao: '100 – (impureza placa 1 + impureza placa 2) ≥ 90%'
    },
    piro: {
        nome: 'PIRO',
        formula: 'Placa 1 = (F1/F1+F2)×100 | Placa 2 = (F2/F1+F2)×100',
        purezaMinima: 90,
        descricao: '100 – (%TcO4 + %TcO2) ≥ 90%'
    }
};

function atualizarCamposEficiencia() {
    const kit = document.getElementById('kitMarcacao').value;
    const info = KITS_MARCACAO[kit];
    
    if (info) {
        document.getElementById('infoKitTexto').innerHTML = `
            <strong style="color: #ffd700;">${info.nome}</strong><br>
            ${info.formula}<br>
            <span style="color: #00d2ff;">Pureza mínima exigida: ≥ ${info.purezaMinima}%</span><br>
            <span style="color: #888; font-size: 0.85rem;">${info.descricao}</span>
        `;
    }
}

function calcularEficienciaMarcacao() {
    const kit = document.getElementById('kitMarcacao').value;
    const info = KITS_MARCACAO[kit];
    
    // ====== DADOS DA PLACA 1 ======
    const p1f1 = parseFloat(document.getElementById('placa1Fracao1').value) || 0;
    const p1f2 = parseFloat(document.getElementById('placa1Fracao2').value) || 0;
    const totalPlaca1 = p1f1 + p1f2;
    
    // ====== DADOS DA PLACA 2 ======
    const p2f1 = parseFloat(document.getElementById('placa2Fracao1').value) || 0;
    const p2f2 = parseFloat(document.getElementById('placa2Fracao2').value) || 0;
    const totalPlaca2 = p2f1 + p2f2;
    
    console.log('📊 Dados lidos:');
    console.log('Placa 1 - F1:', p1f1, 'F2:', p1f2, 'Total:', totalPlaca1);
    console.log('Placa 2 - F1:', p2f1, 'F2:', p2f2, 'Total:', totalPlaca2);
    
    // Validação
    if (totalPlaca1 === 0 && totalPlaca2 === 0) {
        document.getElementById('resultadoEficienciaMarcacao').style.display = 'none';
        console.log('⚠️ Nenhum dado para calcular');
        return;
    }
    
    let placa1 = 0, placa2 = 0, pureza = 0;
    
    // ====== CÁLCULO PARA KARDIA ======
    if (kit === 'kardia') {
        // KARDIA: PLACA 1 = (F2/F1+F2)×100 | PLACA 2 = (F1/F1+F2)×100
        if (totalPlaca1 > 0) placa1 = (p1f2 / totalPlaca1) * 100;
        if (totalPlaca2 > 0) placa2 = (p2f1 / totalPlaca2) * 100;
        pureza = 100 - (placa1 + placa2);
        console.log('📌 KARDIA - Placa1:', placa1, 'Placa2:', placa2, 'Pureza:', pureza);
    }
    // ====== CÁLCULO PARA LIMPHA ======
    else if (kit === 'limpha') {
        // LIMPHA: PLACA = (F1/F1+F2)×100 | Pureza = 100 - placa
        if (totalPlaca1 > 0) placa1 = (p1f1 / totalPlaca1) * 100;
        placa2 = 0;
        pureza = 100 - placa1;
        console.log('📌 LIMPHA - Placa1:', placa1, 'Pureza:', pureza);
    }
    // ====== CÁLCULO PARA OSTEO, RENO, NEFRO, PIRO ======
    else {
        // PLACA 1 = (F1/F1+F2)×100 | PLACA 2 = (F2/F1+F2)×100
        if (totalPlaca1 > 0) placa1 = (p1f1 / totalPlaca1) * 100;
        if (totalPlaca2 > 0) placa2 = (p2f2 / totalPlaca2) * 100;
        pureza = 100 - (placa1 + placa2);
        console.log('📌 OSTEO/RENO/NEFRO/PIRO - Placa1:', placa1, 'Placa2:', placa2, 'Pureza:', pureza);
    }
    
    // Arredondar para 1 casa decimal
    placa1 = Math.round(placa1 * 10) / 10;
    placa2 = Math.round(placa2 * 10) / 10;
    pureza = Math.round(pureza * 10) / 10;
    
    // Status
    const aprovado = pureza >= info.purezaMinima;
    const statusCor = aprovado ? '#2ecc71' : '#ff6b6b';
    const statusBg = aprovado ? 'rgba(46, 204, 113, 0.05)' : 'rgba(255, 107, 107, 0.05)';
    const statusBorder = aprovado ? '#2ecc71' : '#ff6b6b';
    
    // Exibir resultados
    const resultadoDiv = document.getElementById('resultadoEficienciaMarcacao');
    resultadoDiv.style.display = 'block';
    document.getElementById('resultadoPlaca1').textContent = placa1 + '%';
    document.getElementById('resultadoPlaca2').textContent = (kit === 'limpha' ? '---' : placa2 + '%');
    document.getElementById('resultadoPureza').textContent = pureza + '%';
    document.getElementById('resultadoPureza').style.color = aprovado ? '#2ecc71' : '#ff6b6b';
    
    // Detalhes das placas
    document.getElementById('placa1Detalhe').textContent = `F1: ${p1f1} | F2: ${p1f2} | Total: ${totalPlaca1}`;
    document.getElementById('placa2Detalhe').textContent = `F1: ${p2f1} | F2: ${p2f2} | Total: ${totalPlaca2}`;
    
    // Detalhes do kit
    document.getElementById('kitNomeResultado').textContent = info.nome;
    document.getElementById('formulaEficiencia').textContent = info.formula;
    
    // Status
    const statusContainer = document.getElementById('statusEficienciaContainer');
    const statusTitulo = document.getElementById('statusEficienciaTitulo');
    const statusTexto = document.getElementById('statusEficienciaTexto');
    
    statusContainer.style.borderLeftColor = statusBorder;
    statusContainer.style.background = statusBg;
    
    if (aprovado) {
        statusTitulo.style.color = '#2ecc71';
        statusTitulo.textContent = '✅ APROVADO';
        statusTexto.textContent = `Pureza: ${pureza}% (≥ ${info.purezaMinima}%) - Aprovado!`;
    } else {
        statusTitulo.style.color = '#ff6b6b';
        statusTitulo.textContent = '❌ REPROVADO';
        statusTexto.textContent = `Pureza: ${pureza}% (< ${info.purezaMinima}%) - Reprovado! Verifique o processo de marcação.`;
    }
    
    console.log('✅ Resultado exibido com sucesso!');
}

function limparCamposEficiencia() {
    document.getElementById('placa1Fracao1').value = '';
    document.getElementById('placa1Fracao2').value = '';
    document.getElementById('placa2Fracao1').value = '';
    document.getElementById('placa2Fracao2').value = '';
    document.getElementById('resultadoEficienciaMarcacao').style.display = 'none';
}

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        atualizarCamposEficiencia();
    }, 100);
});