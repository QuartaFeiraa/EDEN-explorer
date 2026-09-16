-- Complete the ENEM starter set and guarantee that every active question has a private solution.
-- All questions below are original RUMO material aligned to the existing ENEM topic catalog.

with seed(area_id,topic_id,prompt,options,difficulty,tags) as (
  values
  ('enem-linguagens','lin-literatura','Em um poema, a cidade é descrita como “acorda apressada, engole ônibus e devolve gente às calçadas”. O recurso predominante nessa construção é',
   '[{"key":"A","text":"comparação explícita"},{"key":"B","text":"definição técnica"},{"key":"C","text":"personificação"},{"key":"D","text":"eufemismo"},{"key":"E","text":"enumeração cronológica"}]'::jsonb,2,array['literatura','figuras-de-linguagem']),
  ('enem-linguagens','lin-estrangeira','A school poster says: “Turn off the lights when you leave. Small actions save energy.” The main purpose of the message is to',
   '[{"key":"A","text":"describe how electricity is produced"},{"key":"B","text":"encourage a habit that reduces energy use"},{"key":"C","text":"advertise a new lighting product"},{"key":"D","text":"compare prices of different schools"},{"key":"E","text":"explain a laboratory experiment"}]'::jsonb,1,array['ingles','leitura']),
  ('enem-linguagens','lin-generos','Uma reportagem apresenta dados de uma pesquisa pública, depoimentos de moradores e explicações de especialistas sobre o mesmo problema urbano. Essa combinação de recursos contribui principalmente para',
   '[{"key":"A","text":"eliminar diferentes pontos de vista"},{"key":"B","text":"substituir informações por opinião pessoal"},{"key":"C","text":"contextualizar o tema com evidências e perspectivas"},{"key":"D","text":"transformar a reportagem em texto literário"},{"key":"E","text":"impedir o leitor de avaliar as fontes"}]'::jsonb,2,array['generos','reportagem']),
  ('enem-linguagens','lin-interpretacao','Em uma campanha ambiental lê-se: “Seu lixo não desaparece quando sai da sua mão.” A frase procura produzir no leitor o efeito de',
   '[{"key":"A","text":"responsabilizá-lo pelas consequências do descarte"},{"key":"B","text":"provar que todo resíduo pode ser reciclado"},{"key":"C","text":"informar o calendário da coleta urbana"},{"key":"D","text":"defender o aumento do consumo doméstico"},{"key":"E","text":"descrever a composição química do lixo"}]'::jsonb,1,array['interpretacao','campanha']),
  ('enem-linguagens','lin-literatura','Uma obra visual reorganiza fragmentos de anúncios, manchetes e embalagens para questionar hábitos de consumo. Nesse caso, a apropriação desses materiais funciona como estratégia de',
   '[{"key":"A","text":"reprodução neutra da publicidade"},{"key":"B","text":"apagamento de referências sociais"},{"key":"C","text":"descrição científica dos produtos"},{"key":"D","text":"ressignificação crítica de elementos do cotidiano"},{"key":"E","text":"defesa obrigatória das marcas representadas"}]'::jsonb,2,array['artes','cultura']),
  ('enem-humanas','hum-filosofia','Em uma democracia, uma decisão pública é considerada mais legítima quando os cidadãos podem conhecer seus fundamentos, apresentar razões e contestá-la. Essa concepção valoriza',
   '[{"key":"A","text":"a obediência sem debate"},{"key":"B","text":"a participação e a argumentação públicas"},{"key":"C","text":"o segredo permanente das decisões"},{"key":"D","text":"a substituição das leis por costumes privados"},{"key":"E","text":"a exclusão de grupos afetados"}]'::jsonb,2,array['filosofia','democracia']),
  ('enem-humanas','hum-sociologia','Duas pessoas com escolaridade semelhante podem encontrar oportunidades muito diferentes por causa do território onde vivem, das redes de contato e de desigualdades históricas. Essa situação mostra que',
   '[{"key":"A","text":"o sucesso depende apenas do esforço individual"},{"key":"B","text":"as oportunidades também são condicionadas por fatores sociais"},{"key":"C","text":"a escolaridade não produz qualquer efeito"},{"key":"D","text":"as desigualdades desaparecem automaticamente com o tempo"},{"key":"E","text":"todas as trajetórias sociais são idênticas"}]'::jsonb,2,array['sociologia','desigualdade']),
  ('enem-humanas','hum-historia','A abolição legal da escravidão no Brasil, em 1888, não foi acompanhada de políticas amplas de acesso à terra, educação e trabalho protegido para a população liberta. Esse fato evidencia que',
   '[{"key":"A","text":"a escravidão continuou legalmente inalterada"},{"key":"B","text":"a cidadania social foi garantida de forma imediata"},{"key":"C","text":"o fim jurídico da escravidão não assegurou inclusão social plena"},{"key":"D","text":"a urbanização brasileira foi interrompida"},{"key":"E","text":"as desigualdades raciais deixaram de existir"}]'::jsonb,2,array['historia','pos-abolicao']),
  ('enem-humanas','hum-geografia','Em uma metrópole, parte da população de baixa renda mora cada vez mais distante dos centros de emprego e enfrenta longos deslocamentos diários. Esse processo expressa principalmente',
   '[{"key":"A","text":"homogeneização do espaço urbano"},{"key":"B","text":"segregação socioespacial"},{"key":"C","text":"redução das desigualdades territoriais"},{"key":"D","text":"desaparecimento das periferias"},{"key":"E","text":"substituição do transporte por trabalho rural"}]'::jsonb,1,array['geografia','urbanizacao']),
  ('enem-humanas','hum-cidadania','Em um orçamento participativo, moradores discutem prioridades e acompanham a aplicação de parte dos recursos municipais. Esse mecanismo pode fortalecer a cidadania porque amplia',
   '[{"key":"A","text":"o sigilo sobre os gastos públicos"},{"key":"B","text":"o poder exclusivo de empresas privadas"},{"key":"C","text":"a distância entre governo e população"},{"key":"D","text":"a participação social e o controle sobre decisões públicas"},{"key":"E","text":"a suspensão das instituições representativas"}]'::jsonb,1,array['cidadania','participacao']),
  ('enem-natureza','nat-quimica','Uma solução ácida de pH 3 é diluída com grande quantidade de água, sem adição de outras substâncias. Em relação ao valor inicial, o pH da solução tende a',
   '[{"key":"A","text":"diminuir, tornando-se mais ácida"},{"key":"B","text":"aumentar, tornando-se menos ácida"},{"key":"C","text":"permanecer obrigatoriamente igual a 3"},{"key":"D","text":"tornar-se igual a zero"},{"key":"E","text":"indicar aumento da concentração de íons H+"}]'::jsonb,2,array['quimica','ph']),
  ('enem-natureza','nat-biologia','Após a vacinação, parte dos linfócitos ativados permanece no organismo como células de memória. Em um contato futuro com o mesmo agente, essas células favorecem',
   '[{"key":"A","text":"uma resposta imune mais lenta"},{"key":"B","text":"a perda completa dos anticorpos"},{"key":"C","text":"uma resposta mais rápida e específica"},{"key":"D","text":"a transformação do vírus em bactéria"},{"key":"E","text":"o bloqueio de toda inflamação"}]'::jsonb,1,array['biologia','imunologia']),
  ('enem-natureza','nat-fisica','Uma lâmpada LED de 10 W e uma lâmpada incandescente de 60 W produzem iluminação semelhante em um ambiente. Mantidas acesas pelo mesmo tempo, a LED consome menos energia elétrica porque',
   '[{"key":"A","text":"possui menor potência elétrica"},{"key":"B","text":"funciona sem corrente elétrica"},{"key":"C","text":"transforma toda energia em movimento"},{"key":"D","text":"tem tensão elétrica necessariamente nula"},{"key":"E","text":"a energia consumida independe do tempo"}]'::jsonb,1,array['fisica','energia']),
  ('enem-natureza','nat-ambiente','A substituição de uma usina térmica a carvão por geração solar fotovoltaica pode contribuir para mitigar mudanças climáticas principalmente por',
   '[{"key":"A","text":"aumentar a queima de combustíveis fósseis"},{"key":"B","text":"elevar a emissão direta de dióxido de carbono na geração"},{"key":"C","text":"impedir qualquer impacto ambiental da produção de energia"},{"key":"D","text":"reduzir emissões diretas de gases de efeito estufa durante a geração"},{"key":"E","text":"eliminar a necessidade de redes elétricas"}]'::jsonb,2,array['ambiente','energia']),
  ('enem-natureza','nat-ecologia','Em um ambiente aquático contaminado por mercúrio, organismos do topo da cadeia alimentar apresentam concentrações maiores do metal do que organismos de níveis inferiores. Esse fenômeno é denominado',
   '[{"key":"A","text":"sucessão ecológica"},{"key":"B","text":"fixação biológica"},{"key":"C","text":"biomagnificação"},{"key":"D","text":"mutualismo"},{"key":"E","text":"fototropismo"}]'::jsonb,2,array['ecologia','cadeia-alimentar'])
)
insert into public.question_bank(track_id,area_id,topic_id,prompt,options,difficulty,active,verified,source_type,source_ref,tags)
select 'enem',area_id,topic_id,prompt,options,difficulty,true,true,'original',null,tags
from seed s
where not exists (select 1 from public.question_bank q where q.track_id='enem' and q.prompt=s.prompt);

