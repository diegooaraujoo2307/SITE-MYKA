/* ==========================================================================
   MYKA COMPRESSORES - SCROLLYTELLING 3D & INTERACTIVITY SCRIPT (MOBILE-FIRST)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Força o carregamento e reprodução imediata do vídeo de fundo para carregar nos 2 segundos de intro
  const bgVideo = document.getElementById('bg-video');
  if (bgVideo) {
    bgVideo.load();
    bgVideo.play().catch(err => console.log("Video playback initiated:", err));
  }

  // Lógica da Tela de Introdução (Intro/Splash Screen)
  const introScreen = document.getElementById('intro-screen');
  const introCounter = document.getElementById('intro-counter');
  if (introScreen) {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    // Contador progressivo rápido de 1 a 7 (concluído em 1.2 segundos)
    if (introCounter) {
      let count = 1;
      introCounter.classList.add('pulse-number');
      
      const interval = setInterval(() => {
        count++;
        if (count <= 7) {
          introCounter.textContent = count;
          introCounter.classList.remove('pulse-number');
          void introCounter.offsetWidth; // Força reflow para reiniciar animação
          introCounter.classList.add('pulse-number');
        } else {
          clearInterval(interval);
        }
      }, 200); // Incrementa a cada 200ms
    }
    
    setTimeout(() => {
      introScreen.classList.add('fade-out');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }, 2000); // Exibição total de 2 segundos
  }

  // 1. INICIALIZAÇÃO DE ELEMENTOS DE INTERFACE
  const canvas = document.getElementById('bg-canvas');
  const sections = document.querySelectorAll('.scrolly-section');
  const scrollProgress = document.getElementById('scroll-progress');
  const stepIndicator = document.getElementById('step-indicator');
  const modal = document.getElementById('video-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const robotSpeechText = document.getElementById('robot-speech-text');
  const watchButtons = document.querySelectorAll('.watch-btn');

  // Lógica do Menu Hambúrguer (Mobile)
  const menuToggleBtn = document.getElementById('menu-toggle-btn');
  const hudNavigation = document.getElementById('hud-navigation');
  const navLinks = document.querySelectorAll('#hud-navigation a');

  // Separar os títulos das seções em blocos de palavras/linhas para efeito em cascata
  const titleElements = document.querySelectorAll('.garrafal-title');
  titleElements.forEach(title => {
    // Guarda o HTML original como referência para reprocessamento responsivo
    title.setAttribute('data-original-html', title.innerHTML);
  });

  function formatTitles() {
    const isMobile = window.innerWidth < 768;
    titleElements.forEach(title => {
      let htmlContent = title.getAttribute('data-original-html');
      if (title.closest('#hero')) {
        if (isMobile) {
          htmlContent = 'A MYKA NO<br>CORAÇÃO DA SUA<br>INDÚSTRIA.';
        } else {
          htmlContent = 'A MYKA NO CORAÇÃO<br>DA SUA INDÚSTRIA.';
        }
      }
      
      const lines = htmlContent.split(/<br\s*\/?>/i);
      title.innerHTML = ''; // Limpa anterior
      
      let wordIndex = 0;
      lines.forEach(line => {
        const lineDiv = document.createElement('div');
        lineDiv.className = 'title-line';
        
        // Limpa tags HTML internas sobressalentes e divide em palavras
        const cleanLine = line.replace(/<[^>]*>/g, '').trim();
        if (!cleanLine) return;
        const words = cleanLine.split(/\s+/);
        
        // Agrupa "COM" e "A" para evitar quebras de linha entre elas
        const groupedWords = [];
        for (let i = 0; i < words.length; i++) {
          if (words[i].toUpperCase() === 'COM' && words[i+1] && words[i+1].toUpperCase() === 'A') {
            groupedWords.push(words[i] + '\u00A0' + words[i+1]); // Usa espaço não quebrável (nbsp)
            i++;
          } else {
            groupedWords.push(words[i]);
          }
        }
        
        groupedWords.forEach(word => {
          const span = document.createElement('span');
          span.className = 'title-word';
          
          // Destaca a palavra MYKA se encontrada no título
          const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
          if (cleanWord.toUpperCase() === 'MYKA') {
            // Se houver pontuação anexada, isola-a para manter a cor branca original
            const hasPunctuation = word.length > cleanWord.length;
            if (hasPunctuation) {
              const punctuation = word.substring(cleanWord.length);
              
              const brandSpan = document.createElement('span');
              brandSpan.className = 'brand-highlight';
              brandSpan.textContent = cleanWord;
              span.appendChild(brandSpan);
              
              const punctSpan = document.createElement('span');
              punctSpan.className = 'brand-punctuation';
              punctSpan.textContent = punctuation + ' ';
              span.appendChild(punctSpan);
            } else {
              span.classList.add('brand-highlight');
              span.textContent = word + ' ';
            }
          } else {
            if (cleanWord.toUpperCase() === 'CORAÇÃO' || cleanWord.toUpperCase() === 'CORACAO' || cleanWord.toUpperCase() === 'PROTEJA') {
              span.classList.add('heart-highlight');
            } else if (cleanWord.toUpperCase() === 'INDÚSTRIA' || cleanWord.toUpperCase() === 'INDUSTRIA') {
              span.classList.add('industry-highlight');
            } else if (cleanWord.toUpperCase() === 'PRODUÇÃO' || cleanWord.toUpperCase() === 'PRODUCAO') {
              span.classList.add('warning-highlight');
            }
            span.textContent = word + ' ';
          }
          span.style.setProperty('--word-index', wordIndex);
          lineDiv.appendChild(span);
          wordIndex++;
        });
        
        title.appendChild(lineDiv);
      });
    });
  }

  // Executa formatação inicial
  formatTitles();

  // Escuta alteração do tamanho de tela e formata dinamicamente sem necessidade de recarregar F12
  const resizeMediaQuery = window.matchMedia('(max-width: 767px)');
  try {
    resizeMediaQuery.addEventListener('change', formatTitles);
  } catch (e) {
    // Fallback para navegadores legados
    resizeMediaQuery.addListener(formatTitles);
  }

  menuToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = hudNavigation.classList.toggle('open');
    menuToggleBtn.classList.toggle('open');
    document.body.classList.toggle('menu-active', isOpen);
  });

  // Fechar o menu ao clicar em qualquer link (mobile)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggleBtn.classList.remove('open');
      hudNavigation.classList.remove('open');
      document.body.classList.remove('menu-active');
    });
  });

  // Fechar ao clicar fora do menu
  document.addEventListener('click', (e) => {
    if (hudNavigation.classList.contains('open')) {
      if (!hudNavigation.contains(e.target) && e.target !== menuToggleBtn && !menuToggleBtn.contains(e.target)) {
        menuToggleBtn.classList.remove('open');
        hudNavigation.classList.remove('open');
        document.body.classList.remove('menu-active');
      }
    }
  });

  // Textos explicativos para o Modal do Robô Mascote em cada seção (Aprox. 45 segundos de narração em linguagem natural)
  const videoTransmissions = {
    'hero': {
      title: 'A MYKA NO CORAÇÃO DA SUA INDÚSTRIA.',
      speech: '"Olá! Eu sou o MIKRON, especialista da MYKA COMPRESSORES. Estou muito feliz em te receber aqui e se está aqui é por que você já percebeu como os compressores são importantes na sua indústria! A boa notícia é que você está em boas mãos! O compressor de ar dá fôlego a toda a sua produção e se ele parar, tudo para. Por isso, a minha missão diária é garantir que esse motor vital nunca pare de soprar com pressão e constância, trazendo a força estável e segura que a sua fábrica precisa para crescer. Vamos juntos manter esse ritmo sempre forte?"'
    },
    'quem-somos': {
      title: 'RESPONSABILIDADE. PROFISSIONALISMO. EXPERIÊNCIA.',
      speech: '"Aqui na Myka, nós encaramos o seu negócio com total responsabilidade. Sabemos que cada minuto da sua produção é valioso, e é por isso que agimos com o máximo profissionalismo em cada atendimento. Nossa história é construída com anos de experiência no mercado de ar comprimido, entregando confiança e segurança para marcas de todo o país. Não somos apenas fornecedores, somos parceiros que entendem o ritmo da sua fábrica. Venha conhecer o jeito Myka de cuidar da sua empresa com quem realmente entende do assunto!"'
    },
    'servicos': {
      title: 'MANUTENÇÃO. LOCAÇÃO. VENDA.',
      speech: '"Você sabia que a Myka cuida de todas as etapas do seu ar comprimido? Oferecemos um serviço completo que une manutenção preventiva para evitar falhas, locação flexível para atender suas emergências ou picos de produção, e venda de equipamentos modernos de alta durabilidade. Seja qual for a sua necessidade atual, temos a solução certa, do tamanho exato da sua empresa. Cuidamos de tudo para que você possa focar no que faz de melhor: fazer a sua indústria produzir e crescer sem limites!"'
    },
    'manutencao': {
      title: 'PREVENÇÃO. PREDIÇÃO. CORREÇÃO.',
      speech: '"Para que sua fábrica nunca pare por imprevistos, nossa equipe atua em três frentes essenciais. Com a manutenção preventiva, limpamos e ajustamos tudo no tempo certo. Com a preditiva, usamos tecnologia avançada para antecipar problemas antes que eles aconteçam. E se algo der errado, nossa corretiva rápida entra em ação imediatamente para reestabelecer o seu ar comprimido. É segurança máxima para proteger o seu investimento e manter a produtividade lá no alto. Pode confiar, nós cuidamos de cada detalhe!"'
    },
    'locacao': {
      title: 'DISPONIBILIDADE. FLEXIBILIDADE. AGILIDADE.',
      speech: '"Precisa de ar comprimido agora mesmo, sem burocracia ou altos investimentos? Nossa solução de locação oferece total disponibilidade de equipamentos modernos de prontidão para você. Trabalhamos com a flexibilidade de contratos que se adaptam perfeitamente ao seu ritmo e demanda, seja por dias ou meses. E claro, com a agilidade que a sua produção exige, entregamos e instalamos tudo muito rápido com assistência técnica inclusa. Alugue facilidade e garanta a continuidade do seu trabalho sem preocupações!"'
    },
    'venda': {
      title: 'PROCEDÊNCIA. VARIEDADE. PREÇO.',
      speech: '"Se o seu objetivo é comprar um compressor novo, a Myka é o seu lugar certo! Oferecemos equipamentos com total garantia de procedência, assegurando que você receba um maquinário original e de altíssima qualidade. Contamos com uma grande variedade de modelos para atender desde pequenas oficinas até grandes indústrias. E o melhor de tudo: garantimos um preço justo e condições de pagamento facilitadas para o seu bolso. Invista no futuro da sua produção com quem é referência no mercado!"'
    },
    'contato': {
      title: 'CREDIBILIDADE. CONFIANÇA. PROTEÇÃO.',
      speech: '"Se a sua indústria não pode parar, o seu momento é agora! A credibilidade e a confiança que você procura estão a um clique de distância. Nós da Myka oferecemos a proteção absoluta para a sua linha de produção, com suporte imediato e os melhores especialistas do mercado. Não perca tempo nem arrisque seu faturamento com paradas desnecessárias! Clique agora no botão do WhatsApp, faça uma ligação direta ou mande um e-mail. Nossa equipe está de prontidão para desenhar a solução perfeita para você. Fale conosco agora mesmo e garanta a segurança da sua empresa hoje!"'
    }
  };

  // 2. CONFIGURAÇÃO DO CANVAS 3D (THREE.JS)
  let scene, camera, renderer;
  let compressorGroup, robotGroup, factoryParticles;
  let currentScrollFraction = 0;
  let lastScrollY = window.scrollY;

  function init3D() {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070a11, 0.035);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 15);

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Otimizado para mobile

    // ILUMINAÇÃO FUTURISTA
    const ambientLight = new THREE.AmbientLight(0x0e1421, 1.5);
    scene.add(ambientLight);

    const cyanPointLight = new THREE.PointLight(0x00E5FF, 3, 50);
    cyanPointLight.position.set(5, 5, 5);
    scene.add(cyanPointLight);

    const bluePointLight = new THREE.PointLight(0x0B72FF, 2, 50);
    bluePointLight.position.set(-5, -5, 5);
    scene.add(bluePointLight);

    // CRIAÇÃO DOS MODELOS GEOMÉTRICOS SIMULADOS (COMPRESSOR & ROBÔ)
    buildCompressorModel();
    buildRobotModel();
    buildParticleEnvironment();

    // Redimensionamento de tela
    window.addEventListener('resize', onWindowResize);
  }

  // MODELO 3D: COMPRESSOR INDUSTRIAL
  function buildCompressorModel() {
    compressorGroup = new THREE.Group();

    // Corpos do Compressor (Bloco Principal e Cilindros)
    const bodyGeo = new THREE.BoxGeometry(4, 3, 3);
    const mainMat = new THREE.MeshStandardMaterial({ color: 0x1a2638, metalness: 0.8, roughness: 0.2 });
    const bodyMesh = new THREE.Mesh(bodyGeo, mainMat);
    compressorGroup.add(bodyMesh);

    // Detalhes Neon do Compressor
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x00E5FF, wireframe: true });
    const wireMesh = new THREE.Mesh(bodyGeo, wireMat);
    wireMesh.scale.set(1.02, 1.02, 1.02);
    compressorGroup.add(wireMesh);

    // Peças explodíveis para desconstrução
    compressorGroup.explodedParts = [];
    for (let i = 0; i < 12; i++) {
      const partGeo = new THREE.CylinderGeometry(0.3, 0.3, 1, 16);
      const partMat = new THREE.MeshStandardMaterial({ color: 0x00E5FF, metalness: 0.9 });
      const part = new THREE.Mesh(partGeo, partMat);
      part.position.set((Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3);
      part.initialPos = part.position.clone();
      part.targetPos = part.position.clone().multiplyScalar(3.5); // Posição de explosão
      compressorGroup.add(part);
      compressorGroup.explodedParts.push(part);
    }

    scene.add(compressorGroup);
  }

  // MODELO 3D: ROBÔ MASCOTE
  function buildRobotModel() {
    robotGroup = new THREE.Group();

    // Cabeça do Robô
    const headGeo = new THREE.BoxGeometry(1.5, 1.2, 1.2);
    const headMat = new THREE.MeshStandardMaterial({ color: 0x07111e, metalness: 0.9, roughness: 0.1 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 2.5;

    // Olhos Neon Cyan
    const eyeGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x00E5FF });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.4, 2.6, 0.6);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.4, 2.6, 0.6);

    // Corpo do Robô
    const bodyGeo = new THREE.CylinderGeometry(1.2, 0.8, 2.2, 16);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x0B72FF, metalness: 0.7 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.6;

    robotGroup.add(head, leftEye, rightEye, body);
    robotGroup.position.set(0, -20, 0); // Inicialmente escondido
    scene.add(robotGroup);
  }

  // PARTICULAS DA FÁBRICA / AMBIENTE CINEMATOGRÁFICO
  function buildParticleEnvironment() {
    const pCount = 300;
    const pGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(pCount * 3);

    for (let i = 0; i < pCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 40;
      positions[i + 1] = (Math.random() - 0.5) * 60;
      positions[i + 2] = (Math.random() - 0.5) * 40;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({ size: 0.15, color: 0x00E5FF, transparent: true, opacity: 0.4 });
    factoryParticles = new THREE.Points(pGeo, pMat);
    scene.add(factoryParticles);
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // 3. ANIMAÇÃO DE SCROLL CONTÍNUA (SCROLLYTELLING)
  let scrollTimeout;
  function onScroll() {
    const currentScrollY = window.scrollY;
    
    // Adiciona classe para efeito de desfoque de movimento
    document.body.classList.add('is-scrolling');
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      document.body.classList.remove('is-scrolling');
    }, 70); // Foca rápido após parar a rolagem

    // Detecta a direção do scroll
    if (currentScrollY > lastScrollY) {
      document.body.classList.remove('scroll-up');
      document.body.classList.add('scroll-down');
    } else if (currentScrollY < lastScrollY) {
      document.body.classList.remove('scroll-down');
      document.body.classList.add('scroll-up');
    }
    lastScrollY = currentScrollY;

    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    currentScrollFraction = totalHeight <= 0 ? 0 : currentScrollY / totalHeight;

    // Atualiza barra de progresso HUD
    if (scrollProgress) {
      scrollProgress.style.setProperty('--scroll-height', `${Math.min(100, currentScrollFraction * 100)}%`);
    }

    // Identifica seção ativa
    const currentStep = Math.min(6, Math.floor(currentScrollFraction * 7.01)); // Leve fator de precisão
    if (stepIndicator) {
      stepIndicator.textContent = `0${currentStep + 1} / 07`;
    }

    sections.forEach((sec, idx) => {
      if (idx === currentStep) {
        sec.classList.add('active');
      } else {
        sec.classList.remove('active');
      }
    });

    // ANIMAÇÃO 3D CONTROLADA POR SCROLL (SCENARIOS & CAMERAS)
    animate3DSceneByScroll(currentScrollFraction);
  }

  function animate3DSceneByScroll(progress) {
    // Cláusula de salvaguarda: se o motor 3D estiver desativado ou indefinido, aborta imediatamente para evitar travamentos
    if (typeof compressorGroup === 'undefined' || !compressorGroup || typeof robotGroup === 'undefined' || !robotGroup) {
      return;
    }

    // ESTÁGIO 1: HERO (0 - 0.14) -> Compressor Montado Rodando
    if (progress < 0.15) {
      const subProg = progress / 0.15;
      compressorGroup.position.set(0, 0, 0);
      compressorGroup.rotation.y = subProg * Math.PI * 2;
      compressorGroup.explodedParts.forEach(p => p.position.lerp(p.initialPos, 0.1));
      robotGroup.position.set(0, -20, 0);
      camera.position.set(0, 0, 12);
    }
    // ESTÁGIO 2: QUEM SOMOS (0.15 - 0.30) -> Explosão / Desconstrução do Compressor
    else if (progress >= 0.15 && progress < 0.30) {
      const subProg = (progress - 0.15) / 0.15;
      compressorGroup.rotation.y = subProg * Math.PI;
      compressorGroup.explodedParts.forEach(p => {
        p.position.lerpVectors(p.initialPos, p.targetPos, subProg);
      });
      robotGroup.position.set(0, -20, 0);
    }
    // ESTÁGIO 3: SERVIÇOS (0.30 - 0.45) -> Peças se reúnem e formam o ROBÔ MASCOTE
    else if (progress >= 0.30 && progress < 0.45) {
      const subProg = (progress - 0.30) / 0.15;
      compressorGroup.position.set(0, 20, 0); // Move compressor para fora
      robotGroup.position.set(0, 0, 0);
      robotGroup.rotation.y = subProg * Math.PI * 2;
      robotGroup.scale.setScalar(subProg);
    }
    // ESTÁGIO 4: MANUTENÇÃO / FÁBRICA AUTOMOBILÍSTICA (0.45 - 0.60)
    else if (progress >= 0.45 && progress < 0.60) {
      const subProg = (progress - 0.45) / 0.15;
      robotGroup.position.set(-2, 0, 2);
      robotGroup.rotation.y = 0.5 + subProg * 0.5;
      camera.position.set(0, subProg * 2, 10 - subProg * 3); // Voo da câmera
    }
    // ESTÁGIO 5: VENDA / SIDERURGIA (0.60 - 0.75)
    else if (progress >= 0.60 && progress < 0.75) {
      const subProg = (progress - 0.60) / 0.15;
      robotGroup.position.set(2, 0, 1);
      robotGroup.rotation.y = -0.8;
      camera.position.set(-subProg * 3, 0, 8);
    }
    // ESTÁGIO 6: LOCAÇÃO / LOGÍSTICA (0.75 - 0.90)
    else if (progress >= 0.75 && progress < 0.90) {
      robotGroup.position.set(0, -1, 3);
      robotGroup.rotation.y = Math.sin(progress * 10) * 0.3;
      camera.position.set(0, 0, 10);
    }
    // ESTÁGIO 7: CONTATO (0.90 - 1.0) -> Central de Comando
    else {
      robotGroup.position.set(0, 0, 0);
      robotGroup.rotation.y = 0;
      camera.position.set(0, 0, 9);
    }
  }

  // LOOP DE RENDERIZAÇÃO
  function render() {
    requestAnimationFrame(render);
    if (factoryParticles) {
      factoryParticles.rotation.y += 0.001;
    }
    renderer.render(scene, camera);
  }

  // 4. LÓGICA DO MODAL DE VÍDEO FUTURISTA COM REPRODUÇÃO DE ÁUDIO E TRAVA DE SCROLL
  let currentAudio = null;
  const playPauseBtn = document.getElementById('play-pause-btn');

  function stopAudio() {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }
    if (playPauseBtn) {
      playPauseBtn.classList.remove('playing');
      const iconSpan = playPauseBtn.querySelector('.icon');
      if (iconSpan) iconSpan.textContent = '▶';
    }
    const waves = document.querySelectorAll('.audio-wave');
    waves.forEach(w => w.classList.add('paused'));
  }

  function unlockScroll() {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }

  watchButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const videoKey = btn.getAttribute('data-video');
      const info = videoTransmissions[videoKey] || videoTransmissions['hero'];
      
      stopAudio();

      if (modalTitle) modalTitle.textContent = info.title;
      robotSpeechText.textContent = info.speech;
      modal.classList.remove('hidden');

      // Trava scroll da página ao abrir modal
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      const waves = document.querySelectorAll('.audio-wave');

      // Toca áudio apenas na seção 1 (Hero)
      if (videoKey === 'hero') {
        if (playPauseBtn) {
          playPauseBtn.style.display = 'flex';
          playPauseBtn.classList.add('playing');
          const iconSpan = playPauseBtn.querySelector('.icon');
          if (iconSpan) iconSpan.textContent = '⏸';
        }
        waves.forEach(w => {
          w.style.display = 'flex';
          w.classList.remove('paused');
        });
        currentAudio = new Audio('audio01.mp3');
        currentAudio.play()
          .then(() => {
            waves.forEach(w => w.classList.remove('paused'));
          })
          .catch(err => {
            console.log("Playback block:", err);
            if (playPauseBtn) {
              playPauseBtn.classList.remove('playing');
              const iconSpan = playPauseBtn.querySelector('.icon');
              if (iconSpan) iconSpan.textContent = '▶';
            }
            waves.forEach(w => w.classList.add('paused'));
          });
      } else {
        // Esconde botão de play/pause e ondas se a seção não tiver áudio
        if (playPauseBtn) playPauseBtn.style.display = 'none';
        waves.forEach(w => w.style.display = 'none');
      }
    });
  });

  // Controle de Play/Pause de áudio (Símbolo apenas)
  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
      if (currentAudio) {
        const iconSpan = playPauseBtn.querySelector('.icon');
        const waves = document.querySelectorAll('.audio-wave');

        if (currentAudio.paused) {
          currentAudio.play();
          playPauseBtn.classList.add('playing');
          if (iconSpan) iconSpan.textContent = '⏸';
          waves.forEach(w => w.classList.remove('paused'));
        } else {
          currentAudio.pause();
          playPauseBtn.classList.remove('playing');
          if (iconSpan) iconSpan.textContent = '▶';
          waves.forEach(w => w.classList.add('paused'));
        }
      }
    });
  }

  const modalCloseBtnAction = document.getElementById('modal-close-btn-action');
  if (modalCloseBtnAction) {
    modalCloseBtnAction.addEventListener('click', () => {
      stopAudio();
      unlockScroll();
      modal.classList.add('hidden');
    });
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
      stopAudio();
      unlockScroll();
      modal.classList.add('hidden');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      stopAudio();
      unlockScroll();
      modal.classList.add('hidden');
    }
  });

  // INICIALIZAÇÃO
  // init3D(); // Desativado temporariamente para remover o fundo 3D
  // render();
  window.addEventListener('scroll', onScroll);
  onScroll(); // Executa para o estado inicial
});
