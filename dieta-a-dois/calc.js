'use strict';
/* ================= Calculadora de preparo =================
   Lê um texto livre ("200g de frango cru com 1 colher de azeite...") e soma as calorias.
   Tudo roda no celular, sem internet e sem custo. Valores aproximados (base TACO + rótulos comuns). */

/* [id, nome, apelidos, kcal/100g, prot/100g, extras]
   k/p = pronto (ou como vem). cru:[k,p] quando muda ao cozinhar.
   Medidas em gramas: un (unidade média), col (colher de sopa), cha (colher de chá), fatia, concha, xic, copo, lata, pote. */
const FOOD_DB = [
  // Carnes e proteínas
  ['frango','Peito de frango','frango|peito de frango|file de frango|sassami|frango desfiado|peito',165,31,{cru:[120,23],un:150,bife:100}],
  ['coxa','Coxa/sobrecoxa sem pele','coxa|sobrecoxa|coxa de frango|sobrecoxa de frango',190,26,{cru:[140,18],un:90}],
  ['carne_moida','Carne moída (patinho)','carne moida|patinho|carne moida de patinho|moida',219,36,{cru:[133,22]}],
  ['carne','Carne vermelha magra (bife)','carne|alcatra|contra file|contrafile|coxao mole|coxao duro|maminha|lagarto|file mignon',230,32,{cru:[140,21],un:120,bife:120}],
  ['acem','Acém / músculo','acem|musculo|carne de panela',215,27,{cru:[136,21]}],
  ['porco','Lombo / carne de porco','porco|lombo|pernil|bisteca',210,30,{cru:[150,21],un:120,bife:120}],
  ['tilapia','Tilápia','tilapia|peixe|file de peixe|merluza|pescada',128,26,{cru:[96,20],un:120,file:120}],
  ['salmao','Salmão','salmao',230,25,{cru:[208,20],file:150}],
  ['atum','Atum em lata (drenado)','atum|atum em lata|atum ralado|atum solido',116,26,{lata:120,col:15}],
  ['sardinha','Sardinha em lata','sardinha',210,24,{lata:84}],
  ['camarao','Camarão','camarao',99,21,{cru:[85,18],un:10}],
  ['coracao','Coração de galinha','coracao|coracao de galinha|coracaozinho',183,26,{cru:[137,16],un:6}],
  ['figado','Fígado bovino','figado|figado bovino|bife de figado',175,27,{cru:[135,20],bife:100}],
  ['linguica','Linguiça','linguica|linguica toscana|calabresa',300,16,{un:80}],
  ['salsicha','Salsicha','salsicha|hot dog',255,12,{un:50}],
  ['bacon','Bacon','bacon',540,12,{fatia:10}],
  ['presunto','Presunto','presunto',94,14,{fatia:15}],
  ['peru','Peito de peru','peito de peru|peru',105,18,{fatia:15}],
  ['ovo','Ovo','ovo|ovo cozido|ovo mexido|ovo frito|omelete',143,12.6,{un:50}],
  ['clara','Clara de ovo','clara|clara de ovo',52,11,{un:33}],
  ['whey','Whey protein','whey|whey protein',400,80,{un:30,scoop:30,col:15}],
  ['tofu','Tofu','tofu',76,8,{}],

  // Laticínios
  ['mussarela','Mussarela','mussarela|muçarela|mozarela|queijo|queijo mussarela',300,22,{fatia:20,col:15,un:20}],
  ['prato','Queijo prato','queijo prato',360,23,{fatia:20}],
  ['cheddar','Cheddar light','cheddar|cheddar light',260,18,{fatia:20}],
  ['minas','Queijo minas frescal','minas|queijo minas|minas frescal|queijo branco',264,17,{fatia:30}],
  ['parmesao','Parmesão ralado','parmesao|queijo ralado',450,36,{col:10}],
  ['requeijao_light','Requeijão light','requeijao light|requeijao|catupiry light',150,8,{col:30,cha:10}],
  ['requeijao','Requeijão tradicional','requeijao tradicional|catupiry|cream cheese',260,9.6,{col:30,cha:10}],
  ['cottage','Cottage','cottage',98,11,{col:20}],
  ['ricota','Ricota','ricota',140,11,{col:25,fatia:30}],
  ['iogurte','Iogurte natural','iogurte|iogurte natural|iogurte desnatado',63,4,{pote:170,col:20}],
  ['iogurte_grego','Iogurte grego','iogurte grego|grego',130,5,{pote:100,col:20}],
  ['leite','Leite desnatado','leite|leite desnatado',35,3.3,{copo:200,xic:240,col:15}],
  ['leite_int','Leite integral','leite integral',61,3.2,{copo:200,xic:240,col:15}],
  ['leite_po','Leite em pó desnatado','leite em po|leite em po desnatado|leite ninho',362,35,{col:12,cha:4}],
  ['creme_leite','Creme de leite light','creme de leite|creme de leite light',140,2.5,{col:15,caixa:200}],
  ['manteiga','Manteiga','manteiga',717,0.9,{col:14,cha:5,un:10}],
  ['margarina','Margarina','margarina',596,0,{col:14,cha:5}],

  // Carboidratos
  ['arroz','Arroz branco','arroz|arroz branco',128,2.5,{cru:[358,7.3],col:25,concha:100,xic:160,escumadeira:90}],
  ['arroz_int','Arroz integral','arroz integral',124,2.6,{cru:[360,7.3],col:25,xic:160}],
  ['feijao','Feijão','feijao|feijao carioca|feijao preto|caldo de feijao',76,4.8,{cru:[329,20],concha:100,col:20}],
  ['lentilha','Lentilha / grão-de-bico','lentilha|grao de bico|grao-de-bico',115,8,{cru:[340,22],concha:100,col:20}],
  ['macarrao','Macarrão','macarrao|espaguete|penne|massa|talharim|parafuso',157,5.8,{cru:[371,13],xic:140,pegador:110}],
  ['batata','Batata inglesa','batata|batata inglesa|pure de batata|pure',80,1.9,{cru:[77,1.8],un:150}],
  ['batata_doce','Batata-doce','batata doce|batata-doce',87,1.3,{cru:[86,1.3],un:200}],
  ['mandioca','Mandioca / aipim','mandioca|aipim|macaxeira',125,0.6,{cru:[151,1.1],un:150}],
  ['abobora','Abóbora','abobora|cabotia|pure de abobora|jerimum',30,1,{cru:[30,1.1],col:30}],
  ['quinoa','Quinoa','quinoa',120,4.4,{cru:[368,14],xic:170,col:20}],
  ['tapioca','Goma de tapioca','tapioca|goma|goma de tapioca',233,0,{col:20}],
  ['cuscuz','Cuscuz (flocão)','cuscuz|flocao',113,2.2,{cru:[360,7],col:20}],
  ['aveia','Aveia','aveia|farelo de aveia|flocos de aveia',380,14,{col:10,cha:4,xic:80}],
  ['granola','Granola','granola',420,9,{col:15}],
  ['pao_integral','Pão integral (forma)','pao integral|pao de forma integral',260,12,{fatia:25,un:25}],
  ['pao_forma','Pão de forma branco','pao de forma|pao de forma tradicional',270,8,{fatia:25,un:25}],
  ['pao_frances','Pão francês','pao|pao frances|paes|pao de sal|cacetinho',300,8,{un:50}],
  ['pao_hamb','Pão de hambúrguer','pao de hamburguer|pao de hamburguer integral',270,9,{un:55}],
  ['rap10','Rap10 / wrap','rap10|rap 10|rap10 integral|wrap|tortilha|tortilla|pao folha',290,8,{un:40}],
  ['torrada','Torrada integral','torrada|torradas|torrada integral',390,11,{un:8}],
  ['biscoito','Biscoito maisena / cream cracker','biscoito|bolacha|maisena|cream cracker',440,9,{un:6}],
  ['milho','Milho verde (lata)','milho|milho verde',80,2.6,{col:20,lata:170}],
  ['ervilha','Ervilha (lata)','ervilha',74,4.6,{col:20,lata:170}],
  ['pipoca','Pipoca (milho)','pipoca|milho de pipoca',380,12,{col:12}],
  ['farofa','Farofa / farinha de mandioca','farofa|farinha de mandioca|farinha',365,1.5,{col:15}],

  // Frutas
  ['banana','Banana','banana|banana prata|banana nanica',98,1.3,{un:90}],
  ['maca','Maçã','maca',56,0.3,{un:130}],
  ['pera','Pera','pera',53,0.6,{un:160}],
  ['laranja','Laranja','laranja|mexerica|tangerina|bergamota',47,1,{un:150}],
  ['mamao','Mamão','mamao|papaia',40,0.5,{un:300,fatia:150}],
  ['morango','Morango','morango',30,0.9,{un:12,xic:150}],
  ['uva','Uva','uva',69,0.7,{un:5,cacho:200}],
  ['manga','Manga','manga',64,0.4,{un:250}],
  ['abacaxi','Abacaxi','abacaxi',48,0.9,{fatia:80,rodela:80}],
  ['melancia','Melancia / melão','melancia|melao',33,0.9,{fatia:200}],
  ['kiwi','Kiwi','kiwi',51,1.3,{un:75}],
  ['maracuja','Maracujá (polpa)','maracuja|polpa de maracuja',68,2,{un:50}],
  ['abacate','Abacate','abacate',96,1.2,{col:30,un:400}],
  ['limao','Limão (suco)','limao|suco de limao',30,0.5,{un:30,col:15}],

  // Legumes e verduras
  ['cebola','Cebola','cebola|cebola roxa',40,1.7,{un:110}],
  ['tomate','Tomate','tomate|tomate cereja',15,1.1,{un:100}],
  ['alho','Alho','alho|dente de alho',113,7,{un:4,dente:4,col:10}],
  ['cenoura','Cenoura','cenoura',34,1.3,{un:100}],
  ['abobrinha','Abobrinha','abobrinha',19,1.1,{un:200}],
  ['brocolis','Brócolis','brocolis',25,2.1,{un:300,xic:90,ramo:30}],
  ['couve_flor','Couve-flor','couve flor|couve-flor',23,1.9,{xic:100,ramo:30}],
  ['couve','Couve / repolho','couve|repolho|acelga',25,1.8,{xic:70,folha:20}],
  ['alface','Alface / folhas','alface|rucula|agriao|salada',13,1.3,{folha:10,prato:50,xic:50}],
  ['espinafre','Espinafre','espinafre',22,2.4,{xic:60,folha:10}],
  ['pepino','Pepino','pepino',10,0.7,{un:150}],
  ['pimentao','Pimentão','pimentao',21,1,{un:120}],
  ['cogumelo','Cogumelo','cogumelo|champignon|shimeji|shitake',25,2.5,{un:10,xic:70}],
  ['berinjela','Berinjela','berinjela',20,1.2,{un:250}],
  ['chuchu','Chuchu / vagem / quiabo','chuchu|vagem|quiabo|jilo',22,1.5,{un:200}],
  ['beterraba','Beterraba','beterraba',49,1.9,{un:120}],
  ['legumes','Legumes variados','legume|legumes|legumes cozidos|mix de legumes',30,1.5,{xic:120,concha:100}],

  // Gorduras, molhos e doces
  ['azeite','Azeite','azeite|azeite de oliva|fio de azeite',884,0,{col:12,cha:4,fio:4}],
  ['oleo','Óleo','oleo|oleo de soja|oleo de coco|banha',884,0,{col:12,cha:4,fio:4}],
  ['maionese_light','Maionese light','maionese light|maionese lite|maionese diet',270,0.5,{col:12,cha:4,sache:7}],
  ['maionese','Maionese tradicional','maionese|maionese tradicional',660,0.6,{col:12,cha:4,sache:7}],
  ['ketchup','Ketchup','ketchup|catchup',100,1.5,{col:12,cha:4,sache:7}],
  ['mostarda','Mostarda','mostarda',70,4,{col:10,cha:4,sache:7}],
  ['molho_tomate','Molho de tomate','molho de tomate|extrato de tomate|molho|passata',38,1.4,{col:15,concha:80,xic:240}],
  ['shoyu','Shoyu','shoyu|molho shoyu|molho de soja',55,6,{col:15,cha:5}],
  ['pasta_amendoim','Pasta de amendoim','pasta de amendoim|manteiga de amendoim',590,25,{col:15,cha:5}],
  ['amendoim','Amendoim / castanhas','amendoim|castanha|castanhas|nozes|amendoas|mix de castanhas',580,22,{un:1.5,col:12,punhado:25}],
  ['chia','Chia / linhaça','chia|linhaca',490,17,{col:12,cha:4}],
  ['mel','Mel','mel',309,0.3,{col:21,cha:7}],
  ['acucar','Açúcar','acucar|acucar mascavo|acucar demerara',387,0,{col:12,cha:5,sache:5}],
  ['cacau','Cacau em pó','cacau|cacau em po|chocolate em po',300,20,{col:8,cha:3}],
  ['chocolate','Chocolate','chocolate|chocolate 70|chocolate amargo|barra de chocolate',560,7,{un:5,quadradinho:5,barra:90}],
  ['leite_cond','Leite condensado','leite condensado',321,7.7,{col:20}],
  ['doce_leite','Doce de leite / Nutella','doce de leite|nutella|creme de avela',540,6,{col:20}],
  ['pudim','Pudim de saquinho (pronto)','pudim',110,3,{un:120}],
  ['sorvete','Sorvete','sorvete|picole',200,3.5,{col:30,bola:60,un:60}],

  // Bebidas
  ['refri','Refrigerante comum','refrigerante|refri|coca|coca cola|guarana',42,0,{lata:350,copo:250}],
  ['suco','Suco de laranja natural','suco|suco de laranja|suco natural',45,0.7,{copo:250}],
  ['cerveja','Cerveja','cerveja|chopp|chope',41,0.3,{lata:350,copo:300,long:355}],
  ['vinho','Vinho','vinho',85,0,{taca:150}],

  // Prontos / refeição livre
  ['pizza','Pizza (fatia)','pizza',260,11,{fatia:110,un:110,pedaco:110}],
  ['hamburguer_lanch','Hambúrguer de lanchonete','hamburguer de lanchonete|x burguer|x-burguer|cheeseburguer|big mac',250,13,{un:200}],
  ['hamburguer','Hambúrguer (carne, pronto)','hamburguer|burguer|blend',250,25,{cru:[200,19],un:120}],
  ['batata_frita','Batata frita','batata frita|fritas',310,3.4,{porcao:100}],
  ['coxinha','Salgado frito (coxinha, pastel)','coxinha|pastel|salgado|esfiha|kibe|quibe|empada',290,8,{un:80}],
  ['pao_queijo','Pão de queijo','pao de queijo',330,5,{un:25}],
  ['brigadeiro','Brigadeiro','brigadeiro',410,4,{un:20}],
  ['bolo','Bolo simples','bolo|fatia de bolo',330,5,{fatia:60}],
  ['lasanha','Lasanha','lasanha',160,9,{pedaco:300,fatia:300}],
  ['strogonoff','Strogonoff tradicional','strogonoff|estrogonofe',180,12,{concha:150}],
  ['acai','Açaí na tigela','acai',110,1,{copo:300,tigela:400}],

  // Zero / quase zero
  ['tempero','Temperos e ervas','tempero|temperos|sal|pimenta|oregano|paprica|cominho|curcuma|acafrao|cheiro verde|salsinha|cebolinha|coentro|alho em po|cebola em po|canela|ervas|lemon pepper|chimichurri|caldo|vinagre|adocante|agua|cafe preto|cafe sem acucar|cha verde|cha mate|gelatina zero|refrigerante zero|refri zero|coca zero',0,0,{}],
];

