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
    
    // Sincroniza os selects
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
    document.getElementById('totalMarcado').textContent = `${ativMarcacao.toFixed(2)} mCi`;
    document.getElementById('disponivelGerador').textContent = `${ativDisponivel.toFixed(2)} mCi`;
    const diferenca = ativDisponivel - ativMarcacao;
    const diferencaEl = document.getElementById('diferencaMarcacao');
    diferencaEl.textContent = `${diferenca.toFixed(2)} mCi`;
    diferencaEl.style.color = diferenca >= 0 ? '#00ff64' : '#ff6b6b';
    document.getElementById('resultadoMarcacaoContainer').classList.add('ativo');
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
