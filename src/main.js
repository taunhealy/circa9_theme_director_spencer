import './styles/style.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import './menu'
import './layoutArray'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

document.addEventListener('DOMContentLoaded', function () {
  setupScrollUpFunctionality()
  setupModal()
  staggerAnimation()
  setupCategoryFiltering()
})

function setupScrollUpFunctionality() {
  const workScrollUpWrapper = document.querySelector('#scrollUpIcon')

  if (!workScrollUpWrapper) {
    console.log('No element with the ID "scrollUpIcon" found.')
    return
  }

  function trackScroll() {
    workScrollUpWrapper.classList.toggle(
      'show',
      window.scrollY > window.innerHeight
    )
  }

  function backToTop() {
    const startY = window.scrollY
    const duration = 500
    const startTime = performance.now()

    function animateScroll(timestamp) {
      const elapsed = timestamp - startTime
      const easeInOut = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)
      const newY = easeInOut(elapsed / duration) * (0 - startY) + startY

      window.scrollTo(0, newY)

      if (elapsed < duration) {
        requestAnimationFrame(animateScroll)
      }
    }

    requestAnimationFrame(animateScroll)
  }

  window.addEventListener('scroll', trackScroll)
  workScrollUpWrapper.addEventListener('click', backToTop)
}

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
  const workItems = document.querySelectorAll('.work_card')

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
        .querySelector('.work_card.is-active')
        ?.classList.remove('is-active')
      item.classList.add('is-active')
      openModal(item)
    })
  })

  function openModal(item) {
    const videoLink = item.dataset.videoLink
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
    tl.set(item.querySelector('.work_card-purple'), {
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
    let currentItem = document.querySelector('.work_card.is-active')
    let nextItem = currentItem.nextElementSibling
    if (!nextItem) {
      nextItem = workItems[0]
    }
    currentItem.classList.remove('is-active')
    nextItem.classList.add('is-active')
    openModal(nextItem)
  }

  function prevItem() {
    let currentItem = document.querySelector('.work_card.is-active')
    let prevItem = currentItem.previousElementSibling
    if (!prevItem) {
      prevItem = workItems[workItems.length - 1]
    }
    currentItem.classList.remove('is-active')
    prevItem.classList.add('is-active')
    openModal(prevItem)
  }
}

function staggerAnimation() {
  const wrapper = document.getElementById('page-wrapper')
  if (wrapper) {
    wrapper.style.display = 'flex'
    wrapper.style.opacity = '0'

    gsap.fromTo(
      wrapper, // Target element
      { opacity: 0, x: -35 }, // From properties
      {
        opacity: 1,
        x: 0,
        stagger: 0.25,
        duration: 0.55,
        ease: 'power2.out',
        delay: 0.25,
      } // To properties
    )

    const recentWorkWrapper = document.querySelector('.work_wrapper.is-recent')
    const otherWorkWrappers = document.querySelectorAll(
      '.work_wrapper:not(.is-recent)'
    )

    if (recentWorkWrapper) {
      gsap.from(recentWorkWrapper.children, {
        opacity: 0,
        y: 32,
        stagger: 0.45,
        duration: 0.45,
        ease: 'power3.out',
        delay: 0.25,
      })
    }

    if (otherWorkWrappers.length > 0) {
      gsap.from(otherWorkWrappers, {
        opacity: 0,
        y: 32,
        stagger: 0.45,
        duration: 0.45,
        ease: 'power2.out',
      })
    }
  } else {
    console.error('Element with ID "page-wrapper" not found.')
  }
}

// Filter and fade in work items
function setupCategoryFiltering() {
  const categoryButtons = document.querySelectorAll(
    '.work-filter_categories_item'
  )
  const workItems = document.querySelectorAll('.work_card')
  const recentWorkWrapper = document.querySelector('.work_wrapper.is-recent')

  function fadeInWorkItems(items) {
    if (items.length > 0) {
      gsap.fromTo(
        items,
        { opacity: 0, autoAlpha: 0.5 },
        {
          opacity: 1,
          autoAlpha: 1,
          duration: 0.5,
          stagger: 0.1,
        }
      )
    } else {
      console.warn('No items to animate.')
    }
  }

  function filterAndFadeInWorkItems(categoryName) {
    const visibleItems = []
    workItems.forEach((item) => {
      const category = item.getAttribute('data-work-category').trim()
      if (category === categoryName || categoryName === 'All') {
        item.style.display = 'block'
        visibleItems.push(item)
      } else {
        item.style.display = 'none'
      }
    })

    // If there are no visible items in the selected category, hide the .is-recent wrapper
    if (recentWorkWrapper) {
      const recentItems = recentWorkWrapper.querySelectorAll('.work_card')
      const hasVisibleRecentItems = Array.from(recentItems).some((item) => {
        const category = item.getAttribute('data-work-category').trim()
        return category === categoryName || categoryName === 'All'
      })

      recentWorkWrapper.style.display = hasVisibleRecentItems ? 'block' : 'none'
    }

    if (visibleItems.length > 0) {
      gsap.set(visibleItems, { opacity: 0 })
      fadeInWorkItems(visibleItems)
    }
  }

  categoryButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault()

      const categoryName = button.getAttribute('data-button-category').trim()

      filterAndFadeInWorkItems(categoryName)

      categoryButtons.forEach((btn) => {
        btn.classList.remove('active-category')
        Array.from(btn.children).forEach((child) => {
          child.classList.remove('active-category-child')
        })
      })

      button.classList.add('active-category')
      Array.from(button.children).forEach((child) => {
        child.classList.add('active-category-child')
      })
    })
  })
}
