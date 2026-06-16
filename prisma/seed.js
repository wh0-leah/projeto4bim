import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log(' Iniciando seed do banco de dados...');

  
  const senhaAdmin = await bcrypt.hash('admin123', 12);
  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@catalogo.com' },
    update: {},
    create: {
      nome: 'Administrador',
      email: 'admin@catalogo.com',
      senhaHash: senhaAdmin,
      role: 'ADMIN',
      bio: 'Administrador do sistema.',
    },
  });
  console.log(' Admin criado:', admin.email);

  
  const senhaTeste = await bcrypt.hash('teste123', 12);
  const usuario = await prisma.usuario.upsert({
    where: { email: 'usuario@catalogo.com' },
    update: {},
    create: {
      nome: 'João Silva',
      email: 'usuario@catalogo.com',
      senhaHash: senhaTeste,
      bio: 'Cinéfilo apaixonado por ficção científica.',
    },
  });
  console.log(' Usuário teste criado:', usuario.email);

  
  const filmes = [
    {
      titulo: 'Interestelar',
      diretor: 'Christopher Nolan',
      generos: ['Ficção Científica', 'Drama', 'Aventura'],
      elenco: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
      anoLancamento: 2014,
      duracao: 169,
      sinopse: 'Um grupo de exploradores viaja através de um buraco de minhoca no espaço.',
      classificacao: 'DOZE',
      mediaAvaliacao: 9.2,
      usuarioCriadoPorId: admin.id,
    },
    {
      titulo: 'Parasita',
      diretor: 'Bong Joon-ho',
      generos: ['Drama', 'Thriller', 'Comédia'],
      elenco: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong'],
      anoLancamento: 2019,
      duracao: 132,
      sinopse: 'Toda a família Ki-taek está desempregada e passa a infiltrar-se na família rica Park.',
      classificacao: 'QUATORZE',
      mediaAvaliacao: 8.5,
      usuarioCriadoPorId: admin.id,
    },
    {
      titulo: 'Clube da Luta',
      diretor: 'David Fincher',
      generos: ['Drama', 'Thriller'],
      elenco: ['Brad Pitt', 'Edward Norton', 'Helena Bonham Carter'],
      anoLancamento: 1999,
      duracao: 139,
      sinopse: 'Um executivo insone e um vendedor de sabão criam um clube de luta clandestino.',
      classificacao: 'DEZOITO',
      mediaAvaliacao: 8.8,
      usuarioCriadoPorId: admin.id,
    },
    {
      titulo: 'Coringa',
      diretor: 'Todd Phillips',
      generos: ['Drama', 'Thriller', 'Crime'],
      elenco: ['Joaquin Phoenix', 'Robert De Niro', 'Zazie Beetz'],
      anoLancamento: 2019,
      duracao: 122,
      sinopse: 'A jornada de um comediante fracassado que se torna o famoso vilão do Batman.',
      classificacao: 'DEZESSEIS',
      mediaAvaliacao: 8.4,
      usuarioCriadoPorId: admin.id,
    },
    {
      titulo: 'Oppenheimer',
      diretor: 'Christopher Nolan',
      generos: ['Biografia', 'Drama', 'História'],
      elenco: ['Cillian Murphy', 'Emily Blunt', 'Robert Downey Jr.'],
      anoLancamento: 2023,
      duracao: 180,
      sinopse: 'A história do físico J. Robert Oppenheimer e o desenvolvimento da bomba atômica.',
      classificacao: 'QUATORZE',
      mediaAvaliacao: 8.9,
      usuarioCriadoPorId: admin.id,
    },
  ];

  for (const f of filmes) {
    await prisma.filme.upsert({
      where: { id: f.titulo.replace(/\s/g, '-').toLowerCase() },
      update: {},
      create: { id: f.titulo.replace(/\s/g, '-').toLowerCase(), ...f },
    });
  }
  console.log(' Filmes criados:', filmes.length);

  
  const series = [
    {
      titulo: 'Breaking Bad',
      criador: 'Vince Gilligan',
      generos: ['Drama', 'Crime', 'Thriller'],
      elenco: ['Bryan Cranston', 'Aaron Paul', 'Anna Gunn'],
      temporadas: 5,
      anoInicio: 2008,
      anoFim: 2013,
      status: 'FINALIZADA',
      sinopse: 'Um professor de química doente transforma-se em traficante de drogas.',
      classificacao: 'DEZOITO',
      mediaAvaliacao: 9.5,
      usuarioCriadoPorId: admin.id,
    },
    {
      titulo: 'Stranger Things',
      criador: 'Irmãos Duffer',
      generos: ['Ficção Científica', 'Terror', 'Drama'],
      elenco: ['Millie Bobby Brown', 'Finn Wolfhard', 'Winona Ryder'],
      temporadas: 4,
      anoInicio: 2016,
      status: 'EM_ANDAMENTO',
      sinopse: 'Crianças enfrentam forças sobrenaturais em uma pequena cidade americana.',
      classificacao: 'QUATORZE',
      mediaAvaliacao: 8.7,
      usuarioCriadoPorId: admin.id,
    },
    {
      titulo: 'The Last of Us',
      criador: 'Craig Mazin',
      generos: ['Drama', 'Ação', 'Ficção Científica'],
      elenco: ['Pedro Pascal', 'Bella Ramsey', 'Anna Torv'],
      temporadas: 2,
      anoInicio: 2023,
      status: 'EM_ANDAMENTO',
      sinopse: 'Em um mundo pós-apocalíptico, um sobrevivente é contratado para escolar uma jovem.',
      classificacao: 'DEZOITO',
      mediaAvaliacao: 9.0,
      usuarioCriadoPorId: admin.id,
    },
    {
      titulo: 'Dark',
      criador: 'Baran bo Odar',
      generos: ['Ficção Científica', 'Mistério', 'Drama'],
      elenco: ['Louis Hofmann', 'Lisa Vicari', 'Maja Schöne'],
      temporadas: 3,
      anoInicio: 2017,
      anoFim: 2020,
      status: 'FINALIZADA',
      sinopse: 'Uma viagem no tempo conecta quatro famílias em uma pequena cidade alemã.',
      classificacao: 'DEZESSEIS',
      mediaAvaliacao: 9.1,
      usuarioCriadoPorId: admin.id,
    },
  ];

  const seriesCriadas = [];
  for (const s of series) {
    const serie = await prisma.serie.upsert({
      where: { id: s.titulo.replace(/\s/g, '-').toLowerCase() },
      update: {},
      create: { id: s.titulo.replace(/\s/g, '-').toLowerCase(), ...s },
    });
    seriesCriadas.push(serie);
  }
  console.log(' Séries criadas:', series.length);

  
  const lista = await prisma.listaAssistir.upsert({
    where: { id: 'lista-principal-seed' },
    update: {},
    create: {
      id: 'lista-principal-seed',
      nome: 'Minha Lista Principal',
      usuarioId: usuario.id,
      publica: true,
    },
  });

  
  await prisma.itemLista.upsert({
    where: { id: 'item-seed-1' },
    update: {},
    create: {
      id: 'item-seed-1',
      listaId: lista.id,
      serieId: 'breaking-bad',
      status: 'ASSISTIDO',
      favoritado: true,
    },
  });

  await prisma.itemLista.upsert({
    where: { id: 'item-seed-2' },
    update: {},
    create: {
      id: 'item-seed-2',
      listaId: lista.id,
      filmeId: 'interestelar',
      status: 'ASSISTIDO',
      favoritado: true,
    },
  });

  await prisma.itemLista.upsert({
    where: { id: 'item-seed-3' },
    update: {},
    create: {
      id: 'item-seed-3',
      listaId: lista.id,
      filmeId: 'oppenheimer',
      status: 'PENDENTE',
    },
  });
  console.log(' Lista e itens criados.');

  
  await prisma.avaliacao.upsert({
    where: { id: 'aval-seed-1' },
    update: {},
    create: {
      id: 'aval-seed-1',
      nota: 10,
      critica: 'Obra-prima absoluta! Nolan superou todas as expectativas.',
      usuarioId: usuario.id,
      filmeId: 'interestelar',
    },
  });

  await prisma.avaliacao.upsert({
    where: { id: 'aval-seed-2' },
    update: {},
    create: {
      id: 'aval-seed-2',
      nota: 9.5,
      critica: 'A melhor série já produzida. Bryan Cranston é extraordinário.',
      usuarioId: usuario.id,
      serieId: 'breaking-bad',
    },
  });
  console.log(' Avaliações criadas.');

  console.log('\n Seed concluído com sucesso!');
  console.log(' Admin: admin@catalogo.com | Senha: admin123');
  console.log(' Usuário: usuario@catalogo.com | Senha: teste123');
}

main()
  .catch(e => { console.error(' Erro no seed:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
