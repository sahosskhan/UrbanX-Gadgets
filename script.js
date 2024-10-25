const loadPhone = async (searchText, isShowAll = false) => {
    if (!searchText) return; // Do nothing if searchText is empty

    toggleLoadingSpinner(true); // Show loading spinner while fetching phones

    const res = await fetch(`https://openapi.programming-hero.com/api/phones?search=${searchText}`);
    const data = await res.json();
    const phones = data.data;

    displayPhones(phones, isShowAll);
}

const displayPhones = (phones, isShowAll) => {
    const phoneContainer = document.getElementById('phone-container');
    const noResultMessage = document.getElementById('no-result-message');
    const showAllContainer = document.getElementById('show-all-container');

    phoneContainer.textContent = ''; // Clear the container

    toggleLoadingSpinner(false); // Hide loading spinner

    // Show or hide "no result" message
    if (phones.length === 0) {
        noResultMessage.classList.remove('hidden'); // Show message if no phones found
        showAllContainer.classList.add('hidden');   // Hide "Show All" button if no results
        return; // Exit if no phones to display
    } else {
        noResultMessage.classList.add('hidden'); // Hide message if phones found
    }

    if (phones.length > 6 && !isShowAll) {
        showAllContainer.classList.remove('hidden'); // Show "Show All" button if more than 6 phones
    } else {
        showAllContainer.classList.add('hidden'); // Hide "Show All" button if less than or equal to 6 phones
    }

    if (!isShowAll) {
        phones = phones.slice(0, 6); // Display only 6 phones unless "Show All" is clicked
    }

    phones.forEach(phone => {
        const phoneCard = document.createElement('div');
        phoneCard.classList = `card bg-gray-100 px-0 py-6 mt-10`;
        phoneCard.innerHTML = `
            <figure><img src="${phone.image}" alt="Phone" /></figure>
            <div class="card-body">
                <h2 class="card-title">${phone.phone_name}</h2>
                <p>Click the button to see more details about this phone.</p>
                <div class="card-actions justify-center">
                    <button onclick="handleShowDetail('${phone.slug}')" class="btn btn-primary">Show Details</button>
                </div>
            </div>
        `;
        phoneContainer.appendChild(phoneCard);
    });
}

const handleShowDetail = async (slug) => {
    // Load single phone data based on its slug
    const res = await fetch(`https://openapi.programming-hero.com/api/phone/${slug}`);
    const data = await res.json();
    const phone = data.data;
    showPhoneDetails(phone);
}

const showPhoneDetails = (phone) => {
    const phoneName = document.getElementById('show-detail-phone-name');
    const showDetailContainer = document.getElementById('show-detail-container');

    // Check if the elements exist
    if (!phoneName || !showDetailContainer) {
        console.error("Required elements not found in the DOM.");
        return; // Early exit if elements are not found
    }

    // Set phone details in the modal
    phoneName.innerText = phone.name || 'Unknown Phone';
    showDetailContainer.innerHTML = `
        <img src="${phone.image}" alt="Phone" class="w-full h-auto" />
        <p><strong>Storage:</strong> ${phone?.mainFeatures?.storage || 'Not available'}</p>
        <p><strong>Chipset:</strong> ${phone?.mainFeatures?.chipSet || 'Not available'}</p>
        <p><strong>Memory:</strong> ${phone?.mainFeatures?.memory || 'Not available'}</p>
        <p><strong>Sensors:</strong> ${phone?.mainFeatures?.sensors?.join(', ') || 'Not available'}</p>
        <p><strong>GPS:</strong> ${phone?.others?.GPS || 'Not available'}</p>
    `;

    // Open the modal
    const showDetailsModal = document.getElementById('show_details_modal');
    showDetailsModal.showModal();
}

const handleSearch = (isShowAll = false) => {
    const searchField = document.getElementById('search-field');
    const searchText = searchField.value.trim();

    // Only trigger phone search if the input is not empty
    if (searchText.length > 0) {
        loadPhone(searchText, isShowAll);
    } else {
        // Clear the phone container if the search is empty
        document.getElementById('phone-container').textContent = '';
        document.getElementById('no-result-message').classList.add('hidden'); // Hide "No result" message
        document.getElementById('show-all-container').classList.add('hidden'); // Hide "Show All" button
        toggleLoadingSpinner(false); // Hide spinner
    }
}

const handleShowAll = () => {
    // Trigger search but this time show all results
    handleSearch(true);  // Pass `true` to show all phones for the current search text
}

const toggleLoadingSpinner = (isLoading) => {
    const loadingSpinner = document.getElementById('loading-spinner');
    if (isLoading) {
        loadingSpinner.classList.remove('hidden');
    } else {
        loadingSpinner.classList.add('hidden');
    }
}

const carouselImages = [
    'https://i.ibb.co/KcPWLXy/image.png',
    'https://i.ibb.co/g73qw4V/image.png',
    'https://i.ibb.co/1fWBZ85/image.png',
    'https://i.ibb.co/0YZfMcX/image.png',
    'https://i.ibb.co/3SzMywL/image.png'
  ];
  
  let currentSlider = 0;
  const carouselContainer = document.getElementById('carouselContainer');
  const carouselDots = document.getElementById('carouselDots');
  
  function renderDots() {
    carouselDots.innerHTML = carouselImages.map((img, idx) => `
      <button onclick="goToSlider(${idx})" class="rounded-full duration-500 bg-white ${currentSlider === idx ? 'w-8' : 'w-2'} h-2"></button>
    `).join('');
  }
  
  function goToSlider(index) {
    currentSlider = index;
    updateSlider();
  }
  
  function prevSlider() {
    currentSlider = currentSlider === 0 ? carouselImages.length - 1 : currentSlider - 1;
    updateSlider();
  }
  
  function nextSlider() {
    currentSlider = currentSlider === carouselImages.length - 1 ? 0 : currentSlider + 1;
    updateSlider();
  }
  
  function updateSlider() {
    carouselContainer.style.transform = `translateX(-${currentSlider * 100}%)`;
    renderDots();
  }

  // Initialize dots and set up interval for automatic sliding
  renderDots();
  setInterval(nextSlider, 3000);

  document.getElementById('prevSlider').addEventListener('click', prevSlider);
  document.getElementById('nextSlider').addEventListener('click', nextSlider);