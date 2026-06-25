document.addEventListener('DOMContentLoaded', () => {
  
  // --- 1. Fallback Scroll Listener for Header (Firefox/Older Safari) ---
  if (!CSS.supports('(animation-timeline: scroll()) and (animation-range: 0% 100%)')) {
    const header = document.querySelector('header');
    
    const handleScroll = () => {
      if (window.scrollY > 40) {
        header.style.height = '64px';
        header.style.background = 'rgba(3, 3, 3, 0.75)';
        header.style.backdropFilter = 'blur(16px)';
        header.style.webkitBackdropFilter = 'blur(16px)';
        header.style.borderBottom = '1px solid rgba(255, 255, 255, 0.08)';
      } else {
        header.style.height = '90px';
        header.style.background = 'transparent';
        header.style.backdropFilter = 'none';
        header.style.webkitBackdropFilter = 'none';
        header.style.borderBottom = '1px solid transparent';
      }
    };
    
    // Run initially and bind to scroll
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  // --- 2. IntersectionObserver for Reveal Animations ---
  const revealElements = document.querySelectorAll('.reveal');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // Reveal once
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // --- 3. Interactive Product Card Mockups ---
  // DomusDash Card Hover Micro-Interactions (Chore Toggling)
  const domusCard = document.querySelector('.product-card-domus');
  const choreCheckboxes = document.querySelectorAll('.mockup-chores .chore-row');
  
  if (domusCard && choreCheckboxes.length > 0) {
    domusCard.addEventListener('mouseenter', () => {
      // Temporarily toggle checking items as a playful interaction
      const secondChore = choreCheckboxes[1]; // "Feed the dog"
      const checkbox = secondChore.querySelector('.chore-check');
      const text = secondChore.querySelector('span:not(.chore-check)');
      
      setTimeout(() => {
        if (domusCard.matches(':hover')) {
          checkbox.classList.add('chore-check-checked');
          text.style.textDecoration = 'line-through';
          text.style.color = 'var(--text-muted)';
        }
      }, 500);
    });
    
    domusCard.addEventListener('mouseleave', () => {
      // Revert chore to original state
      const secondChore = choreCheckboxes[1];
      const checkbox = secondChore.querySelector('.chore-check');
      const text = secondChore.querySelector('span:not(.chore-check)');
      
      checkbox.classList.remove('chore-check-checked');
      text.style.textDecoration = 'none';
      text.style.color = 'var(--text-secondary)';
    });
  }

  // IronDial Card Hover Micro-Interactions (Vital Pulse & Set Increment)
  const ironCard = document.querySelector('.product-card-iron');
  const vitalNumber = document.querySelector('.mockup-vital-num');
  
  if (ironCard && vitalNumber) {
    let originalText = vitalNumber.innerHTML;
    
    ironCard.addEventListener('mouseenter', () => {
      // Animate vitals tracking reading changing
      let count = 785;
      const target = 812;
      const duration = 600; // ms
      const stepTime = Math.abs(Math.floor(duration / (target - count)));
      
      const timer = setInterval(() => {
        count++;
        vitalNumber.innerHTML = `${count} <span>ng/dL</span>`;
        if (count >= target) {
          clearInterval(timer);
        }
      }, stepTime);
      
      // Store interval ID on element to clear if mouse leaves early
      vitalNumber.dataset.intervalId = timer;
    });
    
    ironCard.addEventListener('mouseleave', () => {
      // Clear ongoing interval and restore original text
      if (vitalNumber.dataset.intervalId) {
        clearInterval(parseInt(vitalNumber.dataset.intervalId));
      }
      vitalNumber.innerHTML = originalText;
    });
  }

  // --- ThumbVerify Card Hover Micro-Interactions ---
  const thumbCard = document.querySelector('.product-card-thumbverify');
  const dropzone = document.getElementById('thumbverify-dropzone');
  const tvRows = [
    document.getElementById('tv-row-1'),
    document.getElementById('tv-row-2'),
    document.getElementById('tv-row-3')
  ];
  let thumbTimeouts = [];

  if (thumbCard && dropzone) {
    thumbCard.addEventListener('mouseenter', () => {
      dropzone.classList.add('thumbverify-dropzone-active');
      const title = dropzone.querySelector('.thumbverify-status-title');
      const desc = dropzone.querySelector('.thumbverify-status-desc');
      
      if (title) title.textContent = 'Scanning...';
      if (desc) desc.textContent = 'Calculating hash';

      // Reset rows first
      tvRows.forEach(row => {
        if (row) row.classList.remove('active');
      });

      // Stagger activation
      thumbTimeouts.push(setTimeout(() => {
        if (tvRows[0]) tvRows[0].classList.add('active');
        if (desc) desc.textContent = 'Reading EXIF';
      }, 400));

      thumbTimeouts.push(setTimeout(() => {
        if (tvRows[1]) tvRows[1].classList.add('active');
        if (desc) desc.textContent = 'Validating checksum';
      }, 900));

      thumbTimeouts.push(setTimeout(() => {
        if (tvRows[2]) tvRows[2].classList.add('active');
        if (title) title.textContent = 'Valid file';
        if (desc) desc.textContent = 'SHA-256 Verified';
      }, 1400));
    });

    thumbCard.addEventListener('mouseleave', () => {
      // Clear timeouts
      thumbTimeouts.forEach(t => clearTimeout(t));
      thumbTimeouts = [];

      // Revert classes & text
      dropzone.classList.remove('thumbverify-dropzone-active');
      const title = dropzone.querySelector('.thumbverify-status-title');
      const desc = dropzone.querySelector('.thumbverify-status-desc');
      if (title) title.textContent = 'Drop File Here';
      if (desc) desc.textContent = 'Click or drag image';

      tvRows.forEach(row => {
        if (row) row.classList.remove('active');
      });
    });
  }

  // --- LocalRedactPDF Card Hover Micro-Interactions ---
  const redactCard = document.querySelector('.product-card-redact');
  const redactSwitches = [
    document.getElementById('redact-switch-ssn'),
    document.getElementById('redact-switch-email'),
    document.getElementById('redact-switch-meta')
  ];
  const redactBars = [
    document.getElementById('redact-bar-1'),
    document.getElementById('redact-bar-2')
  ];
  let redactTimeouts = [];

  if (redactCard) {
    redactCard.addEventListener('mouseenter', () => {
      // Clear switches and bars
      redactSwitches.forEach(sw => sw && sw.classList.remove('redact-switch-active'));
      redactBars.forEach(bar => bar && bar.classList.remove('redacted'));

      // Sequence
      redactTimeouts.push(setTimeout(() => {
        if (redactSwitches[0]) redactSwitches[0].classList.add('redact-switch-active');
        if (redactBars[0]) redactBars[0].classList.add('redacted');
      }, 300));

      redactTimeouts.push(setTimeout(() => {
        if (redactSwitches[1]) redactSwitches[1].classList.add('redact-switch-active');
        if (redactBars[1]) redactBars[1].classList.add('redacted');
      }, 800));

      redactTimeouts.push(setTimeout(() => {
        if (redactSwitches[2]) redactSwitches[2].classList.add('redact-switch-active');
      }, 1300));
    });

    redactCard.addEventListener('mouseleave', () => {
      redactTimeouts.forEach(t => clearTimeout(t));
      redactTimeouts = [];
      redactSwitches.forEach(sw => sw && sw.classList.remove('redact-switch-active'));
      redactBars.forEach(bar => bar && bar.classList.remove('redacted'));
    });
  }

  // --- ShortCodeIcons Card Hover Micro-Interactions ---
  const iconsCard = document.querySelector('.product-card-icons');
  const iconItems = [
    document.getElementById('icon-item-1'),
    document.getElementById('icon-item-2'),
    document.getElementById('icon-item-3'),
    document.getElementById('icon-item-4')
  ];
  const codeContent = document.getElementById('icons-code-content');
  const copyStatus = document.getElementById('icons-copy-status');
  let iconsCycleInterval = null;
  let copyStatusTimeout = null;

  const iconData = [
    { name: 'home', code: '<Icon name="home" />' },
    { name: 'plus', code: '<Icon name="plus" />' },
    { name: 'edit', code: '<Icon name="edit" />' },
    { name: 'settings', code: '<Icon name="settings" />' }
  ];

  if (iconsCard && codeContent && copyStatus) {
    let currentIconIdx = 0;

    iconsCard.addEventListener('mouseenter', () => {
      // Start cycling
      iconsCycleInterval = setInterval(() => {
        // Remove active class
        iconItems.forEach(item => item && item.classList.remove('icons-grid-item-active'));
        
        currentIconIdx = (currentIconIdx + 1) % iconData.length;
        
        const currentItem = iconItems[currentIconIdx];
        if (currentItem) currentItem.classList.add('icons-grid-item-active');
        
        codeContent.textContent = iconData[currentIconIdx].code;

        // Playful copy flash
        if (currentIconIdx === 2) {
          copyStatus.textContent = 'Copied!';
          copyStatus.style.color = '#10b981';
          copyStatus.style.background = 'rgba(16, 185, 129, 0.15)';
          
          if (copyStatusTimeout) clearTimeout(copyStatusTimeout);
          copyStatusTimeout = setTimeout(() => {
            copyStatus.textContent = 'Copy';
            copyStatus.style.color = 'var(--text-muted)';
            copyStatus.style.background = 'rgba(255, 255, 255, 0.05)';
          }, 600);
        }
      }, 900);
    });

    iconsCard.addEventListener('mouseleave', () => {
      if (iconsCycleInterval) clearInterval(iconsCycleInterval);
      if (copyStatusTimeout) clearTimeout(copyStatusTimeout);
      
      // Revert to first active state
      iconItems.forEach((item, idx) => {
        if (item) {
          if (idx === 0) item.classList.add('icons-grid-item-active');
          else item.classList.remove('icons-grid-item-active');
        }
      });
      codeContent.textContent = iconData[0].code;
      copyStatus.textContent = 'Copy';
      copyStatus.style.color = 'var(--text-muted)';
      copyStatus.style.background = 'rgba(255, 255, 255, 0.05)';
      currentIconIdx = 0;
    });
  }

  // --- 4. Contact Form Handler (Simulated Submit with Success Feedback) ---
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const successMsg = document.getElementById('successMsg');
  
  if (contactForm && submitBtn && successMsg) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Validation check
      if (!contactForm.checkValidity()) {
        return;
      }
      
      const keyInput = document.getElementById('web3FormsKey');
      const isPlaceholder = !keyInput || keyInput.value === 'YOUR_ACCESS_KEY_HERE' || keyInput.value.trim() === '';
      
      // Disable inputs and button, show sending state
      submitBtn.disabled = true;
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Sending... <svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation: spin 1s linear infinite"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)"></circle><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor"></path></svg>';
      
      // Add inline CSS keyframes for spinner if not present
      if (!document.getElementById('spinner-style')) {
        const style = document.createElement('style');
        style.id = 'spinner-style';
        style.innerHTML = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
        document.head.appendChild(style);
      }
      
      const handleSuccess = () => {
        // Success state
        successMsg.style.display = 'block';
        successMsg.textContent = 'Your inquiry has been successfully sent! We will contact you soon.';
        successMsg.style.borderColor = 'rgba(16, 185, 129, 0.2)';
        successMsg.style.color = '#10b981';
        successMsg.style.background = 'rgba(16, 185, 129, 0.08)';
        contactForm.reset();
        
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
        
        // Scroll success message into view smoothly
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Hide success message after 7 seconds
        setTimeout(() => {
          successMsg.style.display = 'none';
        }, 7000);
      };
      
      const handleError = (message) => {
        // Error state
        successMsg.style.display = 'block';
        successMsg.textContent = message || 'Something went wrong. Please try again later or email us directly.';
        successMsg.style.borderColor = 'rgba(239, 68, 68, 0.2)';
        successMsg.style.color = '#ef4444';
        successMsg.style.background = 'rgba(239, 68, 68, 0.08)';
        
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
        
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      };
      
      if (isPlaceholder) {
        // Fallback simulator for previewing/local development
        console.warn("Web3Forms access key is not set. Simulating form submission.");
        setTimeout(handleSuccess, 1500);
      } else {
        // Actual HTTP POST submission
        const formData = new FormData(contactForm);
        
        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          body: formData
        })
        .then(async (response) => {
          const json = await response.json();
          if (response.status === 200) {
            handleSuccess();
          } else {
            handleError(json.message);
          }
        })
        .catch((error) => {
          console.error(error);
          handleError('Failed to send message. Please check your connection and try again.');
        });
      }
    });
  }
});
