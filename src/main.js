import './styles/style.css'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import './menu'
import './layoutArray'

// Initialize Lenis
const lenis = new Lenis({
  lerp: 0.07,
  wheelMultiplier: 1,
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

document.addEventListener('DOMContentLoaded', function () {
  setupModal()
  staggerAnimation()
  setupCategoryFiltering()
  setupWorkSelectsModal()
})

//Scroll Back To Top
document.addEventListener('DOMContentLoaded', () => {
  const scrollButton = document.querySelector('#scroll-button')

  if (!scrollButton) {
    console.log('No element with the ID "scroll-button" found.')
    return
  }

  scrollButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })
})

// Setup Modal
function setupModal() {
  const modal = document.querySelector('.modal_container')
  if (!modal) {
    console.error('Element with class "modal_container" not found')
    return
  }

  const closeButton = document.querySelector('#button-close')
  const nextButton = document.querySelector('#button-next')
  const prevButton = document.querySelector('#button-prev')
  const modalVideo = document.querySelector('#modalVideo')
  const modalImage = document.querySelector('.modal_image')
  const spinner = document.querySelector('#spinner')
  const workItems = document.querySelectorAll('.work_selects_item')

  if (
    !closeButton ||
    !nextButton ||
    !prevButton ||
    !modalVideo ||
    !modalImage ||
    !spinner
  ) {
    console.error('One or more modal elements not found')
    return
  }

  closeButton.addEventListener('click', closeModal)
  nextButton.addEventListener('click', nextItem)
  prevButton.addEventListener('click', prevItem)

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal()
    }
  })

  workItems.forEach((item) => {
    item.addEventListener('click', () => {
      document
        .querySelector('.work_selects_item.is-active')
        ?.classList.remove('is-active')
      item.classList.add('is-active')
      openModal(item)
    })
  })

  function openModal(item) {
    const videoLink = item.dataset.videoLink
    console.log('Video Link:', videoLink)
    const imageSrc = item.querySelector('img').src
    const brand = item.querySelector('.work_brand').textContent
    const title = item.querySelector('.work_title').textContent
    const directorName = item.dataset.director

    modal.querySelector('.modal_brand').textContent = brand
    modal.querySelector('.modal_title').textContent = title
    modal.querySelector('.modal-director_heading').textContent = directorName

    if (videoLink) {
      const vimeoId = videoLink.split('/').pop()
      const embedUrl = `https://player.vimeo.com/video/${vimeoId}`
      spinner.style.display = 'block'
      modalVideo.style.display = 'block'
      modalImage.style.display = 'none'

      const iframe = document.createElement('iframe')
      iframe.src = embedUrl
      iframe.width = '100%'
      iframe.height = '100%'
      iframe.frameBorder = '0'
      iframe.allow = 'autoplay; fullscreen'
      iframe.allowFullscreen = true

      modalVideo.innerHTML = ''
      modalVideo.appendChild(iframe)

      iframe.onload = () => {
        gsap.to(spinner, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            spinner.style.display = 'none'
          },
        })
      }

      iframe.onerror = () => {
        console.error('Iframe failed to load')
        gsap.to(spinner, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            spinner.style.display = 'none'
          },
        })
      }

      iframe.onerror = () => {
        console.error('Iframe failed to load')
        spinner.style.display = 'none'
      }
    } else {
      modalVideo.style.display = 'none'
      modalImage.style.display = 'block'
      modalImage.src = imageSrc
    }

    modal.style.display = 'block'

    const tl = gsap.timeline()
    tl.set(item.querySelector('.work_card-highlight'), {
      display: 'block',
      opacity: 0.65,
    }).to(modal, { opacity: 1, duration: 0.1, ease: 'power3.out' }, '<')

    modal.classList.add('active')
  }

  function closeModal() {
    const tl = gsap.timeline({
      onComplete: () => {
        modal.style.display = 'none'
        modal.classList.remove('active')
        modalVideo.innerHTML = ''
      },
    })
    tl.to(modal, { opacity: 0, duration: 0.21, ease: 'power3.out' })
  }

  function nextItem() {
    let currentItem = document.querySelector('.work_selects_item.is-active')
    let nextItem = currentItem.nextElementSibling
    if (!nextItem) {
      nextItem = workItems[0]
    }
    currentItem.classList.remove('is-active')
    nextItem.classList.add('is-active')
    openModal(nextItem)
  }

  function prevItem() {
    let currentItem = document.querySelector('.work_selects_item.is-active')
    let prevItem = currentItem.previousElementSibling
    if (!prevItem) {
      prevItem = workItems[workItems.length - 1]
    }
    currentItem.classList.remove('is-active')
    prevItem.classList.add('is-active')
    openModal(prevItem)
  }
}