const FOODS_IDX = (()=>{
  const fold = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/([a-z])\1+/g,'$1');
  const list=[];
  FOOD_DB.forEach(([id,n,al,k,p,x])=>{
    const f={id,n,k,p,...x};
    al.split('|').forEach(a=>{ const fa=fold(a).replace(/-/g,' ').trim(); list.push({f,len:fa.length,re:new RegExp(`(^|[^a-z0-9])(${fa.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/ /g,'\\s+')})(s|es)?(?=[^a-z0-9]|$)`,'g')}); });
  });
  list.sort((a,b)=>b.len-a.len);
  return {list, fold, byId:Object.fromEntries(FOOD_DB.map(([id,n,al,k,p,x])=>[id,{id,n,k,p,...x}]))};
})();

const BRANDS = /\b(hellmann?s?|helmann?s?|helmans?|hellmans|heinz|quero|nestle|sadia|seara|perdigao|italac|piracanjuba|danone|batavo|vigor|qualy|becel|tirolez|president|catupiry|wickbold|pullman|visconti|bauducco|tio joao|camil|kicaldo|knorr|maggi|liza|soya|gallo|andorinha|predilecta|coqueiro|gomes da costa|swift|friboi|aurora|elma chips|ninho|molico|itambe|yoki|rap ?10 da)\b/g;
const NUMWORDS = {meia:.5,meio:.5,um:1,uma:1,dois:2,duas:2,tres:3,quatro:4,cinco:5,seis:6,sete:7,oito:8,nove:9,dez:10,doze:12};
const STOP = new Set('de do da dos das no na nos nas em um uma com sem pra para bem pouco pouca muito meu minha so apenas tipo marca e ou ao a o os as preparado preparada preparados feito feita temperado temperada refogado refogada cozido cozida cozidos grelhado grelhada assado assada frito frita cru crua crus cruas pronto pronta prontos picado picada picados ralado ralada desfiado desfiada fatiado amassado pequeno pequena pequenos pequenas medio media grande grandes fit light lite zero diet integral natural caseiro caseira airfryer panela frigideira forno microondas micro ondas cheia cheio rasa raso sopa cha sobremesa gosto mexido mexida batido batida escorrido drenado pele osso inteiro inteira metade seco seca fresco fresca congelado congelada tostado tostada torrado torrada derretido derretida cada'.split(' '));

