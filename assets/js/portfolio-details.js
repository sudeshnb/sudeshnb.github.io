// portfolio-details.js
document.addEventListener('DOMContentLoaded', () => {
    "use strict";

    // Initialize Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyC6An8cdWlV9-z67Degd--8-zDObWO6b74",
        authDomain: "my-website-206d7.firebaseapp.com",
        projectId: "my-website-206d7",
        storageBucket: "my-website-206d7.appspot.com",
        messagingSenderId: "876367222618",
        appId: "1:876367222618:web:bb5859831bb7560e410563"
      };
    
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    /**
    * Preloader
    */
    const preloader = document.querySelector('#preloader');
    if (preloader) {
        window.addEventListener('load', () => {
        preloader.remove();
        });
    }
    
    /**
    * Sticky header on scroll
    */
    const selectHeader = document.querySelector('#header');
    if (selectHeader) {
        document.addEventListener('scroll', () => {
        window.scrollY > 100 ? selectHeader.classList.add('sticked') : selectHeader.classList.remove('sticked');
        });
    }

      /**
   * Navbar links active state on scroll
   */
  let navbarlinks = document.querySelectorAll('#navbar .scrollto');

  function navbarlinksActive() {
    navbarlinks.forEach(navbarlink => {

      if (!navbarlink.hash) return;

      let section = document.querySelector(navbarlink.hash);
      if (!section) return;

      let position = window.scrollY;
      if (navbarlink.hash != '#header') position += 200;

      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active');
      } else {
        navbarlink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navbarlinksActive);
  document.addEventListener('scroll', navbarlinksActive);

  


  /**
   * Mobile nav toggle
   */
  const mobileNavToogle = document.querySelector('.mobile-nav-toggle');
  if (mobileNavToogle) {
    mobileNavToogle.addEventListener('click', function(event) {
      event.preventDefault();

      document.querySelector('body').classList.toggle('mobile-nav-active');

      this.classList.toggle('bi-list');
      this.classList.toggle('bi-x');
    });
  }
   /**
   * Toggle mobile nav dropdowns
   */
   const navDropdowns = document.querySelectorAll('.navbar .dropdown > a');

   navDropdowns.forEach(el => {
     el.addEventListener('click', function(event) {
       if (document.querySelector('.mobile-nav-active')) {
         event.preventDefault();
         this.classList.toggle('active');
         this.nextElementSibling.classList.toggle('dropdown-active');
 
         let dropDownIndicator = this.querySelector('.dropdown-indicator');
         dropDownIndicator.classList.toggle('bi-chevron-up');
         dropDownIndicator.classList.toggle('bi-chevron-down');
       }
     })
   });

   /**
   * Scroll top button
   */
  const scrollTop = document.querySelector('.scroll-top');
  if (scrollTop) {
    const togglescrollTop = function() {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
    window.addEventListener('load', togglescrollTop);
    document.addEventListener('scroll', togglescrollTop);
    scrollTop.addEventListener('click', window.scrollTo({
      top: 0,
      behavior: 'smooth'
    }));
  }
   /**
   * Initiate glightbox
   */
   const glightbox = GLightbox({
    selector: '.glightbox'
  });
    // Get portfolio ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const portfolioId = urlParams.get('id');
  
    // DOM Elements
    const loadingElement = document.getElementById('portfolio-loading');
    const errorElement = document.getElementById('portfolio-error');
    const contentElement = document.getElementById('portfolio-content');

     // Configure marked.js
    marked.setOptions({
      breaks: true,
      highlight: (code) => hljs.highlightAuto(code).value
    });

  
    // Initialize Swiper
    let portfolioSwiper = null;

    const initializeSwiper = () => {
        portfolioSwiper = new Swiper('.portfolio-details-slider', {
            speed: 600,
            loop: true,
            autoplay: {
              delay: 5000,
              disableOnInteraction: false
            },
            slidesPerView: 'auto',
            pagination: {
              el: '.swiper-pagination',
              type: 'bullets',
              clickable: true
            },
            breakpoints: {
                320: {
                  slidesPerView: 1,
                },
                1200: {
                  slidesPerView: 1,
                }
              }
        });
    };

    // Load portfolio data
    const loadPortfolioDetails = async () => {
      try {
        if (!portfolioId) throw new Error('No portfolio ID specified');
        
        // Show loading state
        loadingElement.style.display = 'block';
        // contentElement.style.display = 'none';
        contentElement.setAttribute('data-loading', 'true');
        errorElement.style.display = 'none';


  
        const doc = await db.collection("portfolioItems").doc(portfolioId).get();
        
        if (!doc.exists) throw new Error('Portfolio item not found');
        
        const data = doc.data();
        // Update page title
        document.title = `${data.title || 'Portfolio Details'} - Sudesh Bandara`;

        // Update images
        const slidesContainer = document.getElementById('portfolio-slides');
        slidesContainer.innerHTML = data.images.map(img => `
            <div class="swiper-slide">
            <img src="${img}" alt="${data.title}" class="img-fluid">
            </div>
        `).join('');
  
    // Update metadata
    document.getElementById('portfolio-category').textContent = data.category || 'Not specified';
    document.getElementById('portfolio-client').textContent = data.client || 'Not specified';
    document.getElementById('portfolio-date').textContent = data.date || 'Not available';
    const urlElement = document.getElementById('portfolio-url');
    if (data.detailsUrl) {
        urlElement.href = data.detailsUrl;
        urlElement.textContent = new URL(data.detailsUrl).hostname;
      } else {
        urlElement.parentElement.remove();
      }

      const previewUrl = document.getElementById('portfolio-preview-url');
      if (data.previewUrl) {
        previewUrl.href = data.previewUrl;
        previewUrl.textContent = new URL(data.previewUrl).hostname;
        } else {
          previewUrl.parentElement.remove();
        }

    // Update descriptions
    document.getElementById('portfolio-subtitle').textContent = data.title  || '';
    // document.getElementById('portfolio-description').textContent = data.description  || '';
    // document.getElementById('portfolio-description').textContent = marked.parse(data.description);

    // document.getElementById('portfolio-description').innerHTML = marked.parse(data.description);
    document.getElementById('portfolio-description').innerHTML = DOMPurify.sanitize(
      marked.parse(data.description || '')
    );

    // renderMarkdown(data.description);

    // contentElement.innerHTML = marked.parse(data.description);

    // Initialize Swiper
    if (portfolioSwiper) portfolioSwiper.destroy();
    
        initializeSwiper();
        // Show content
        contentElement.setAttribute('data-loading', 'false');
        loadingElement.style.display = 'none';
    
        } catch (error) {
          console.error('Error loading portfolio:', error);
          errorElement.textContent = `Error loading portfolio: ${error.message}`;
          errorElement.style.display = 'block';
          loadingElement.style.display = 'none';
          contentElement.setAttribute('data-loading', 'false');
        }
    };
  
    loadPortfolioDetails();

    const renderMarkdown = (content) => {
      const html = marked.parse(content || '');
      const cleanHtml = DOMPurify.sanitize(html);
      document.getElementById('portfolio-description').innerHTML = cleanHtml;
      
      // Highlight code blocks
      document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
      });
    };
    /**
   * Animation on scroll function and init
   */
  function aos_init() {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', () => {
    aos_init();
  });
  });