// Painel demonstrativo: usa o mesmo localStorage da página principal.
const $ = (id) => document.getElementById(id);
const estados = ["Recebida", "Agendada", "Em andamento", "Concluída", "Cancelada"];
const bairros = ["Centro", "Jardim Pereira", "Jardim Primavera", "Nova Cidade", "Nova Matão", "Parque Industrial", "Residencial Nova Aurora", "Senhor Bom Jesus", "Outro bairro"];
function carregar(chave) { try { return JSON.parse(localStorage.getItem(chave)) || []; } catch { return []; } }
function guardar(chave, dados) { localStorage.setItem(chave, JSON.stringify(dados)); }
function elemento(tag, conteudo, classe) {
    const el = document.createElement(tag);
    if (conteudo !== undefined) el.textContent = String(conteudo);
    if (classe) el.className = classe;
    return el;
}
function avisar(texto) { $('mensagem').textContent = texto; }
function desenharPedidos() {
    const pedidos = carregar('pedidos');
    const termo = $('busca').value.trim().toLocaleLowerCase('pt-BR');
    const filtro = $('filtro-status').value;
    const exibidos = pedidos.filter(p => (!filtro || p.status === filtro) &&
        [p.protocolo,p.nome,p.bairro].some(v => String(v || '').toLocaleLowerCase('pt-BR').includes(termo)));
    $('total').textContent = pedidos.length;
    $('pendentes').textContent = pedidos.filter(p => ['Recebida','Agendada'].includes(p.status)).length;
    $('andamento').textContent = pedidos.filter(p => p.status === 'Em andamento').length;
    $('concluidas').textContent = pedidos.filter(p => p.status === 'Concluída').length;
    $('contagem-pedidos').textContent = exibidos.length + ' pedido(s)';
    const tbody = $('tabela-pedidos'); tbody.replaceChildren();
    exibidos.forEach(p => {
        const tr = elemento('tr');
        tr.append(elemento('td',p.protocolo));
        const pessoa = elemento('td'); pessoa.append(elemento('strong',p.nome || 'Sem nome'));
        pessoa.append(elemento('div',[p.endereco,p.numero].filter(Boolean).join(', '))); tr.append(pessoa);
        tr.append(elemento('td',p.bairro));
        tr.append(elemento('td',p.residuo + ' / ' + p.volume));
        tr.append(elemento('td',p.data));
        tr.append(elemento('td',p.status));
        const acao=elemento('td'); const select=elemento('select');
        select.setAttribute('aria-label','Alterar status de ' + p.protocolo);
        estados.forEach(s => {const opt=elemento('option',s);opt.value=s;select.append(opt);});
        select.value=p.status || 'Recebida';
        select.addEventListener('change', () => {
            const lista=carregar('pedidos');
            const pedido=lista.find(x=>x.protocolo===p.protocolo);
            if(pedido){pedido.status=select.value;guardar('pedidos',lista);desenharPedidos();avisar('Status atualizado: '+p.protocolo);}
        });
        acao.append(select); tr.append(acao);tbody.append(tr);
    });
    $('sem-pedidos').hidden = exibidos.length > 0;
}
function desenharRotas() {
    const rotas=carregar('rotas'); const container=$('lista-rotas');container.replaceChildren();
    $('sem-rotas').hidden=rotas.length>0;
    rotas.forEach((rota,i)=>{
        const div=elemento('article',undefined,'route');
        div.append(elemento('h3',rota.nome));
        div.append(elemento('p',rota.bairro+' • '+rota.data+' • '+(rota.equipe || 'Equipe não informada')));
        const qtd=carregar('pedidos').filter(p=>p.bairro===rota.bairro && p.status!=='Concluída' && p.status!=='Cancelada').length;
        div.append(elemento('p',qtd+' solicitação(ões) pendente(s) no bairro'));
        const remover=elemento('button','Excluir rota','button subtle');remover.type='button';
        remover.addEventListener('click',()=>{const todas=carregar('rotas');todas.splice(i,1);guardar('rotas',todas);desenharRotas();});
        div.append(remover);container.append(div);
    });
}
$('data-atual').textContent = new Date().toLocaleDateString('pt-BR');
$('rota-bairro').append(...bairros.map(b=>{const o=elemento('option',b);o.value=b;return o;}));
$('busca').addEventListener('input',desenharPedidos);
$('filtro-status').addEventListener('change',desenharPedidos);
$('atualizar').addEventListener('click',()=>{desenharPedidos();desenharRotas();avisar('Dados atualizados.');});
$('nova-rota').addEventListener('click',()=>$('dialog-rota').showModal());
$('fechar-dialog').addEventListener('click',()=>$('dialog-rota').close());
$('cancelar-rota').addEventListener('click',()=>$('dialog-rota').close());
$('form-rota').addEventListener('submit',evento=>{
    evento.preventDefault();const form=evento.currentTarget;
    const lista=carregar('rotas');
    lista.push({nome:form.elements.nome.value,bairro:form.elements.bairro.value,data:form.elements.data.value,equipe:form.elements.equipe.value});
    guardar('rotas',lista);form.reset();$('dialog-rota').close();desenharRotas();avisar('Rota criada.');
});
desenharPedidos();desenharRotas();
