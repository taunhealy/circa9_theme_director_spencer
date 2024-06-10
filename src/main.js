// Import GSAP for animations
import gsap from 'gsap'
import './styles/style.css'

// Function to handle modal functionality
function setupModal() {
  const modal = document.querySelector('.modal_container')
  const closeButton = document.querySelector('.modal_close_button')
  const nextButton = document.querySelector('.next_button')
  const prevButton = document.querySelector('.prev_button')
  const modalVideo = document.querySelector('#modalVideo')
  const modalImage = document.querySelector('.modal_image')
  const spinner = document.querySelector('#spinner')
  const workItems = document.querySelectorAll('.work_card')

  function openModal(item) {
    const videoLink = item.dataset.videoLink
    const imageSrc = item.querySelector('img').src
    const brand = item.querySelector('.work_brand').textContent
    const title = item.querySelector('.work_title').textContent
    const directorName = item.querySelector(
      '.director-name_heading'
    ).textContent

    modal.querySelector('.modal_brand').textContent = brand
    modal.querySelector('.modal_title').textContent = title
    modal.querySelector('.modal-director_heading').textContent = directorName

    if (videoLink) {
      spinner.style.display = 'block'
      modalVideo.style.display = 'block'
      modalImage.style.display = 'none'

      const iframe = document.createElement('iframe')
      iframe.src = videoLink
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
    } else {
      modalVideo.style.display = 'none'
      modalImage.style.display = 'block'
      modalImage.src = imageSrc
    }

    modal.style.display = 'block'
  }

  function closeModal() {
    modal.style.display = 'none'
    modalVideo.innerHTML = ''
  }

  function nextItem() {
    let currentItem = document.querySelector('.work_card.is-active')
    let nextItem = currentItem.nextElementSibling
    if (!nextItem) {
      nextItem = workItems[0]
    }
    openModal(nextItem)
  }

  function prevItem() {
    let currentItem = document.querySelector('.work_card.is-active')
    let prevItem = currentItem.previousElementSibling
    if (!prevItem) {
      prevItem = workItems[workItems.length - 1]
    }
    openModal(prevItem)
  }

  workItems.forEach((item) => {
    item.addEventListener('click', () => {
      openModal(item)
      document
        .querySelector('.work_card.is-active')
        ?.classList.remove('is-active')
      item.classList.add('is-active')
    })
  })

  closeButton.addEventListener('click', closeModal)
  nextButton.addEventListener('click', nextItem)
  prevButton.addEventListener('click', prevItem)
}

// Initialize the modal functionality
setupModal()

// Filter and fade in work items
document.addEventListener('DOMContentLoaded', function () {
  const categoryButtons = document.querySelectorAll(
    '.work-filter_categories_item'
  )
  const workItems = document.querySelectorAll('.work_card')
  const offset = 90 // Adjust this value as needed

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
        item.style.display = 'block' // Display the item
        visibleItems.push(item)
      } else {
        item.style.display = 'none' // Hide the item
      }
    })

    // Get the top position of the container before filtering
    const containerTop =
      document.querySelector('.work_section').getBoundingClientRect().top +
      window.scrollY -
      offset

    if (visibleItems.length > 0) {
      gsap.set(visibleItems, { opacity: 0 }) // Set initial opacity
      fadeInWorkItems(visibleItems)
    }

    // Scroll to maintain the position of the container with an offset
    window.scrollTo({ top: containerTop, behavior: 'smooth' })
  }

  categoryButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault()

      const categoryName = button.getAttribute('data-button-category').trim()

      // Filter and fade in work items based on the selected category
      filterAndFadeInWorkItems(categoryName)

      // Reset styles of all category buttons
      categoryButtons.forEach((btn) => {
        btn.classList.remove('active-category')
      })

      // Set styles for the clicked category button
      button.classList.add('active-category')
    })
  })
})
