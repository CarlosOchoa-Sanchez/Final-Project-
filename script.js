"use strict";

document.addEventListener("DOMContentLoaded", function () {
  
  // Light / Dark Theme Toggle
  
  var toggleBtn = document.getElementById("theme-toggle");

  if (toggleBtn) {
    toggleBtn.addEventListener("click", function () {
      document.body.classList.toggle("dark");
      var isDark = document.body.classList.contains("dark");
      toggleBtn.setAttribute("aria-pressed", String(isDark));
    });
  }

  
  // Itinerary Tabs
  
  var tabList = document.querySelector(".itinerary-tabs");
  if (tabList) {
    var tabButtons = tabList.querySelectorAll("button");
    var panels = document.querySelectorAll(".itinerary-content article");

    function showPanel(id) {
      var i;
      for (i = 0; i < panels.length; i++) {
        if (panels[i].id === id) {
          panels[i].hidden = false;
        } else {
          panels[i].hidden = true;
        }
      }
    }

    function setSelectedTab(activeButton) {
      var i;
      for (i = 0; i < tabButtons.length; i++) {
        var selected = tabButtons[i] === activeButton;
        tabButtons[i].setAttribute("aria-selected", String(selected));
      }
    }

    var j;
    for (j = 0; j < tabButtons.length; j++) {
      tabButtons[j].addEventListener("click", function () {
        var targetId = this.getAttribute("aria-controls");
        setSelectedTab(this);
        if (targetId) {
          showPanel(targetId);
        }
      });
    }

    // Show Day 1 by default
    showPanel("day1");
    if (tabButtons.length > 0) {
      setSelectedTab(tabButtons[0]);
    }
  }

  
  // Contact Form Handling
  
  var form = document.getElementById("contact-form");
  if (form) {
    var fullNameInput = document.getElementById("full-name");
    var phoneInput = document.getElementById("phone");
    var emailInput = document.getElementById("email");
    var commentsInput = document.getElementById("comments");
    var successBox = document.getElementById("form-success");
    var contactFieldset = form.querySelector("fieldset.form-row");

    function clearErrors() {
      var errorSpans = form.querySelectorAll(".error-message");
      var i;
      for (i = 0; i < errorSpans.length; i++) {
        errorSpans[i].textContent = "";
      }
      if (successBox) {
        successBox.textContent = "";
      }
    }

    function setErrorForInput(inputElement, message) {
      if (!inputElement) return;
      var container = inputElement.parentElement;
      if (!container) return;
      var errorSpan = container.querySelector(".error-message");
      if (errorSpan) {
        errorSpan.textContent = message;
      }
    }

    function setErrorForContactMethod(message) {
      if (!contactFieldset) return;
      var errorSpan = contactFieldset.querySelector(".error-message");
      if (errorSpan) {
        errorSpan.textContent = message;
      }
    }

    function validateEmail(value) {
      var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return pattern.test(value.trim());
    }

    function validatePhone(value) {
      var digits = value.replace(/\D/g, "");
      return digits.length === 10;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      clearErrors();

      var fullName = fullNameInput.value.trim();
      var phone = phoneInput.value.trim();
      var email = emailInput.value.trim();
      var comments = commentsInput.value.trim();
      var hasErrors = false;

      // Required name
      if (!fullName) {
        hasErrors = true;
        setErrorForInput(fullNameInput, "Please enter your full name.");
      }

      // Required comments
      if (!comments) {
        hasErrors = true;
        setErrorForInput(
          commentsInput,
          "Please tell us a little about your trip or question."
        );
      }

      // Contact method
      var contactMethod = form.querySelector("input[name='contactMethod']:checked");
      if (!contactMethod) {
        hasErrors = true;
        setErrorForContactMethod("Please choose how you’d like to be contacted.");
      }

      // Conditional phone/email
      if (contactMethod) {
        var methodValue = contactMethod.value;

        if (methodValue === "phone") {
          if (!phone) {
            hasErrors = true;
            setErrorForInput(
              phoneInput,
              "Please enter a phone number so we can call you."
            );
          } else if (!validatePhone(phone)) {
            hasErrors = true;
            setErrorForInput(
              phoneInput,
              "Please enter a valid 10-digit phone number (digits only)."
            );
          }
        }

        if (methodValue === "email") {
          if (!email) {
            hasErrors = true;
            setErrorForInput(
              emailInput,
              "Please enter an email address so we can write back."
            );
          } else if (!validateEmail(email)) {
            hasErrors = true;
            setErrorForInput(
              emailInput,
              "Please enter a valid email address (example@domain.com)."
            );
          }
        }
      }

      if (hasErrors) {
        return;
      }

      // Customer object
      var customer = {
        name: fullName,
        phone: phone || null,
        email: email || null,
        preferredContact: contactMethod ? contactMethod.value : null,
        comments: comments
      };

      form.reset();

      if (successBox) {
        var contactText;

        if (customer.preferredContact === "phone" && customer.phone) {
          contactText = "We’ll reach out by phone at " + customer.phone + ".";
        } else if (customer.preferredContact === "email" && customer.email) {
          contactText = "We’ll send you an email at " + customer.email + ".";
        } else {
          contactText = "We’ll get back to you soon.";
        }

        successBox.innerHTML =
          "Thank you, <strong>" +
          customer.name +
          "</strong>!<br>" +
          "We’ve received your message: " +
          '<em>“' +
          customer.comments +
          '”</em><br>' +
          contactText;
      }

      
    });
  }

  
  // Product Display / Stays
  
  var stayButtons = document.querySelectorAll(".stay-btn");
  var stayName = document.getElementById("stay-name");
  var stayImage = document.getElementById("stay-image");
  var stayDescription = document.getElementById("stay-description");

  if (stayButtons.length && stayName && stayImage && stayDescription) {
    var stays = [
      {
        id: "asheville-loft",
        name: "Downtown Asheville Loft",
        image: "images/AshevilleLoft.jpg",
        alt: "Cozy loft overlooking downtown Asheville at night",
        description:
          "Stay steps away from Asheville’s restaurants, shops, and live music. Ideal if you want to explore the city on foot and take short drives to the Blue Ridge Parkway."
      },
      {
        id: "parkway-cabin",
        name: "Blue Ridge Parkway Cabin",
        image: "images/BlueRidgeCabin.jpg",
        alt: "Cabin porch overlooking the Blue Ridge Mountains",
        description:
          "Escape to a quiet cabin a short drive from the Parkway. Wake up to mountain views, enjoy coffee on the porch, and end the day with a sunset over the ridges."
      },
      {
        id: "lake-lure-retreat",
        name: "Lake Lure Mountain Retreat",
        image: "images/LakeLurePlace.jpeg",
        alt: "Lake and surrounding mountains near Lake Lure in North Carolina",
        description:
          "Combine mountain views with lakeside time at Lake Lure, within driving distance of hiking trails and Chimney Rock."
      }
    ];

    function showStay(id) {
      var i;
      for (i = 0; i < stays.length; i++) {
        if (stays[i].id === id) {
          stayName.textContent = stays[i].name;
          stayImage.src = stays[i].image;
          stayImage.alt = stays[i].alt;
          stayDescription.textContent = stays[i].description;
          break;
        }
      }
    }

    function clearActiveButtons() {
      var i;
      for (i = 0; i < stayButtons.length; i++) {
        stayButtons[i].classList.remove("active-stay");
      }
    }

    var k;
    for (k = 0; k < stayButtons.length; k++) {
      stayButtons[k].addEventListener("click", function () {
        var id = this.getAttribute("data-stay-id");
        showStay(id);
        clearActiveButtons();
        this.classList.add("active-stay");
      });
    }

    
    showStay("asheville-loft");
    stayButtons[0].classList.add("active-stay");
  }

  
  // Blue Ridge Overlook Game
  
  var gameForm = document.getElementById("game-form");
  var resultBox = document.getElementById("game-result");

  if (gameForm && resultBox) {
    gameForm.addEventListener("submit", function (event) {
      event.preventDefault();

      var guessInput = document.getElementById("guess");
      var guessValue = Number(guessInput.value);

      if (!guessValue || guessValue < 1 || guessValue > 10) {
        resultBox.textContent =
          "Please enter a whole number between 1 and 10 for your overlook.";
        return;
      }

      var randomNumber = Math.floor(Math.random() * 10) + 1;

      if (guessValue === randomNumber) {
        resultBox.textContent =
          "You chose overlook " +
          guessValue +
          " and the ranger chose overlook " +
          randomNumber +
          ". Perfect match! Enjoy that sunset spot.";
      } else {
        resultBox.textContent =
          "You chose overlook " +
          guessValue +
          ", but the ranger picked overlook " +
          randomNumber +
          ". Still a great view—try again!";
      }

      guessInput.value = "";
    });
  }
});