  // Select the menu button and menu component
  const ham = document.querySelector('.nav_menu-link')
  const menu = document.querySelector('.menu_component_2')

  // Function to toggle menu
  function toggleMenu() {
    if (isOpen) {
      // If menu is open, fade out and hide the menu
      gsap.to(menu, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          menu.style.display = 'none'
          isOpen = false

          // Store menu state in localStorage
          localStorage.setItem('menuState', 'closed')
        },
      })
    } else {
      // If menu is closed, show and fade in the menu
      menu.style.display = 'block' // Ensure menu is visible before fading in
      gsap.to(menu, {
        opacity: 1,
        duration: 0.5,
        onComplete: () => {
          isOpen = true

          // Store menu state in localStorage
          localStorage.setItem('menuState', 'open')
        },
      })
    }
  }

  // Add event listener to toggle the menu on menu button click

  // Add event listeners to handle menu hover
  ham.addEventListener('mouseenter', () => {
    if (!isOpen) {
      toggleMenu()
    }
  })

  menu.addEventListener('mouseleave', () => {
    if (isOpen) {
      toggleMenu()
    }
  })

  // Check localStorage for stored menu state on page load
  document.addEventListener('DOMContentLoaded', function () {
    const storedMenuState = localStorage.getItem('menuState')

    // If menu state is stored, initialize menu based on stored state
    if (storedMenuState === 'open') {
      // Open the menu
      toggleMenu()
    }
  })

  //change menu text styles
  const menuTextElements = document.querySelectorAll('.menu_link-text_2')

  // Loop through each menu text element
  menuTextElements.forEach((element) => {
    // Change the font size of the text element
    element.style.fontSize = '25px' // Set the font size
    // Change the font family of the text element
    element.style.fontFamily = 'Clashgrotesk' // Set the font family
    element.style.fontWeight = '400'
  })
  // Handle mouseover and mouseout events for image elements
  const workCards = document.querySelectorAll('.grid-item')

  // Function to handle mouseover
  function handleMouseOver() {
    // Add mouseover logic
    this.style.transition = 'transform 0.2s, opacity 0.3s'
    this.style.transform = 'scale(1.010)'
    this.style.opacity = '1'

    const menuText = document.querySelectorAll('.menu_link_2')
    menuText.forEach((element) => {
      element.style.color = 'white'
    })