/* Unidades → chave de medida no alimento + gramas padrão */
const UNIT_RE = /(\d+(?:\.\d+)?)\s*(kg|quilos?|gramas?|grs?|g|ml|mls|litros?|l|colher(?:es)?(?:\s+de)?(?:\s+(?:sopa|cha|sobremesa))?|col(?:\.|s)?(?:\s+de)?(?:\s+(?:sopa|cha|sobremesa))?|xicaras?|xic|copos?|conchas?|escumadeiras?|fatias?|rodelas?|latas?|latinhas?|potes?|potinhos?|scoops?|medidas?|dentes?|unidades?|und|un|pedacos?|folhas?|punhados?|bifes?|files?|postas?|ramos?|sache?s?|fios?|bolas?|tacas?|cachos?|quadradinhos?|barras?|caixinhas?|caixas?|tigelas?|porcao|porcoes|pratos?|pegadores?|long ?necks?)?(?![a-z])/g;

function unitKey(u){
  if(!u) return null;
  if(/^(kg|quilo)/.test(u)) return 'kg';
  if(/^(gramas?|grs?|g)$/.test(u)) return 'g';
  if(/^(ml|mls)$/.test(u)) return 'ml';
  if(/^(litro|l$)/.test(u)) return 'l';
  if(/^col/.test(u)) return /cha/.test(u)?'cha':/sobremesa/.test(u)?'sobremesa':'col';
  const map={xic:'xic',copo:'copo',concha:'concha',escumadeira:'escumadeira',fatia:'fatia',rodela:'rodela',lat:'lata',pot:'pote',scoop:'scoop',medida:'scoop',dente:'dente',unidade:'un',und:'un',un:'un',pedaco:'pedaco',folha:'folha',punhado:'punhado',bife:'bife',file:'file',posta:'file',ramo:'ramo',sache:'sache',fio:'fio',bola:'bola',taca:'taca',cacho:'cacho',quadradinho:'quadradinho',barra:'barra',caix:'caixa',tigela:'tigela',porc:'porcao',prato:'prato',pegador:'pegador',long:'long'};
  for(const k in map) if(u.startsWith(k)) return map[k];
  return 'un';
}
const UNIT_LABEL = {g:'g',kg:'kg',ml:'ml',l:'L',col:'col. sopa',cha:'col. chá',sobremesa:'col. sobremesa',xic:'xícara',copo:'copo',concha:'concha',fatia:'fatia',lata:'lata',pote:'pote',scoop:'scoop',dente:'dente',un:'un.'};
const UNIT_DEFAULT = {col:15,cha:5,xic:160,copo:250,concha:100,escumadeira:90,fatia:25,rodela:15,lata:350,pote:170,scoop:30,dente:4,folha:10,punhado:30,ramo:30,sache:7,fio:4,bola:60,taca:150,cacho:200,quadradinho:5,barra:90,caixa:200,tigela:300,porcao:100,prato:300,pegador:110,long:355};