with solutions(prompt,correct_answer,explanation) as (
  values
  ('Uma parede mede 5 m por 3 m. Uma janela de 1,2 m por 1,5 m não será pintada. Qual área receberá tinta?','C','A parede tem 15 m² e a janela 1,8 m². Subtraindo a área da janela, 15 - 1,8 = 13,2 m².'),
  ('Uma caixa contém 4 cartões vermelhos e 6 azuis. Ao retirar um cartão ao acaso, qual é a probabilidade de ele ser vermelho?','C','Há 10 cartões ao todo e 4 são vermelhos. A probabilidade é 4/10 = 0,4 = 40%.'),
  ('Uma corrida de táxi custa R$ 6 de bandeirada mais R$ 2,50 por quilômetro. Quanto custa uma corrida de 8 km?','C','O custo é 6 + 2,50 × 8 = 6 + 20 = R$ 26.'),
  ('As notas de cinco estudantes foram 6, 7, 8, 9 e 10. Qual é a média aritmética dessas notas?','C','A soma é 40. Dividindo pelas cinco notas, a média é 40/5 = 8.'),
  ('Uma receita usa 3 xícaras de farinha para produzir 12 biscoitos. Mantida a proporção, quantas xícaras são necessárias para 30 biscoitos?','D','A proporção é 3/12 de xícara por biscoito. Para 30 biscoitos: 30 × 3/12 = 7,5 xícaras.'),
  ('Em um poema, a cidade é descrita como “acorda apressada, engole ônibus e devolve gente às calçadas”. O recurso predominante nessa construção é','C','A cidade recebe ações próprias de seres animados, como acordar e engolir. Esse recurso é a personificação.'),
  ('A school poster says: “Turn off the lights when you leave. Small actions save energy.” The main purpose of the message is to','B','The imperative “turn off” encourages a concrete habit aimed at reducing energy consumption.'),
  ('Uma reportagem apresenta dados de uma pesquisa pública, depoimentos de moradores e explicações de especialistas sobre o mesmo problema urbano. Essa combinação de recursos contribui principalmente para','C','Dados, relatos e explicações especializadas oferecem evidências e diferentes perspectivas para contextualizar o tema.'),
  ('Em uma campanha ambiental lê-se: “Seu lixo não desaparece quando sai da sua mão.” A frase procura produzir no leitor o efeito de','A','A mensagem desloca a atenção do ato de jogar fora para as consequências do descarte, responsabilizando o leitor.'),
  ('Uma obra visual reorganiza fragmentos de anúncios, manchetes e embalagens para questionar hábitos de consumo. Nesse caso, a apropriação desses materiais funciona como estratégia de','D','Ao retirar materiais de seu uso original e reorganizá-los, a obra produz novos sentidos e pode criticar a cultura de consumo.'),
  ('Em uma democracia, uma decisão pública é considerada mais legítima quando os cidadãos podem conhecer seus fundamentos, apresentar razões e contestá-la. Essa concepção valoriza','B','A legitimidade descrita depende de participação, publicidade das razões e possibilidade de contestação no debate público.'),
  ('Duas pessoas com escolaridade semelhante podem encontrar oportunidades muito diferentes por causa do território onde vivem, das redes de contato e de desigualdades históricas. Essa situação mostra que','B','Trajetórias individuais são influenciadas por condições sociais, territoriais e históricas, não apenas por mérito pessoal.'),
  ('A abolição legal da escravidão no Brasil, em 1888, não foi acompanhada de políticas amplas de acesso à terra, educação e trabalho protegido para a população liberta. Esse fato evidencia que','C','A mudança jurídica encerrou a escravidão legal, mas não garantiu por si só condições materiais e direitos sociais suficientes para inclusão plena.'),
  ('Em uma metrópole, parte da população de baixa renda mora cada vez mais distante dos centros de emprego e enfrenta longos deslocamentos diários. Esse processo expressa principalmente','B','A separação territorial entre grupos sociais e o acesso desigual a oportunidades e infraestrutura caracterizam segregação socioespacial.'),
  ('Em um orçamento participativo, moradores discutem prioridades e acompanham a aplicação de parte dos recursos municipais. Esse mecanismo pode fortalecer a cidadania porque amplia','D','O mecanismo cria canais de participação e acompanhamento das decisões e dos gastos públicos.'),
  ('Uma solução ácida de pH 3 é diluída com grande quantidade de água, sem adição de outras substâncias. Em relação ao valor inicial, o pH da solução tende a','B','A diluição reduz a concentração de íons H+ da solução ácida. Por isso o pH aumenta, aproximando-se da neutralidade.'),
  ('Após a vacinação, parte dos linfócitos ativados permanece no organismo como células de memória. Em um contato futuro com o mesmo agente, essas células favorecem','C','Células de memória permitem reconhecer o antígeno e organizar uma resposta secundária mais rápida e específica.'),
  ('Uma lâmpada LED de 10 W e uma lâmpada incandescente de 60 W produzem iluminação semelhante em um ambiente. Mantidas acesas pelo mesmo tempo, a LED consome menos energia elétrica porque','A','Energia elétrica consumida é potência multiplicada pelo tempo. Para o mesmo tempo, a lâmpada de menor potência consome menos energia.'),
  ('A substituição de uma usina térmica a carvão por geração solar fotovoltaica pode contribuir para mitigar mudanças climáticas principalmente por','D','A geração solar não depende da combustão de carvão durante a operação, reduzindo emissões diretas de gases de efeito estufa nessa etapa.'),
  ('Em um ambiente aquático contaminado por mercúrio, organismos do topo da cadeia alimentar apresentam concentrações maiores do metal do que organismos de níveis inferiores. Esse fenômeno é denominado','C','A concentração crescente de uma substância persistente ao longo dos níveis tróficos é chamada biomagnificação.')
)
insert into public.question_solutions(question_id,correct_answer,explanation)
select q.id,s.correct_answer,s.explanation
from solutions s
join public.question_bank q on q.prompt=s.prompt and q.track_id='enem'
where not exists (select 1 from public.question_solutions existing where existing.question_id=q.id);

with essays(title,prompt) as (
  values
  ('Saúde mental de adolescentes no ambiente digital','Discuta desafios para proteger a saúde mental de adolescentes diante do uso intenso de ambientes digitais no Brasil e apresente uma proposta de intervenção que respeite os direitos humanos.'),
  ('Envelhecimento populacional e cuidado digno','Analise os desafios para garantir cuidado digno e participação social à população idosa em um Brasil que envelhece rapidamente.'),
  ('Acesso à cultura nas periferias urbanas','Discuta caminhos para ampliar o acesso à produção e ao consumo de cultura nas periferias urbanas brasileiras.'),
  ('Eventos climáticos extremos e prevenção de riscos','Analise os desafios para reduzir a vulnerabilidade da população brasileira a enchentes, ondas de calor e outros eventos climáticos extremos.')
)
insert into public.essay_topics(track_id,title,prompt,source_type,active)
select 'enem',title,prompt,'original',true
from essays e
where not exists (select 1 from public.essay_topics t where t.track_id='enem' and t.title=e.title);
