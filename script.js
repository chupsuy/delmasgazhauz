document.addEventListener("DOMContentLoaded", function () {
  // Login Form Handling
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const emailInput = this.querySelector("input[type='email']");
      const email = emailInput ? emailInput.value : '';
      const username = email.split('@')[0]; // Extracts username from email

      const loginMessageElement = document.getElementById("loginMessage");
      if (loginMessageElement) {
        loginMessageElement.textContent = `Welcome back, ${username}!`;
        loginMessageElement.classList.add('text-green-600', 'font-semibold', 'mt-4'); // Add Tailwind classes for styling
      }
      localStorage.setItem("username", username);
      // 🔥 Crucial: Set a flag indicating login status
      localStorage.setItem("isLoggedIn", "true"); // Store a login flag

      this.reset();
      // Optional: Redirect to profile page after successful "login"
      // window.location.href = "profile.html";
    });
  }

  // Profile Name and Status Display
  const profileName = document.getElementById("profileName");
  const profileStatus = document.getElementById("profileStatus"); // Get the status span
  const loginPrompt = document.getElementById("loginPrompt"); // Get the login prompt paragraph
  const loginButtonDiv = document.getElementById("loginButtonDiv"); // Get the button div

  if (profileName && profileStatus) {
    const storedName = localStorage.getItem("username");
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; // Check the login flag

    if (isLoggedIn && storedName) {
      profileName.textContent = storedName;
      profileStatus.textContent = "Logged In"; // Set status to Logged In
      profileStatus.classList.remove('text-gray-600'); // Remove default gray
      profileStatus.classList.add('text-green-600'); // Add green for logged in

      if (loginPrompt) loginPrompt.style.display = 'none'; // Hide the login prompt
      if (loginButtonDiv) {
        loginButtonDiv.innerHTML = `
          <a href="#" id="logoutButton" class="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-md transform hover:scale-105 transition duration-300 ease-in-out ring-2 ring-red-400">Log Out</a>
        `;
        document.getElementById('logoutButton').addEventListener('click', function(e) {
          e.preventDefault();
          localStorage.removeItem("username");
          localStorage.removeItem("isLoggedIn"); // Clear the login flag
          alert("You have been logged out.");
          window.location.href = "index.html"; // Redirect to home page or login
        });
      }
    } else {
      profileName.textContent = "Guest"; // Default if not logged in
      profileStatus.textContent = "Not logged in"; // Ensure default text if not logged in
      profileStatus.classList.remove('text-green-600'); // Ensure green is removed
      profileStatus.classList.add('text-gray-600'); // Ensure gray is added

      if (loginPrompt) loginPrompt.style.display = 'block'; // Show the login prompt
      if (loginButtonDiv) {
         loginButtonDiv.innerHTML = `
            <a href="login.html" class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-md transform hover:scale-105 transition duration-300 ease-in-out ring-2 ring-blue-400">Go to Log In</a>
         `;
      }
    }
  }

  // Contact Form Handling (on index.html)
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const nameInput = this.querySelector("#contactName");
      const name = nameInput ? nameInput.value : 'Guest';

      const confirmationElement = document.getElementById("contactMessageConfirmation");
      if (confirmationElement) {
        confirmationElement.textContent = `Thank you, ${name}! Your message has been sent. We will get back to you shortly.`;
        confirmationElement.classList.add('text-green-600', 'font-semibold', 'mt-4'); // Add Tailwind classes for styling
      }
      this.reset();
    });
  }

  // Product Sorting Logic (from products_html_v2)
  const sortBySelect = document.getElementById('sort-by');
  const productList = document.getElementById('product-list');

  if (sortBySelect && productList) {
    sortBySelect.addEventListener('change', function() {
      const sortValue = this.value;
      const products = Array.from(productList.children);

      products.sort((a, b) => {
        const nameA = a.dataset.name.toUpperCase();
        const nameB = b.dataset.name.toUpperCase();

        if (sortValue === 'name-asc') {
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        } else if (sortValue === 'name-desc') {
          if (nameA > nameB) return -1;
          if (nameA < nameB) return 1;
          return 0;
        }
        return 0;
      });

      products.forEach(product => productList.appendChild(product));
    });
  }

  // Integrated Order Form & Product Detail Logic (for products.html)
  const allProductsContainer = document.getElementById('allProductsContainer'); // Reference to the full product grid container
  const splitScreenContainer = document.getElementById('splitScreenContainer'); // Reference to the split-screen container

  const selectedProductView = document.getElementById('selectedProductView');
  const orderFormContainer = document.getElementById('orderFormContainer');
  const selectProductBtns = document.querySelectorAll('.select-product-btn');
  const integratedOrderForm = document.getElementById('integratedOrderForm');
  const orderFormProductNameSelect = document.getElementById('orderFormProductName');
  const orderFormConfirmation = document.getElementById('orderFormConfirmation');
  const closeOrderFormBtn = document.getElementById('closeOrderFormBtn');
  const backToProductsBtn = document.getElementById('backToProductsBtn');

  const selectedProductImage = document.getElementById('selectedProductImage');
  const selectedProductTitle = document.getElementById('selectedProductTitle');
  const selectedProductDescription = document.getElementById('selectedProductDescription');
  const selectedProductFeatures = document.getElementById('selectedProductFeatures');

  // Function to show the product list and hide the detail/order form
  function showAllProductsView() {
    if (allProductsContainer) { // Ensure element exists
        allProductsContainer.classList.remove('section-hidden');
        allProductsContainer.classList.add('section-visible');
    }

    if (splitScreenContainer) { // Ensure element exists
        splitScreenContainer.classList.remove('section-visible');
        splitScreenContainer.classList.add('section-hidden');
    }

    // Reset form and confirmation message
    if (integratedOrderForm) {
        integratedOrderForm.reset();
    }
    if (orderFormConfirmation) {
        orderFormConfirmation.textContent = '';
    }
    if (orderFormProductNameSelect) {
        orderFormProductNameSelect.value = "";
    }
  }

  // Function to show the selected product detail and order form
  function showSelectedProductView(productData) {
    // Populate selected product details
    if (selectedProductImage) {
        selectedProductImage.src = productData.image;
        selectedProductImage.alt = productData.name;
    }
    if (selectedProductTitle) {
        selectedProductTitle.textContent = productData.name;
    }
    if (selectedProductDescription) {
        selectedProductDescription.textContent = productData.description;
    }

    if (selectedProductFeatures) {
        selectedProductFeatures.innerHTML = ''; // Clear previous features
        // Ensure productData.features is parsed only if it's a string
        const featuresArray = typeof productData.features === 'string' ? JSON.parse(productData.features) : productData.features;
        featuresArray.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            selectedProductFeatures.appendChild(li);
        });
    }

    // Set the product in the order form dropdown
    if (orderFormProductNameSelect) {
        orderFormProductNameSelect.value = productData.name;
    }
    if (orderFormConfirmation) {
        orderFormConfirmation.textContent = ''; // Clear previous confirmation
    }

    // Hide all products view
    if (allProductsContainer) {
        allProductsContainer.classList.remove('section-visible');
        allProductsContainer.classList.add('section-hidden');
    }

    // Show split screen view
    if (splitScreenContainer) {
        splitScreenContainer.classList.remove('section-hidden');
        splitScreenContainer.classList.add('section-visible');
    }

    // Scroll to the top of the section or the selected product view
    if (selectedProductView) {
        selectedProductView.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Event listeners for "Select for Order" buttons
  if (selectProductBtns.length > 0) {
    selectProductBtns.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const productItem = this.closest('.product-item');
        const productData = {
          name: productItem.dataset.name,
          image: productItem.dataset.image,
          description: productItem.dataset.description,
          features: productItem.dataset.features
        };
        showSelectedProductView(productData);
      });
    });
  }

  // Event listener for "Back to All Products" button
  if (backToProductsBtn) {
    backToProductsBtn.addEventListener('click', showAllProductsView);
  }

  // Handle form submission
  if (integratedOrderForm) {
    integratedOrderForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const customerName = document.getElementById('orderFormName').value;
      const orderedProduct = orderFormProductNameSelect.value;

      if (orderFormConfirmation) {
        orderFormConfirmation.textContent = `Thank you, ${customerName}! Your order for ${orderedProduct} has been placed.`;
        orderFormConfirmation.classList.add('text-green-600', 'font-semibold', 'mt-4');
      }

      setTimeout(() => {
        if (integratedOrderForm) integratedOrderForm.reset();
        if (orderFormConfirmation) orderFormConfirmation.textContent = '';
        if (orderFormProductNameSelect) orderFormProductNameSelect.value = "";
        showAllProductsView(); // Return to all products view after successful order
      }, 3000);
    });
  }

  // Handle close button click on the order form
  if (closeOrderFormBtn) {
    closeOrderFormBtn.addEventListener('click', showAllProductsView);
  }

  // Initialize view on page load (for products.html only)
  // This needs to be conditional if script.js is used on other pages
  // Assuming this block is specifically for products.html functionality.
  // If not, you might want to wrap this in an if (products.html) check.
  if (allProductsContainer || splitScreenContainer) { // Check if these elements exist
      showAllProductsView();
  }
});