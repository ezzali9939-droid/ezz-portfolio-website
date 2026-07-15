import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class RobotAnimationSystem {
  constructor() {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Scroll parallax is disabled per user request to keep robots static and only move with mouse
  }

  playEntrance(targetPage) {
    if (this.reducedMotion) {
      this.playReducedMotion(targetPage);
      return;
    }

    switch (targetPage) {
      case '#home':
        this.playHomeEntrance();
        break;
      case '#about':
        this.playAboutEntrance();
        break;
      case '#service':
        this.playServiceEntrance();
        break;
      case '#contact':
        this.playContactEntrance();
        break;
    }
  }

  playHomeEntrance() {
    const heroRobot = document.querySelector('.hero-robot');
    const heroCopy = document.querySelector('.hero-copy');
    const heroTags = document.querySelector('.hero-tags');
    const hudMarkers = document.querySelectorAll('.hero-visual .hud-marker');

    if (heroRobot) {
      gsap.killTweensOf(heroRobot);
      gsap.set(heroRobot, { opacity: 1 });
      heroRobot.classList.remove('idle-active');
    }

    gsap.killTweensOf([heroCopy, heroTags, hudMarkers]);
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out', duration: 1.2 }
    });

    if (hudMarkers.length) tl.set(hudMarkers, { opacity: 0, scale: 0.8 });
    if (heroCopy) tl.set(heroCopy.children, { opacity: 0, y: 15 });
    if (heroTags) tl.set(heroTags.children, { opacity: 0, scale: 0.9 });

    if (heroCopy) {
      tl.to(heroCopy.children, {
        opacity: 1,
        y: 0,
        stagger: 0.12,
        duration: 0.8
      });
    }

    if (hudMarkers.length) {
      tl.to(hudMarkers, {
        opacity: 1,
        scale: 1,
        stagger: 0.15,
        duration: 0.8
      }, '-=0.6');
    }

    if (heroTags) {
      tl.to(heroTags.children, {
        opacity: 1,
        scale: 1,
        stagger: 0.1,
        duration: 0.8
      }, '-=0.6');
    }
  }

  playAboutEntrance() {
    const aboutRobot = document.querySelector('.about-visual img');
    const aboutCopy = document.querySelector('.about-copy');
    const statsRow = document.querySelector('.stats-row');

    if (aboutRobot) {
      gsap.killTweensOf(aboutRobot);
      gsap.set(aboutRobot, { opacity: 1 });
      aboutRobot.classList.remove('idle-active');
    }

    gsap.killTweensOf([aboutCopy, statsRow]);

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out', duration: 1.2 }
    });

    if (statsRow) tl.set(statsRow, { opacity: 0, y: 15 });

    if (aboutCopy) {
      const copyElements = aboutCopy.querySelectorAll(':scope > *:not(.stats-row)');
      tl.fromTo(copyElements, 
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 0.8 }
      );
    }

    if (statsRow) {
      tl.to(statsRow, {
        opacity: 1,
        y: 0,
        duration: 0.8
      }, '-=0.4');
    }
  }

  playServiceEntrance() {
    const serviceRobot = document.querySelector('.service-visual img');
    const serviceCopy = document.querySelector('.service-copy');

    if (serviceRobot) {
      gsap.killTweensOf(serviceRobot);
      gsap.set(serviceRobot, { opacity: 1 });
      serviceRobot.classList.remove('idle-active');
    }

    gsap.killTweensOf([serviceCopy]);

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out', duration: 1.2 }
    });

    if (serviceCopy) {
      tl.fromTo(serviceCopy.children,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 0.8 }
      );
    }
  }

  playContactEntrance() {
    const contactRobot = document.querySelector('.contact-hand img');
    const contactCopy = document.querySelector('.contact-hero-copy');

    if (contactRobot) {
      gsap.killTweensOf(contactRobot);
      gsap.set(contactRobot, { opacity: 1 });
      contactRobot.classList.remove('idle-active');
    }

    gsap.killTweensOf([contactCopy]);

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out', duration: 1.2 }
    });

    if (contactCopy) {
      tl.fromTo(contactCopy.children,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 0.8 }
      );
    }
  }

  playReducedMotion(targetPage) {
    const robots = document.querySelectorAll('.page-hero-robot, .flipped-robot, .contact-hand img');
    robots.forEach(robot => {
      gsap.killTweensOf(robot);
      gsap.set(robot, { clearProps: 'all' });
      gsap.set(robot, { opacity: 1, filter: 'drop-shadow(0 0 20px rgba(158,61,255,0.25))' });
      robot.classList.remove('idle-active');
    });
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(reveal => reveal.classList.add('is-visible'));
  }
}