function setupWorkSelectsModal() {
  const workSelectsListWrapper = document.querySelector(
    '.work_selects_list_wrapper'
  )
  const workSelectsItems = document.querySelectorAll(
    '.work_selects_list .work_selects_item'
  )

  if (!workSelectsListWrapper) {
    console.error('Element with class "work_selects_list_wrapper" not found')
    return
  }

  workSelectsItems.forEach((item) => {
    item.addEventListener('click', () => {
      openModal(item) // Assuming this works for your specific modal setup
    })
  })

  function openModal(item) {
    const videoLink = item.dataset.videoLink
    const imageSrc = item.querySelector('img').src
    const brand = item.querySelector('.work_brand').textContent
    const title = item.querySelector('.work_title').textContent
    const directorName = item.dataset.director

    const modal = document.querySelector('.modal_container')
    const modalVideo = document.querySelector('#modalVideo')
    const modalImage = document.querySelector('.modal_image')
    const spinner = document.querySelector('#spinner')

    modal.querySelector('.modal_brand').textContent = brand
    modal.querySelector('.modal_title').textContent = title
    modal.querySelector('.modal-director_heading').textContent = directorName

    if (videoLink) {
      const vimeoId = videoLink.split('/').pop()
      const embedUrl = `https://player.vimeo.com/video/${vimeoId}`
      spinner.style.display = 'block'
      modalVideo.style.display = 'block'
      modalImage.style.display = 'none'

      const iframe = document.createElement('iframe')
      iframe.src = embedUrl
      iframe.width = '100%'
      iframe.height = '100%'
      iframe.frameBorder = '0'
      iframe.allow = 'autoplay; fullscreen'
      iframe.allowFullscreen = true

      modalVideo.innerHTML = ''
      modalVideo.appendChild(iframe)

      iframe.onload = () => {
        spinner.style.display = 'none'
      }

      iframe.onerror = () => {
        console.error('Iframe failed to load')
        spinner.style.display = 'none'
      }
    } else {
      modalVideo.style.display = 'none'
      modalImage.style.display = 'block'
      modalImage.src = imageSrc
    }

    modal.style.display = 'block'

    const tl = gsap.timeline()
    tl.set(item.querySelector('.work_selects_item-highlight'), {
      display: 'block',
      opacity: 0.65,
    }).to(modal, { opacity: 1, duration: 0.1, ease: 'power3.out' }, '<')

    modal.classList.add('active')
  }
}

function staggerAnimation() {
  const wrapper = document.getElementById('page-wrapper')
  if (wrapper) {
    wrapper.style.display = 'flex'
    wrapper.style.opacity = '0'

    gsap.fromTo(
      wrapper, // Target element
      { opacity: 0.7, x: 0 }, // From properties
      {
        opacity: 1,
        x: 0,
        stagger: 0.5,
        duration: 0.55,
        ease: 'power2.out',
        delay: 0.25,
      } // To properties
    )
  }
}

function setupCategoryFiltering() {
  const filterButtons = document.querySelectorAll('[data-button-category]')
  const items = document.querySelectorAll('.work_selects_item')

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const category = button.dataset.buttonCategory

      // Hide all items initially
      gsap.set(items, { display: 'none', opacity: 0.9, scale: 0.97 })

      // Filter and show matching items with a staggered animation
      const matchingItems = Array.from(items).filter(
        (item) => category === 'all' || item.dataset.workCategory === category
      )

      gsap.to(matchingItems, {
        display: 'block',
        opacity: 1,
        scale: 1,
        duration: 0.5,

        ease: 'sine.out',
      })
    })
  })
}

