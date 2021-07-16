import React from 'react';
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons'
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations'

function ProfileSideBar(properties) {
  return (
    <Box as="aside">
      <img src={`https://github.com/${properties.githubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr />

      <p>
        <a className="boxLink" href={`https://github.com/${properties.githubUser}`}>
          @{properties.githubUser}
        </a>
      </p>
      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox(properties) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {properties.title} ({properties.items.length})
      </h2>

      <ul>
        {/* {amigos.map((amigo) => <ProfileSideBar githubUser={amigo} />)} */}
        {properties.items.map((currentItem) => {
          return (
            < li key={currentItem} >
              <a href={`https://github.com/${currentItem}.png`}>
                <img src={`https://github.com/${currentItem}.png`} />
                <span>{currentItem}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </ProfileRelationsBoxWrapper >
  )
}

export default function Home() {
  const [comunidades, setComunidades] = React.useState([]);
  const githubUser = 'juliofiamoncini';
  //const comunidades = ['Alurakut'];
  const amigos = [
    'omariosouto',
    'juunegreiros',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho'
  ]

  const token = '5928e7a997e25daeaaefe51d15e564';
  //const seguidores = [];
  const [seguidores, setSeguidores] = React.useState([]);
  React.useEffect(() => {
    fetch('https://api.github.com/users/peas/followers')
      .then((response) => response.json())
      .then((jsonResponse) => {
        // TODO Arrumar a quantidade máxima que mostra acima de 6        
        //setSeguidores(jsonResponse.map((itemAtual) => itemAtual.login));
      });

    // API GraphQL
    // Pega as comunidades para listá-las
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        query: `
          query {
            allCommunities {
              title,
              id,
              imageUrl,
              creatorSlug
            }
          }
        `
      })
    }).then((response) => response.json())
      .then((convertedResponse) => {
        setComunidades(convertedResponse.data.allCommunities);
      });
  }, []);

  return (
    <>
      <AlurakutMenu githubUser={githubUser} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          {/* <Box style="grid-area: profileArea;"> */}
          <ProfileSideBar githubUser={githubUser} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              Bem-vindo(a)
            </h1>

            <OrkutNostalgicIconSet />
          </Box>
          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form onSubmit={function handleCriaComunidade(e) {
              e.preventDefault();
              const dadosDoForm = new FormData(e.target);

              const comunidade = {
                title: dadosDoForm.get('title'),
                imageUrl: dadosDoForm.get('image'),
                creatorSlug: githubUser
              }

              fetch('/api/comunidades', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                },
                body: JSON.stringify(comunidade)
              }).then(async (response) => {
                const retorno = await response.json();
                setComunidades([...comunidades, retorno.registroCriado]);
              })

            }}>
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  area-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>
              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  area-label="Coloque uma URL para usarmos de capa"
                />
              </div>

              <button>
                Criar comunidade
              </button>
            </form>
          </Box>
        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelationsBox title="Seguidores" items={seguidores} />
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Meus amigos ({amigos.length})
            </h2>

            <ul>
              {/* {amigos.map((amigo) => <ProfileSideBar githubUser={amigo} />)} */}
              {amigos.map((amigo) => {
                return (
                  <li key={amigo}>
                    <a href={`/users/${amigo}`}>
                      <img src={`https://github.com/${amigo}.png`} />
                      <span>{amigo}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Minhas comunidades ({comunidades.length})
            </h2>

            <ul>
              {/* {amigos.map((amigo) => <ProfileSideBar githubUser={amigo} />)} */}
              {comunidades.map((comunidade) => {
                return (
                  <li key={comunidade.id}>
                    <a href={`/communities/${comunidade.id}`}>
                      <img src={comunidade.imageUrl} />
                      <span>{comunidade.title}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  )
}