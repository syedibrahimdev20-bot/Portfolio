/* =====================================================================
   SYED IBRAHIM — PORTFOLIO SCRIPT
   Sections:
   1. Respect prefers-reduced-motion
   2. Page load overlay
   3. Navbar scroll + mobile menu
   4. Scroll-reveal (IntersectionObserver)
   5. Hero pipeline node animation
   6. DevOps journey timeline progress
   7. Workflow pipeline step animation
   8. Project details data + modal
   9. GitHub stats (graceful API handling)
   10. Contact form validation + demo submit
   ===================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. REDUCED MOTION CHECK ---------- */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 2. PAGE LOAD OVERLAY ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('loader-hidden');
    }, prefersReducedMotion ? 0 : 500);
  });

  /* ---------- 3. NAVBAR SCROLL + MOBILE MENU ---------- */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  const handleNavbarScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 24);
  };
  handleNavbarScroll();
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile menu when a link is clicked
  navMenu.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- 4. SCROLL REVEAL ---------- */
  const revealTargets = document.querySelectorAll('.reveal-on-scroll');

  if (prefersReducedMotion) {
    revealTargets.forEach((el) => el.classList.add('in-view'));
  } else if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('in-view'));
  }

  /* ---------- 5. HERO PIPELINE NODE ANIMATION ---------- */
  const pipelineNodes = document.querySelectorAll('#heroPipeline .pipeline-node');

  if (!prefersReducedMotion && pipelineNodes.length) {
    let activeIndex = 0;
    pipelineNodes[0].classList.add('node-active');

    setInterval(() => {
      pipelineNodes[activeIndex].classList.remove('node-active');
      activeIndex = (activeIndex + 1) % pipelineNodes.length;
      pipelineNodes[activeIndex].classList.add('node-active');
    }, 1400);
  } else {
    pipelineNodes.forEach((node) => node.classList.add('node-active'));
  }

  /* ---------- 6. TIMELINE SCROLL PROGRESS ---------- */
  const timeline = document.getElementById('timeline');
  const timelineFill = document.querySelector('.timeline-line-fill');
  const timelineItems = document.querySelectorAll('.timeline-item');

  const updateTimelineProgress = () => {
    if (!timeline || !timelineFill) return;
    const rect = timeline.getBoundingClientRect();
    const viewportH = window.innerHeight;

    // How far the user has scrolled through the timeline, 0 to 1
    const total = rect.height;
    const scrolled = viewportH * 0.75 - rect.top;
    const ratio = Math.min(Math.max(scrolled / total, 0), 1);
    timelineFill.style.height = `${ratio * 100}%`;
  };

  if (timeline) {
    if (prefersReducedMotion) {
      timelineFill.style.height = '100%';
    } else {
      window.addEventListener('scroll', updateTimelineProgress, { passive: true });
      window.addEventListener('resize', updateTimelineProgress);
      updateTimelineProgress();
    }

    if ('IntersectionObserver' in window) {
      const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('in-view');
        });
      }, { threshold: 0.4 });
      timelineItems.forEach((item) => timelineObserver.observe(item));
    } else {
      timelineItems.forEach((item) => item.classList.add('in-view'));
    }
  }

  /* ---------- 7. WORKFLOW PIPELINE STEP ANIMATION ---------- */
  const workflowPipeline = document.getElementById('workflowPipeline');
  const workflowSteps = document.querySelectorAll('.workflow-step');

  if (workflowPipeline && workflowSteps.length) {
    let workflowStarted = false;

    const startWorkflowAnimation = () => {
      if (workflowStarted) return;
      workflowStarted = true;

      if (prefersReducedMotion) {
        workflowSteps.forEach((step) => step.classList.add('step-active'));
        return;
      }

      let i = 0;
      const interval = setInterval(() => {
        workflowSteps.forEach((step) => step.classList.remove('step-active'));
        workflowSteps[i].classList.add('step-active');
        i++;
        if (i >= workflowSteps.length) {
          clearInterval(interval);
          setTimeout(() => workflowSteps.forEach((step) => step.classList.add('step-active')), 400);
        }
      }, 350);
    };

    if ('IntersectionObserver' in window) {
      const workflowObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startWorkflowAnimation();
            workflowObserver.disconnect();
          }
        });
      }, { threshold: 0.4 });
      workflowObserver.observe(workflowPipeline);
    } else {
      startWorkflowAnimation();
    }
  }

  /* ---------- 8. PROJECT DETAILS DATA + MODAL ---------- */
  // Edit this object to update what appears in each project's "View Details" modal.
  const projectDetails = {
    cloudscale: {
      title: 'CloudScale',
      subtitle: 'Highly Available AWS Web Infrastructure',
      overview: 'Designed and implemented as a hands-on AWS infrastructure project. The goal is to build a highly available, fault-tolerant web architecture using core AWS networking and compute services.',
      architecture: [
        'Custom VPC with 2 public and 2 private subnets across availability zones',
        'Internet Gateway and route tables for public subnet traffic',
        'Application Load Balancer distributing traffic to a target group',
        'EC2 instances in an Auto Scaling group for availability and elasticity',
        'CloudWatch monitoring with SNS notifications for alerts',
        'S3 static website hosting and a Lambda-based serverless component'
      ],
      technologies: ['VPC', 'Internet Gateway', 'Application Load Balancer', 'EC2', 'EBS', 'Auto Scaling', 'CloudWatch', 'SNS', 'S3', 'Lambda'],
      implementation: 'Add project implementation details here.',
      challenges: 'Add project implementation details here.',
      learned: 'Add project implementation details here.',
      github: 'https://github.com/syedibrahimdev20-bot'
    },
    infraforge: {
      title: 'InfraForge',
      subtitle: 'AWS Infrastructure with Terraform & CI/CD',
      overview: 'Provisioned AWS EC2 infrastructure using Terraform and implemented an automated CI/CD pipeline using GitLab.',
      architecture: [
        'Wrote Terraform configuration files to define and manage cloud infrastructure',
        'Integrated the project repository with GitLab',
        'Built a GitLab CI/CD pipeline to automate the Terraform provisioning workflow',
        'Troubleshot CI/CD pipeline errors by analyzing logs and correcting configuration issues',
        'Successfully executed the end-to-end Terraform + GitLab CI/CD demonstration'
      ],
      technologies: ['Terraform', 'AWS EC2', 'EBS', 'Git', 'GitLab', 'GitLab CI/CD'],
      implementation: 'Add project implementation details here.',
      challenges: 'Add project implementation details here.',
      learned: 'Add project implementation details here.',
      github: 'https://github.com/syedibrahimdev20-bot'
    },
    quotebox: {
      title: 'QuoteBox',
      subtitle: 'Containerized Motivation Quotes Application',
      overview: 'A small application packaged into a Docker image, pushed to Docker Hub, and deployed to Kubernetes as a Pod exposed through a Service.',
      architecture: [
        'Application built and packaged into a Docker image',
        'Image pushed to Docker Hub for distribution',
        'Deployed to a Kubernetes cluster as a Pod',
        'Exposed internally/externally through a Kubernetes Service'
      ],
      technologies: ['Docker', 'Docker Hub', 'Kubernetes'],
      implementation: 'Add project implementation details here.',
      challenges: 'Add project implementation details here.',
      learned: 'Add project implementation details here.',
      github: 'https://github.com/syedibrahimdev20-bot'
    }
  };

  const modalOverlay = document.getElementById('modalOverlay');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');
  let lastFocusedElement = null;

  const buildModalHTML = (data) => `
    <h2 id="modalTitle">${data.title}</h2>
    <p class="modal-subtitle">${data.subtitle}</p>

    <h4>Overview</h4>
    <p>${data.overview}</p>

    <h4>Architecture</h4>
    <ul>${data.architecture.map((point) => `<li>${point}</li>`).join('')}</ul>

    <h4>Technologies</h4>
    <div class="modal-tech">${data.technologies.map((t) => `<span class="tech-badge">${t}</span>`).join('')}</div>

    <h4>Implementation</h4>
    <p>${data.implementation}</p>

    <h4>Challenges</h4>
    <p>${data.challenges}</p>

    <h4>What I Learned</h4>
    <p>${data.learned}</p>

    <h4>GitHub</h4>
    <p><a class="btn btn-outline btn-sm" href="${data.github}" target="_blank" rel="noopener noreferrer">View Repository</a></p>
  `;

  const openModal = (projectKey) => {
    const data = projectDetails[projectKey];
    if (!data) return;

    modalBody.innerHTML = buildModalHTML(data);
    lastFocusedElement = document.activeElement;
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  };

  const closeModal = () => {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocusedElement) lastFocusedElement.focus();
  };

  document.querySelectorAll('.project-details-btn').forEach((btn) => {
    btn.addEventListener('click', () => openModal(btn.dataset.project));
  });

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
  });

  /* ---------- 9. GITHUB STATS (graceful API handling) ---------- */
  const githubUsername = 'syedibrahimdev20-bot';
  const statRepos = document.getElementById('statRepos');
  const statFollowers = document.getElementById('statFollowers');
  const githubStatus = document.getElementById('githubStatus');

  fetch(`https://api.github.com/users/${githubUsername}`)
    .then((res) => {
      if (!res.ok) throw new Error('GitHub API request failed');
      return res.json();
    })
    .then((data) => {
      statRepos.textContent = data.public_repos ?? '—';
      statFollowers.textContent = data.followers ?? '—';
      githubStatus.textContent = 'Live stats from the GitHub API.';
    })
    .catch(() => {
      // Graceful fallback — never invent numbers if the API call fails.
      statRepos.textContent = '—';
      statFollowers.textContent = '—';
      githubStatus.textContent = 'Visit my GitHub profile directly to see my repositories.';
    });

  /* ---------- 10. CONTACT FORM VALIDATION + DEMO SUBMIT ---------- */
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');

  const fields = {
    name: { input: document.getElementById('name'), error: document.getElementById('nameError') },
    email: { input: document.getElementById('email'), error: document.getElementById('emailError') },
    message: { input: document.getElementById('message'), error: document.getElementById('messageError') }
  };

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const setFieldError = (field, message) => {
    field.input.closest('.form-group').classList.toggle('has-error', Boolean(message));
    field.error.textContent = message;
  };

  const validateForm = () => {
    let isValid = true;

    if (!fields.name.input.value.trim()) {
      setFieldError(fields.name, 'Please enter your name.');
      isValid = false;
    } else {
      setFieldError(fields.name, '');
    }

    if (!fields.email.input.value.trim()) {
      setFieldError(fields.email, 'Please enter your email.');
      isValid = false;
    } else if (!emailPattern.test(fields.email.input.value.trim())) {
      setFieldError(fields.email, 'Please enter a valid email address.');
      isValid = false;
    } else {
      setFieldError(fields.email, '');
    }

    if (!fields.message.input.value.trim()) {
      setFieldError(fields.message, 'Please enter a message.');
      isValid = false;
    } else {
      setFieldError(fields.message, '');
    }

    return isValid;
  };

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formNote.classList.remove('error-note');

    if (!validateForm()) {
      formNote.textContent = 'Please fix the highlighted fields.';
      formNote.classList.add('error-note');
      return;
    }

    // NOTE: There is no backend connected yet. This shows a demo success
    // message so the form is usable while you wire it up to a real service
    // (e.g. Formspree, EmailJS, or your own API endpoint).
    formNote.textContent = `Thanks, ${fields.name.input.value.trim()}! Succcessfully send it.`;
    contactForm.reset();
  });

});