document.addEventListener('DOMContentLoaded', function () {
  gsap.to('.scroll-dot', {
    opacity: 0,
    y: 40,
    duration: 1,
    repeat: -1,
    ease: 'power1',
  })
})

document.addEventListener('DOMContentLoaded', function () {
  const contactButton = document.getElementById('button-email')
  const contactMessage = document.getElementById('contact_message')
  const emailTitle = document.getElementById('email-title')
  const footer = document.getElementById('contact_wrap')
  const buttonEmail = document.getElementById('button-email')

  const timeline = gsap.timeline({ paused: true })
  timeline.to(contactMessage, {
    opacity: 1,
    duration: 0.72,
    ease: 'power3.out',
    display: 'block',
  })
  timeline.to(buttonEmail, {
    backgroundColor: '',
    duration: 1,
    ease: 'power3.out',
  })
  timeline.to(footer, {
    opacity: 1,
    duration: 1,
    ease: 'power1.out',
  })
  timeline.to(contactMessage, {
    delay: 0,
    opacity: 0,
    duration: 1,
    ease: 'power1.out',
    display: 'none',
  })

  contactButton.addEventListener('click', function () {
    timeline.restart()
    // Copy email address to clipboard
    navigator.clipboard
      .writeText(emailTitle.innerText)
      .then(() => {
        console.log('Email address copied to clipboard')
        contactButton.textContent = 'Copied' // Change the button text to 'Copied'
      })
      .catch((error) => {
        console.error('Unable to copy email address to clipboard:', error)
      })
  })
})

document.addEventListener('DOMContentLoaded', function () {
  // Define a common function for scrolling
  function scrollToSection(targetId) {
    const targetElement = document.querySelector(targetId)
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
      })
    } else {
      console.error(`Element with ID "${targetId}" not found`)
    }
  }

  // Attach event listeners to navigation buttons
  const navButtons = [
    { id: '#nav_work', target: '#work_wrap' },
    { id: '#nav_about', target: '#about_wrap' },
    { id: '#nav_contact', target: '#contact_wrap' },
    { id: '#footer_about', target: '#about_wrap' },
    { id: '#footer_work', target: '#work_wrap' },
    { id: '#footer_contact', target: '#contact_wrap' },
  ]

  navButtons.forEach((button) => {
    const element = document.querySelector(button.id)
    if (element) {
      element.addEventListener('click', () => scrollToSection(button.target))
    } else {
      console.error(`Navigation button with ID "${button.id}" not found`)
    }
  })
})

// About text fade on hover
document.addEventListener('DOMContentLoaded', function () {
  const collectionItems = document.querySelectorAll('.about-me_collection-item')
  const aboutText = document.getElementById('about_text')
  const socialLink = document.getElementById('about_link')

  const originalText = aboutText ? aboutText.textContent : ''

  if (!aboutText) {
    console.error('Element with ID "about_text" not found')
  }

  if (!socialLink) {
    console.error('Element with ID "about_link" not found')
  }

  collectionItems.forEach((item) => {
    const descriptionDiv = item.querySelector('div[data-description]')
    const description = descriptionDiv
      ? descriptionDiv.getAttribute('data-description')
      : null
    const image = item.querySelector('.about-me_image')

    if (!description) {
      console.error('No data-description found for:', item)
    }

    if (!image) {
      console.error('No image element found for:', item)
    } else {
      image.addEventListener('mouseenter', () => {
        if (aboutText) {
          gsap.fromTo(
            aboutText,
            { opacity: 1 },
            {
              opacity: 0,
              duration: 0.3,
              onComplete: () => {
                aboutText.textContent = description
                gsap.fromTo(
                  aboutText,
                  { opacity: 0 },
                  { opacity: 1, duration: 0.3 }
                )
              },
            }
          )
        }
      })

      image.addEventListener('click', () => {
        if (socialLink) {
          window.open(socialLink.href, socialLink.target)
        } else {
          console.error('Social link element is missing')
        }
      })

      image.addEventListener('mouseleave', () => {
        if (aboutText) {
          gsap.fromTo(
            aboutText,
            { opacity: 1 },
            {
              opacity: 0,
              duration: 0.3,
              onComplete: () => {
                aboutText.textContent = originalText
                gsap.fromTo(
                  aboutText,
                  { opacity: 0 },
                  { opacity: 1, duration: 0.3 }
                )
              },
            }
          )
        }
      })
    }
  })
})