function toGrams(f, n, uk, size){
  if(uk==='g'||uk==='ml') return n;
  if(uk==='kg'||uk==='l') return n*1000;
  const sz = size||1;
  if(uk==='sobremesa') return n*(f.col||15)*0.66;
  if(uk==='cha') return n*(f.cha || (f.col? f.col/3 : 5));
  if(uk==='bife'||uk==='file') return n*(f[uk]||f.bife||f.file||f.un||120)*sz;
  if(uk && uk!=='un' && uk!=='pedaco') return n*(f[uk]||UNIT_DEFAULT[uk]||100)*(['col','xic','concha','copo'].includes(uk)?1:sz);
  // sem unidade ou "unidade/pedaço"
  if(uk===null && n>=15 && !f.un) return n;          // "200 frango" → gramas
  if(uk===null && n>=40 && f.un && n>f.un*0.6) return n; // "150 batata" → gramas
  return n*(f.un||f.pedaco||100)*sz;
}

function parseMeal(text){
  const fold = FOODS_IDX.fold;
  let t = fold(text)
    .replace(/(\d),(\d)/g,'$1.$2')
    .replace(/(\d+)\s*\/\s*(\d+)/g,(m,a,b)=>String(+a/+b))
    .replace(/\b(ligth|lite|lait|ligt)\b/g,'light')
    .replace(/maion\w*/g,'maionese')
    .replace(/\brap\s*10\b/g,'rap10')
    .replace(BRANDS,' ')
    .replace(/[()\[\]"“”'!?]/g,' ');
  t = t.replace(/\b(meia|meio|um|uma|dois|duas|tres|quatro|cinco|seis|sete|oito|nove|dez|doze)\b/g,(m)=>String(NUMWORDS[m]));
  const clauses = t.split(/[,;\n+]|\.(?!\d)|\s(?:e|com|mais|alem de|junto com|acompanhado de)\s/).map(s=>' '+s.trim()+' ').filter(s=>s.trim());
  const rows=[];
  for(const cl of clauses){
    // 1) alimentos (maior apelido primeiro, sem sobreposição)
    const hits=[];
    for(const a of FOODS_IDX.list){ a.re.lastIndex=0; let m; while((m=a.re.exec(cl))){ const s=m.index+m[1].length, e=s+m[2].length+(m[3]||'').length; if(!hits.some(h=>s<h.e&&e>h.s)) hits.push({f:a.f,s,e}); } }
    hits.sort((a,b)=>a.s-b.s);
    // 2) quantidades (com os nomes apagados, pra "rap10" não virar "10")
    let blank=cl; hits.forEach(h=>{ blank=blank.slice(0,h.s)+' '.repeat(h.e-h.s)+blank.slice(h.e); });
    const qs=[]; UNIT_RE.lastIndex=0; let m;
    while((m=UNIT_RE.exec(blank))){ qs.push({n:+m[1],uk:unitKey(m[2]),s:m.index,e:m.index+m[0].replace(/\s+$/,'').length,used:false}); }
    // sobras de texto que não entendemos
    let rest=blank; qs.forEach(q=>{ rest=rest.slice(0,q.s)+' '.repeat(q.e-q.s)+rest.slice(q.e); });
    const leftover = rest.split(/\s+/).filter(w=>w.length>=3 && !STOP.has(w) && !STOP.has(w.replace(/s$/,'')) && !/^\d/.test(w));

    hits.forEach((h,i)=>{
      const prevEnd = i? hits[i-1].e : 0, nextStart = i<hits.length-1? hits[i+1].s : cl.length;
      let q = qs.filter(q=>!q.used && q.e<=h.s && q.s>=prevEnd).pop() || qs.find(q=>!q.used && q.s>=h.e && q.e<=nextStart);
      if(q) q.used=true;
      const zone = cl.slice(prevEnd, nextStart);
      const size = /pequen/.test(zone)?0.7 : /grande/.test(zone)?1.4 : 1;
      const state = h.f.cru ? (/\bcrus?a?s?\b/.test(zone)?'cru' : 'pronto') : 'pronto';
      const n = q? q.n : 1, uk = q? q.uk : null;
      rows.push({fid:h.f.id, g:Math.round(toGrams(h.f,n,uk,size)), state, src:cl.slice(Math.min(h.s, q?q.s:h.s), Math.max(h.e, q?q.e:h.e)).trim(), guess:!q && h.f.k>0});
    });
    // quantidade sem alimento conhecido, ou palavra desconhecida
    if(leftover.length && (!hits.length || qs.some(q=>!q.used))){
      const q=qs.find(q=>!q.used);
      rows.push({fid:null, src:cl.trim(), q:q?{n:q.n,uk:q.uk}:null, g:q&&(q.uk==='g'||q.uk==='ml')?q.n:0, state:'pronto'});
    }
  }
  return rows;
}

function rowVals(r){
  const f=FOODS_IDX.byId[r.fid]; if(!f) return {k:0,p:0};
  const [k,p] = r.state==='cru'&&f.cru ? f.cru : [f.k,f.p];
  return {k:r.g*k/100, p:r.g*p/100};
}

/* ================= Tela ================= */
const CALC = {text:'', rows:null, serv:1, ate:1, name:''};

function calcForm(){
  return `<div style="margin-top:10px">
    <label class="f"><span>Descreva o que preparou ou comeu</span>
      <textarea class="field" id="ct" rows="4" placeholder="Ex: 200g de frango cru com 1 colher de azeite e temperos, 1 cebola, 2 tomates pequenos, 33g de rap10 e 1 colher de maionese light">${h(CALC.text)}</textarea></label>
    <button class="btn" data-a="calcRun">${ic('calculator',19)} Calcular</button>
    <div id="calcOut">${CALC.rows?calcOut():`<p class="muted small" style="margin:12px 4px 0">Dica: escreva a quantidade antes de cada coisa (200g, 1 colher, 2 fatias…) e diga se pesou <b>cru</b> ou <b>pronto</b>.</p>`}</div></div>`;
}

function foodOptions(sel){
  return `<option value="">Escolher alimento…</option>`+[...FOOD_DB].sort((a,b)=>a[1].localeCompare(b[1])).map(([id,n])=>`<option value="${id}" ${id===sel?'selected':''}>${h(n)}</option>`).join('');
}

function calcOut(){
  const rows=CALC.rows;
  if(!rows.length) return `<div class="empty">${ic('search',30)}Não reconheci nenhum alimento<br>Tente algo como “150g de arroz pronto”.</div>`;
  return `<div class="sec">Ingredientes</div>
    ${rows.map((r,i)=>{ const f=FOODS_IDX.byId[r.fid], v=rowVals(r);
      return `<div class="crow ${f?'':'unk'}">
        <div class="grow">
          ${f?`<div class="t">${h(f.n)} ${f.cru?`<button class="mini ${r.state==='cru'?'on':''}" data-a="calcState" data-i="${i}">${r.state==='cru'?'cru':'pronto'}</button>`:''}</div>`
            :`<select class="field sel" data-calc="fid" data-i="${i}">${foodOptions('')}</select>`}
          <div class="muted small">${f?'':'<span style="color:var(--warn);font-weight:700">Não entendi:</span> '}“${h(r.src)}”${r.guess?' · quantidade estimada':''}</div>
        </div>
        <div class="gq" ${f&&f.k===0?'style="visibility:hidden"':''}><input type="number" inputmode="decimal" data-calc="g" data-i="${i}" value="${r.g}"><span>g</span></div>
        <div class="ck" id="ck${i}">${R(v.k)}<small>kcal</small></div>
        <button class="x" data-a="calcDel" data-i="${i}" aria-label="Remover">${ic('x',16)}</button></div>`; }).join('')}
    <button class="chip" style="margin-top:10px" data-a="calcAddRow">+ ingrediente</button>
    <div class="ctotal" id="ctotal"></div>
    <div class="grid2" style="margin-top:12px">
      <label class="f"><span>Rendeu quantas porções?</span><input class="field" data-calc="serv" type="number" inputmode="decimal" step="any" value="${CALC.serv}"></label>
      <label class="f"><span>Quantas você comeu?</span><input class="field" data-calc="ate" type="number" inputmode="decimal" step="any" value="${CALC.ate}"></label></div>
    <label class="f"><span>Nome</span><input class="field" data-calc="name" type="text" value="${h(CALC.name||autoName())}"></label>
    <label class="row" style="gap:10px;margin:0 4px 6px"><input type="checkbox" id="calcSave" style="width:22px;height:22px;accent-color:var(--accent)"> <span>Salvar como receita em “Meus alimentos”</span></label>
    <div class="btns"><button class="btn" data-a="calcAdd">Adicionar em ${MEALS.find(m=>m.id===UI.addMeal).label}</button></div>
    <p class="muted small" style="margin:10px 4px 0">Valores aproximados. Confira as quantidades e toque em cru/pronto pra trocar.</p>`;
}
function autoName(){ const ns=(CALC.rows||[]).map(r=>FOODS_IDX.byId[r.fid]).filter(f=>f&&f.k>0).map(f=>f.n.split(/[ (/]/)[0]); return ns.length?ns.slice(0,3).join(' + '):'Receita'; }

function calcTotals(){
  let k=0,p=0; CALC.rows.forEach((r,i)=>{ const v=rowVals(r); k+=v.k; p+=v.p; const el=document.getElementById('ck'+i); if(el) el.innerHTML=`${R(v.k)}<small>kcal</small>`; });
  const serv=CALC.serv>0?CALC.serv:1, ate=CALC.ate>0?CALC.ate:0;
  const el=document.getElementById('ctotal');
  if(el) el.innerHTML=`<div class="preview" style="margin:12px 0 0"><div><b>${R(k)}</b><span class="muted small">kcal no total</span></div><div><b>${fmt(p)}</b><span class="muted small">g proteína</span></div></div>
    ${serv!==1||ate!==1?`<div class="tip" style="margin-top:10px">Você comeu <b>${R(k/serv*ate)} kcal</b> e <b>${fmt(p/serv*ate)} g</b> de proteína (${fmt(ate)} de ${fmt(serv)} porções).</div>`:''}`;
  return {k,p,serv,ate};
}

Object.assign(A, {
  calcRun(){
    CALC.text=document.getElementById('ct').value; CALC.rows=parseMeal(CALC.text); CALC.name='';
    document.getElementById('calcOut').innerHTML=calcOut(); if(CALC.rows.length) calcTotals();
    document.getElementById('calcOut').scrollIntoView({behavior:'smooth',block:'start'}); buzz();
  },
  calcState(t){ const r=CALC.rows[+t.dataset.i]; r.state=r.state==='cru'?'pronto':'cru'; t.textContent=r.state; t.classList.toggle('on',r.state==='cru'); calcTotals(); },
  calcDel(t){ CALC.rows.splice(+t.dataset.i,1); document.getElementById('calcOut').innerHTML=calcOut(); if(CALC.rows.length) calcTotals(); },
  calcAddRow(){ CALC.rows.push({fid:null,src:'novo ingrediente',g:100,state:'pronto'}); document.getElementById('calcOut').innerHTML=calcOut(); calcTotals(); },
  calcAdd(){
    const {k,p,serv,ate}=calcTotals();
    if(!k) return toast('Nada pra somar ainda',false);
    if(!(ate>0)) return toast('Coloque quanto você comeu',false);
    const name=(document.querySelector('[data-calc="name"]').value.trim()||autoName());
    let it={key:'q:'+uid(),name,unit:'porção',k1:k/serv,p1:p/serv,code:''};
    if(document.getElementById('calcSave').checked){ const c={id:uid(),name,unit:'porção',k1:k/serv,p1:p/serv,def:1}; S.custom.push(c); it={...it,key:'c:'+c.id}; }
    addEntry(it,ate,UI.addMeal); CALC.text=''; CALC.rows=null; CALC.serv=1; CALC.ate=1; CALC.name='';
    closeSheet(); render(); toast(`Adicionado: ${R(k/serv*ate)} kcal`);
  },
});

document.addEventListener('input',e=>{
  const t=e.target, c=t.dataset&&t.dataset.calc; if(!c) return;
  if(c==='g'){ CALC.rows[+t.dataset.i].g=parseFloat(t.value.replace(',','.'))||0; calcTotals(); }
  else if(c==='serv'||c==='ate'){ CALC[c]=parseFloat(t.value.replace(',','.'))||0; calcTotals(); }
  else if(c==='name'){ CALC.name=t.value; }
});
document.addEventListener('change',e=>{
  const t=e.target; if(!t.dataset||t.dataset.calc!=='fid') return;
  const r=CALC.rows[+t.dataset.i], f=FOODS_IDX.byId[t.value]; if(!f) return;
  r.fid=f.id; if(r.q) r.g=Math.round(toGrams(f,r.q.n,r.q.uk,1)); else if(!r.g) r.g=f.un||100;
  document.getElementById('calcOut').innerHTML=calcOut(); calcTotals();
});
document.addEventListener('input',e=>{ if(e.target.id==='ct') CALC.text=e.target.value; });
