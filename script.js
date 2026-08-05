  // ── Cursor personalizado
  const cursor = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursorRing');
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    setTimeout(() => {
      cursorRing.style.left = e.clientX + 'px';
      cursorRing.style.top = e.clientY + 'px';
    }, 80);
  });
  document.querySelectorAll('a, button, .servicio-card, .precio-item, .mv-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '20px';
      cursor.style.height = '20px';
      cursor.style.background = 'transparent';
      cursor.style.border = '1.5px solid var(--gold)';
      cursorRing.style.width = '50px';
      cursorRing.style.height = '50px';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '12px';
      cursor.style.height = '12px';
      cursor.style.background = 'var(--gold)';
      cursor.style.border = 'none';
      cursorRing.style.width = '36px';
      cursorRing.style.height = '36px';
    });
  });

  // ── Navbar scroll
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  });

  // ── Menu movil
  function toggleMenu() {
    document.getElementById('hamburger').classList.toggle('active');
    document.getElementById('mobileMenu').classList.toggle('active');
  }
  function closeMenu() {
    document.getElementById('hamburger').classList.remove('active');
    document.getElementById('mobileMenu').classList.remove('active');
  }

  // ── Reveal on scroll (with fallback if IntersectionObserver isn't available)
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  // ── Fecha minima = hoy
  const fechaInput = document.getElementById('fecha');
  const hoy = new Date().toISOString().split('T')[0];
  fechaInput.setAttribute('min', hoy);

  // ── Numero de WhatsApp que recibe TODAS las reservas (con indicativo de pais 57, sin +, sin espacios)
  // Todas las citas, sin importar el barbero elegido en el formulario, llegan al chat de
  // Yancarlos Echeverry Valencia: 3115319215
  const WHATSAPP_DESTINO = '573115319215';

  // ── Deteccion de dispositivo movil (Android / iPhone / iPad / iPod)
  function esMovil() {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  // ── Reservar
  function reservar(e) {
    e.preventDefault();

    const nombreInput = document.getElementById('nombreCliente');
    const servicioInput = document.getElementById('servicio');
    const barberoInput = document.getElementById('barbero');
    const fechaInput = document.getElementById('fecha');
    const horaInput = document.getElementById('hora');

    const nombreCliente = nombreInput.value.trim();
    const servicio = servicioInput.value;
    const barbero = barberoInput.value;
    const fecha = fechaInput.value;
    const hora = horaInput.value;

    if (!nombreCliente) {
      alert('Por favor escribe tu nombre para continuar.');
      nombreInput.focus();
      return;
    }

    if (!servicio) {
      alert('Por favor selecciona un servicio para continuar.');
      servicioInput.focus();
      return;
    }

    if (!barbero) {
      alert('Por favor selecciona un barbero para continuar.');
      barberoInput.focus();
      return;
    }

    if (!fecha) {
      alert('Por favor selecciona una fecha para continuar.');
      fechaInput.focus();
      return;
    }

    if (!hora) {
      alert('Por favor selecciona una hora para continuar.');
      horaInput.focus();
      return;
    }

    // Evitar reservas en fechas/horas ya pasadas
    const fechaHoraSeleccionada = new Date(`${fecha}T${hora}`);
    if (fechaHoraSeleccionada.getTime() < Date.now()) {
      alert('La fecha y hora seleccionadas ya pasaron. Por favor elige un horario futuro.');
      fechaInput.focus();
      return;
    }

    const numero = WHATSAPP_DESTINO;

    let mensaje = `Hola ${barbero}, soy ${nombreCliente} y quiero reservar una cita en Barberia Valencias.`;
    mensaje += `\nServicio: ${servicio}`;
    mensaje += `\nFecha: ${fecha}`;
    mensaje += `\nHora: ${hora}`;

    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

    const toast = document.getElementById('toast');
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
    setTimeout(() => {
      toast.style.transform = 'translateY(80px)';
      toast.style.opacity = '0';
    }, 3500);

    e.target.reset();

    // En moviles, navegar en la misma pestana entrega el control a la app de WhatsApp
    // de forma mas fiable que abrir una pestana nueva (que en iOS/Safari puede bloquearse
    // o quedar en segundo plano sin activar el enlace de la app).
    if (esMovil()) {
      window.location.href = url;
    } else {
      window.open(url, '_blank');
    }
  }

  // ── Animacion de numeros del contador
  function animateCounter(el, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { current = target; clearInterval(timer); }
      const suffix = el.dataset.suffix || '';
      el.textContent = Math.floor(current) + suffix;
    }, 30);
  }
  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat-item strong').forEach(el => {
          const text = el.textContent;
          const num = parseInt(text);
          const suffix = text.replace(num.toString(), '');
          el.dataset.suffix = suffix;
          animateCounter(el, num);
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  const statStrip = document.querySelector('.stat-strip');
  if (statStrip) statsObserver.observe(statStrip);
