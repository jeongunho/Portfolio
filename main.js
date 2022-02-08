'use strict';

// Make navbar transparent when it's on the top
const navbar = document.querySelector('#navbar');
const navbarHeight = navbar.getBoundingClientRect().height;
document.addEventListener('scroll', () => {
  /*
  console.log(window.scrollY);
  console.log(navbarHeight);
  */
  if(window.scrollY > navbarHeight) {
    navbar.classList.add('navbar--dark');
  } else {
    navbar.classList.remove('navbar--dark');
  }
});

// Handle scrolling when tapping on the navbar menu
const navbarMenu = document.querySelector('.navbar__menu');
navbarMenu.addEventListener('click', (event) => {
  const target = event.target;
  const link = target.dataset.link;
  if(link == null) {
    return;
  }
  navbarMenu.classList.remove('open');
  scrollIntoView(link);
});

// Navbar toggle button for small screen
const navbarToggleBtn = document.querySelector('.navbar__toggle-btn');
navbarToggleBtn.addEventListener('click', () => {
  navbarMenu.classList.toggle('open');
});

// Handle click on 'Contact Me' button on home
const contactBtn = document.querySelector('.home__contact');
contactBtn.addEventListener('click', () => {
  scrollIntoView('#contact')
});

// Make home slowly fade to transparent as the window scrolls down
const home = document.querySelector('#home');
const homeHeight = home.getBoundingClientRect().height;
const homeContainer = document.querySelector('.home__container');
document.addEventListener('scroll', () => {
  homeContainer.style.opacity = 1 - window.scrollY / homeHeight;
  contactBtn.style.opacity = 1 - window.scrollY / homeHeight;
});

// When mouse enter 'Contact Me' button: regain opacity
contactBtn.addEventListener('mouseover', () => {
  contactBtn.style.opacity = 1;
  contactBtn.style.transition = 'all 300ms ease-in-out';
});

// When mouse leave 'Contact Me' button: lose opacity
contactBtn.addEventListener('mouseleave', () => {
  contactBtn.style.opacity = 1 - window.scrollY / homeHeight;
});

// Show '↑' button when scrolling down
const arrowUp = document.querySelector('.arrow-up');
document.addEventListener('scroll', () => {
  if(window.scrollY > homeHeight / 2) {
    arrowUp.classList.add('visible');
  } else {
    arrowUp.classList.remove('visible');
  }
});

// Handle click on the '↑' button
arrowUp.addEventListener('click', () => {
  scrollIntoView('#home');
});

// Projects
const workBtnContainer = document.querySelector('.work__category');
const projectsContainer = document.querySelector('.work__projects');
const projects = document.querySelectorAll('.project');
workBtnContainer.addEventListener('click', (event) => {
  const filter = event.target.dataset.filter || event.target.parentNode.dataset.filter;
  if(filter == null) {
    return;
  }

  // Remove selection from the previous item and select the new one
  const active = document.querySelector('.category__btn.selected');
  active.classList.remove('selected');
  const target = event.target.nodeName === 'BUTTON' ? event.target : event.target.parentNode;
  target.classList.add('selected');

  projectsContainer.classList.add('animationOut');
  setTimeout(() => {
    projects.forEach((project) => {
      if(filter === '*' || filter === project.dataset.type) {
        project.classList.remove('invisible');
      } else {
        project.classList.add('invisible');
      }
    });
    projectsContainer.classList.remove('animationOut');
  }, 300);
});

const sectionIds = ['#home', '#about', '#skills', '#work', '#contact'];
const sections = sectionIds.map(value => document.querySelector(value));
// console.log(sections);
const navItems = sectionIds.map(value => document.querySelector(`[data-link='${value}']`));
// console.log(navItems);

function getIndexOfSectionOnViewPort() {
  const section = document.elementFromPoint(window.innerWidth / 2, window.innerHeight * (2 / 3)).closest('.section');
  const index = sectionIds.indexOf(`#${section.id}`);
  return index;
}

let selectedNavIndex = getIndexOfSectionOnViewPort();
let selectedNavItem = navItems[selectedNavIndex];

function selectNavItem(selected) {
  selectedNavItem.classList.remove('active');
  selectedNavItem = selected;
  selectedNavItem.classList.add('active');
}

// Scroll function
function scrollIntoView(selector) {
  const scrollTo = document.querySelector(selector);
  scrollTo.scrollIntoView({behavior: "smooth"});
  selectNavItem(navItems[sectionIds.indexOf(selector)]);
}

const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.3,
};
const observerCallback = (entries) => {
  entries.forEach(value => {
    // console.log(value.target);
    if (!value.isIntersecting && value.intersectionRatio > 0) {
      const index = sectionIds.indexOf(`#${value.target.id}`);
      // console.log(index);
      if (value.boundingClientRect.y < 0) {
        selectedNavIndex = index + 1;
      } else {
        selectedNavIndex = index -1;
      }
    }
  });
};
const observer = new IntersectionObserver(observerCallback, observerOptions);
sections.forEach(value => observer.observe(value));

window.addEventListener('wheel', () => {
  if(window.scrollY === 0) {
    selectedNavIndex = 0;
  } else if (Math.round(window.scrollY + window.innerHeight) >= document.body.clientHeight) {
    selectedNavIndex = navItems.length - 1;
  }
  selectNavItem(navItems[selectedNavIndex]);
});

window.addEventListener('load', () => {
  selectNavItem(navItems[selectedNavIndex]);
});