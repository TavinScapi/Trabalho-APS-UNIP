// FAQ Accordion
document.addEventListener('DOMContentLoaded', function () {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isActive = question.classList.contains('active');

            // Fecha todas as respostas primeiro
            faqQuestions.forEach(q => {
                q.classList.remove('active');
                q.nextElementSibling.classList.remove('active');
            });

            // Abre apenas a clicada se não estava ativa
            if (!isActive) {
                question.classList.add('active');
                answer.classList.add('active');
            }
        });
    });

    // Animação ao rolar a página
    const animateOnScroll = function () {
        const elements = document.querySelectorAll('.tecnica-card, .caso-card');

        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Define estado inicial para animação
    const cards = document.querySelectorAll('.tecnica-card, .caso-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Executa uma vez ao carregar para verificar elementos visíveis
});


// Calculadora de Economia de Água
document.getElementById('calcular-agua').addEventListener('click', function() {
    const area = parseFloat(document.getElementById('area-cultivo').value);
    const cultura = document.getElementById('tipo-cultura').value;
    const sistemaAtual = document.getElementById('sistema-atual').value;
    const sistemaNovo = document.getElementById('sistema-novo').value;
    
    // Fatores de consumo (mm/ano) - valores ilustrativos
    const consumoPorSistema = {
        aspersao: { milho: 800, soja: 700, feijao: 600, hortalicas: 900, frutas: 850, cafe: 750 },
        pivo: { milho: 750, soja: 650, feijao: 550, hortalicas: 850, frutas: 800, cafe: 700 },
        sulcos: { milho: 900, soja: 800, feijao: 700, hortalicas: 1000, frutas: 950, cafe: 850 },
        manual: { milho: 850, soja: 750, feijao: 650, hortalicas: 950, frutas: 900, cafe: 800 },
        gotejamento: { milho: 500, soja: 450, feijao: 400, hortalicas: 550, frutas: 500, cafe: 450 },
        microaspersao: { milho: 550, soja: 500, feijao: 450, hortalicas: 600, frutas: 550, cafe: 500 },
        'pivo-precisao': { milho: 600, soja: 550, feijao: 500, hortalicas: 650, frutas: 600, cafe: 550 },
        subsuperficie: { milho: 450, soja: 400, feijao: 350, hortalicas: 500, frutas: 450, cafe: 400 }
    };
    
    // Calcular consumo atual e novo
    const consumoAtual = consumoPorSistema[sistemaAtual][cultura];
    const consumoNovo = consumoPorSistema[sistemaNovo][cultura];
    
    // Calcular economia (1mm = 10m³/ha)
    const economiaPorHa = (consumoAtual - consumoNovo) * 10;
    const economiaTotal = economiaPorHa * area;
    
    // Calcular economia financeira (R$ 5 por m³ - valor ilustrativo)
    const economiaFinanceira = economiaTotal * 5;
    
    // Calcular ROI (investimento médio de R$ 3.000/ha com retorno em 3-5 anos)
    const investimento = area * 3000;
    const retornoAnos = Math.ceil(investimento / (economiaFinanceira * 0.7)); // Considerando 70% da economia para ROI
    
    // Exibir resultados
    document.getElementById('economia-agua').textContent = `${economiaTotal.toLocaleString('pt-BR')} m³/ano`;
    document.getElementById('economia-anual').textContent = `R$ ${economiaFinanceira.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('retorno-investimento').textContent = `${retornoAnos} anos`;
});

// Calculadora de Rotação de Culturas
const culturasAdicionadas = [];
const beneficiosPorCultura = {
    aveia: ["Melhora estrutura do solo", "Controla nematoides", "Adiciona matéria orgânica"],
    cevada: ["Protege o solo no inverno", "Recicla nutrientes", "Quebra ciclo de pragas"],
    braquiaria: ["Excelente cobertura", "Profundiza raízes", "Controla ervas daninhas"],
    crotalaria: ["Fixa nitrogênio", "Controla nematoides", "Atrai polinizadores"],
    girassol: ["Quebra compactação", "Recicla nutrientes profundos", "Melhora biodiversidade"],
    sorgo: ["Tolerante à seca", "Produz muita biomassa", "Protege o solo no verão"]
};

document.getElementById('adicionar-cultura').addEventListener('click', function() {
    const cultura = document.getElementById('nova-cultura').value;
    const nomeCultura = document.getElementById('nova-cultura').options[document.getElementById('nova-cultura').selectedIndex].text;
    
    if (!culturasAdicionadas.includes(cultura)) {
        culturasAdicionadas.push(cultura);
        
        const culturaItem = document.createElement('div');
        culturaItem.className = 'cultura-item';
        culturaItem.innerHTML = `
            <span>${nomeCultura}</span>
            <button data-cultura="${cultura}">×</button>
        `;
        
        document.getElementById('culturas-adicionadas').appendChild(culturaItem);
        
        // Adicionar evento de remoção
        culturaItem.querySelector('button').addEventListener('click', function() {
            const culturaToRemove = this.getAttribute('data-cultura');
            culturasAdicionadas.splice(culturasAdicionadas.indexOf(culturaToRemove), 1);
            this.parentElement.remove();
        });
    }
});

document.getElementById('gerar-rotacao').addEventListener('click', function() {
    if (culturasAdicionadas.length === 0) {
        alert('Adicione pelo menos uma cultura para rotação');
        return;
    }
    
    const culturaPrincipal = document.getElementById('cultura-principal').value;
    const nomePrincipal = document.getElementById('cultura-principal').options[document.getElementById('cultura-principal').selectedIndex].text;
    const periodo = parseInt(document.getElementById('periodo-rotacao').value);
    
    // Gerar calendário
    let calendarioHTML = '';
    for (let ano = 1; ano <= periodo; ano++) {
        calendarioHTML += `
            <div class="ano-rotacao">
                <div class="ano-titulo">${ano}º Ano:</div>
                <div class="culturas-ano">
                    <div class="cultura-semestre">1º Semestre: ${ano === 1 ? nomePrincipal : culturasAdicionadas[(ano-2) % culturasAdicionadas.length]}</div>
                    <div class="cultura-semestre">2º Semestre: ${culturasAdicionadas[(ano-1) % culturasAdicionadas.length]}</div>
                </div>
            </div>
        `;
    }
    
    document.getElementById('calendario-rotacao').innerHTML = calendarioHTML;
    
    // Mostrar benefícios
    let beneficiosHTML = '';
    culturasAdicionadas.forEach(cultura => {
        beneficiosPorCultura[cultura].forEach(beneficio => {
            beneficiosHTML += `<li>${beneficio} (${cultura.charAt(0).toUpperCase() + cultura.slice(1)})</li>`;
        });
    });
    
    document.getElementById('beneficios-lista').innerHTML = beneficiosHTML;
});

// Simulador de Plantio Direto
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabId = button.getAttribute('data-tab');
        
        // Esconder todas as tabs
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        
        // Desativar todos os botões
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Ativar tab e botão selecionados
        document.getElementById(`${tabId}-tab`).classList.add('active');
        button.classList.add('active');
    });
});

// Navegação entre tabs
document.querySelectorAll('.btn-next').forEach(button => {
    button.addEventListener('click', function() {
        const nextTab = this.getAttribute('data-next');
        document.querySelector(`.tab-btn[data-tab="${nextTab}"]`).click();
    });
});

document.querySelectorAll('.btn-prev').forEach(button => {
    button.addEventListener('click', function() {
        const prevTab = this.getAttribute('data-prev');
        document.querySelector(`.tab-btn[data-tab="${prevTab}"]`).click();
    });
});

// Cálculo dos resultados
document.querySelector('.btn-next[data-next="resultados"]').addEventListener('click', function() {
    const area = parseFloat(document.getElementById('area-total').value);
    const tipoSolo = document.getElementById('tipo-solo').value;
    const cultivoPrincipal = document.getElementById('cultivo-principal').value;
    const regiao = document.getElementById('regiao').value;
    
    const preparoSolo = parseFloat(document.getElementById('preparo-solo').value);
    const combustivel = parseFloat(document.getElementById('combustivel').value);
    const maoObra = parseFloat(document.getElementById('mao-obra').value);
    const fertilizantes = parseFloat(document.getElementById('fertilizantes').value);
    const produtividade = parseFloat(document.getElementById('produtividade').value);
    
    // Cálculos (valores ilustrativos)
    const economia1Ano = (preparoSolo * 0.6 + combustivel * 0.4 + maoObra * 0.3) * area;
    const investimentoInicial = area * (tipoSolo === 'arenoso' ? 1200 : tipoSolo === 'argiloso' ? 800 : 1000);
    const retornoAnos = Math.ceil(investimentoInicial / (economia1Ano * 0.8)); // 80% da economia para ROI
    
    // Ganho de produtividade baseado em diversos fatores
    let ganhoProdutividade = 10; // base
    if (regiao === 'centro-oeste') ganhoProdutividade += 5;
    if (cultivoPrincipal === 'soja') ganhoProdutividade += 3;
    if (tipoSolo === 'arenoso') ganhoProdutividade += 7;
    
    // Exibir resultados
    document.getElementById('economia-1ano').textContent = `R$ ${economia1Ano.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('investimento-inicial').textContent = `R$ ${investimentoInicial.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('retorno-tempo').textContent = retornoAnos === 1 ? '1 ano' : `${retornoAnos} anos`;
    document.getElementById('ganho-produtividade').textContent = `${ganhoProdutividade}%`;
    
    // Detalhes dos resultados
    const detalhesHTML = `
        <p>Com a adoção do plantio direto em sua propriedade de ${area} ha, você pode esperar:</p>
        <ul>
            <li>Economia imediata nos custos de preparo do solo e operações mecanizadas</li>
            <li>Redução gradual na necessidade de fertilizantes químicos</li>
            <li>Melhoria da estrutura do solo em ${tipoSolo === 'arenoso' ? 'solos arenosos' : tipoSolo === 'argiloso' ? 'solos argilosos' : 'solos de textura média'}</li>
            <li>Aumento progressivo da produtividade da ${cultivoPrincipal}</li>
            <li>Melhor retenção de água no solo, especialmente importante na região ${regiao}</li>
        </ul>
        <p><strong>Recomendação:</strong> Considere iniciar com uma área piloto de 20% da propriedade para avaliação dos resultados.</p>
    `;
    
    document.getElementById('detalhes-resultados').innerHTML = detalhesHTML;
});