document.addEventListener('DOMContentLoaded', function () {
  // Select all items in the list
  const items = document.querySelectorAll(
    '.work_selects_list .work_selects_item'
  )

  // Hide all items initially
  items.forEach((item) => {
    item.style.display = 'none'
  })

  // Show only the first 5 items
  for (let i = 0; i < Math.min(7, items.length); i++) {
    items[i].style.display = 'block'
  }
})

//Bakground Hero Cover Image Animation On Hover
document.addEventListener('DOMContentLoaded', () => {
  const workSelectsItems = document.querySelectorAll('.work_selects_item')
  const heroImageCover = document.querySelector('.hero_image-cover')

  if (!heroImageCover) {
    console.error('Hero image cover element not found')
    return
  }

  let lastHoveredImage = null

  workSelectsItems.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      const workCardImage = item.querySelector('.work_card_image-1')

      if (workCardImage) {
        const imageUrl = workCardImage.src
        if (imageUrl) {
          gsap.to(heroImageCover, {
            opacity: 0, // Fade out
            duration: 0.3,
            onComplete: () => {
              heroImageCover.style.backgroundImage = `url('${imageUrl}')`
              gsap.to(heroImageCover, {
                opacity: 1, // Fade in
                duration: 0.3,
              })
            },
          })
          lastHoveredImage = imageUrl
        }
      }
    })
  })

  // Set initial image to the second item on page load
  if (workSelectsItems.length > 1) {
    const secondItemImage =
      workSelectsItems[1].querySelector('.work_card_image-1')
    if (secondItemImage) {
      heroImageCover.style.backgroundImage = `url('${secondItemImage.src}')`
      gsap.set(heroImageCover, { opacity: 0.5 })
      lastHoveredImage = secondItemImage.src
    }
  }

  // Use lastHoveredImage to avoid the unused variable warning
  console.log('Initial hero image:', lastHoveredImage)
})

document.addEventListener('DOMContentLoaded', () => {
  const workItemButtons = document.querySelectorAll(
    '.work_filter-categories_button'
  )
  workItemButtons.forEach((button) => {
    button.addEventListener('click', function () {
      workItemButtons.forEach((btn) => btn.classList.remove('active-class'))
      this.classList.add('active-class')
    })
  })
})

document.addEventListener('DOMContentLoaded', () => {
  const workSelectsItems = document.querySelectorAll(
    '.work_selects_item.is-work'
  )

  workSelectsItems.forEach((item) => {
    item.addEventListener('mouseover', () => {
      const highlight = item.querySelector('.work_selects_item-highlight')
      if (highlight) {
        console.log(highlight)
        highlight.style.opacity = '0'
      }
    })

    item.addEventListener('mouseout', () => {
      const highlight = item.querySelector('.work_selects_item-highlight')
      if (highlight) {
        highlight.style.opacity = '0.5' // Adjust to your default opacity
      }
    })
  })
})

// animate sections of page-wrapper using GSAP
document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger)

  // Select all direct children divs of the page-wrapper and animate
  const sections = document.querySelectorAll('.page-wrapper > div')

  sections.forEach((section) => {
    gsap.from(section, {
      opacity: 0,
      y: 32,
      duration: 1,
      scrollTrigger: {
        trigger: section,
        start: 'top 80%', // Trigger animation when section is in the viewport
        end: 'bottom 60%', // End animation when section leaves the viewport
        toggleActions: 'play none none none', // Only play animation on scroll
      },
    })
  })
})

const pageWrapper = document.querySelector('page-wrapper')
gsap.set(pageWrapper, { opacity: 0 })
