/* =========================================================
   MAJLIS BERTAUT KASIH 2026
   SCRIPT.JS — VERSION 6 MASTER
========================================================= */

/* =========================================================
   01 — CONFIGURATION
========================================================= */

/*
    URL deployment Apps Script terkini.
    Pastikan URL berakhir dengan /exec
*/

const RSVP_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyi_H79qLVBBwQhEwHA98W-esEJL-u9vmqZoOxnTIm58G0s-JmcI8QI-EFESeX3GB3pug/exec";

/*
    Tarikh sasaran countdown:
    26 September 2026, 12.30 tengah hari, Malaysia
*/

const WEDDING_DATE = new Date("2026-09-26T12:30:00+08:00").getTime();

/* =========================================================
   02 — ELEMENT REFERENCES
========================================================= */

/* Loading */

const loadingScreen = document.getElementById("loading-screen");

/* Main website */

const mainContent = document.getElementById("main-content");

const siteDecor = document.getElementById("siteDecor");

/* Opening */

const opening = document.getElementById("opening");

const envelopeStage = document.getElementById("envelopeStage");

const waxSeal = document.getElementById("waxSeal");

const tapText = document.getElementById("tapText");

/* Hero */

const hero = document.getElementById("hero");

const heroScroll = document.getElementById("heroScroll");

const invitationSection = document.getElementById("invitation");

/* Audio */

const waxSound = document.getElementById("waxSound");

const chimeSound = document.getElementById("chimeSound");

const bgMusic = document.getElementById("bgMusic");

/* Countdown */

const countdownDays = document.getElementById("countdownDays");

const countdownHours = document.getElementById("countdownHours");

const countdownMinutes = document.getElementById("countdownMinutes");

const countdownSeconds = document.getElementById("countdownSeconds");

const countdownMessage = document.getElementById("countdownMessage");

/* RSVP */

const rsvpForm = document.getElementById("rsvpForm");

const rsvpSubmit = document.getElementById("rsvpSubmit");

const rsvpError = document.getElementById("rsvpFormError");

const attendanceCountField = document.getElementById("attendanceCountField");

const rsvpCount = document.getElementById("rsvpCount");

const rsvpModal = document.getElementById("rsvpModal");

const rsvpModalTitle = document.getElementById("rsvpModalTitle");

const rsvpModalMessage = document.getElementById("rsvpModalMessage");

const rsvpModalClose = document.getElementById("rsvpModalClose");

/* =========================================================
   03 — STATE
========================================================= */

let invitationOpened = false;

let musicFadeTimer = null;

/* =========================================================
   04 — GENERAL HELPERS
========================================================= */

function wait(milliseconds) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

function playAudio(audioElement, volume = 1) {
  if (!audioElement) {
    return;
  }

  audioElement.currentTime = 0;
  audioElement.volume = volume;

  audioElement.play().catch(() => {
    /*
                Browser mungkin menolak audio jika belum
                menerima interaksi pengguna. Tidak perlu
                paparkan error kepada tetamu.
            */
  });
}

function fadeInBackgroundMusic() {
  if (!bgMusic) {
    return;
  }

  if (musicFadeTimer) {
    window.clearInterval(musicFadeTimer);
  }

  bgMusic.volume = 0;

  bgMusic.play().catch(() => {});

  let currentVolume = 0;

  musicFadeTimer = window.setInterval(() => {
    currentVolume += 0.025;

    if (currentVolume >= 0.35) {
      currentVolume = 0.35;

      window.clearInterval(musicFadeTimer);

      musicFadeTimer = null;
    }

    bgMusic.volume = currentVolume;
  }, 120);
}

/* =========================================================
   05 — LOADING SCREEN
========================================================= */

window.addEventListener("load", async () => {
  await wait(800);

  if (loadingScreen) {
    loadingScreen.classList.add("loading-hide");

    await wait(700);

    loadingScreen.style.display = "none";
  }
});

/* =========================================================
   06 — OPEN INVITATION
========================================================= */

async function openInvitation() {
  if (invitationOpened) {
    return;
  }

  invitationOpened = true;

  /* Hilangkan arahan tekan */

  if (tapText) {
    tapText.classList.add("hide");
  }

  /* Bunyi wax */

  playAudio(waxSound, 0.85);

  /* Getaran telefon */

  if ("vibrate" in navigator) {
    navigator.vibrate(60);
  }

  /* Wax hilang */

  if (envelopeStage) {
    envelopeStage.classList.add("opening-active");
  }

  await wait(420);

  /* Sampul fade keluar */

  if (envelopeStage) {
    envelopeStage.classList.add("opening-exit");
  }

  /* Kandungan utama muncul */

  if (mainContent) {
    mainContent.classList.add("show");
  }

  if (siteDecor) {
    siteDecor.classList.add("show");
  }

  if (hero) {
    hero.classList.add("show");
  }

  /* Bunyi pembukaan */

  playAudio(chimeSound, 0.45);

  await wait(220);

  /* Animasi Hero */

  if (hero) {
    hero.classList.add("hero-ready");
  }

  /* Muzik latar */

  fadeInBackgroundMusic();

  await wait(850);

  /* Buang opening sepenuhnya */

  if (opening) {
    opening.classList.add("hide");

    opening.style.display = "none";
  }

  /* Benarkan halaman discroll */

  document.body.classList.add("site-ready");

  /* Menu hanya muncul selepas envelope selesai dibuka */
  showBottomNav();
}

/* Wax click + keyboard */

if (waxSeal) {
  waxSeal.addEventListener("click", openInvitation);

  waxSeal.setAttribute("tabindex", "0");

  waxSeal.setAttribute("role", "button");

  waxSeal.setAttribute("aria-label", "Tekan untuk membuka jemputan");

  waxSeal.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();

      openInvitation();
    }
  });
}

/* =========================================================
   07 — HERO SCROLL BUTTON
========================================================= */

if (heroScroll && invitationSection) {
  heroScroll.addEventListener("click", () => {
    invitationSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}

/* =========================================================
   08 — COUNTDOWN
========================================================= */

function animateCountdownNumber(element) {
  if (!element || typeof element.animate !== "function") {
    return;
  }

  element.animate(
    [
      {
        transform: "scale(1.14)",
        opacity: 0.65,
      },

      {
        transform: "scale(1)",
        opacity: 1,
      },
    ],

    {
      duration: 220,
      easing: "ease-out",
    },
  );
}

function updateCountdown() {
  if (
    !countdownDays ||
    !countdownHours ||
    !countdownMinutes ||
    !countdownSeconds
  ) {
    return;
  }

  const distance = WEDDING_DATE - Date.now();

  /* Majlis sudah bermula */

  if (distance <= 0) {
    countdownDays.textContent = "00";

    countdownHours.textContent = "00";

    countdownMinutes.textContent = "00";

    countdownSeconds.textContent = "00";

    if (countdownMessage) {
      countdownMessage.textContent = "Selamat Pengantin Baru ❤️";
    }

    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));

  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );

  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  const nextDays = String(days).padStart(2, "0");

  const nextHours = String(hours).padStart(2, "0");

  const nextMinutes = String(minutes).padStart(2, "0");

  const nextSeconds = String(seconds).padStart(2, "0");

  if (countdownDays.textContent !== nextDays) {
    animateCountdownNumber(countdownDays);
  }

  if (countdownHours.textContent !== nextHours) {
    animateCountdownNumber(countdownHours);
  }

  if (countdownMinutes.textContent !== nextMinutes) {
    animateCountdownNumber(countdownMinutes);
  }

  animateCountdownNumber(countdownSeconds);

  countdownDays.textContent = nextDays;

  countdownHours.textContent = nextHours;

  countdownMinutes.textContent = nextMinutes;

  countdownSeconds.textContent = nextSeconds;
}

updateCountdown();

window.setInterval(updateCountdown, 1000);

/* =========================================================
   09 — CONTENT CARD REVEAL
========================================================= */

const contentCards = document.querySelectorAll(".content-card");

if ("IntersectionObserver" in window) {
  const cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("card-visible");

          cardObserver.unobserve(entry.target);
        }
      });
    },

    {
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  contentCards.forEach((card) => {
    cardObserver.observe(card);
  });
} else {
  contentCards.forEach((card) => {
    card.classList.add("card-visible");
  });
}

/* =========================================================
   10 — TIMELINE REVEAL
========================================================= */

const timelineItems = document.querySelectorAll(".timeline-item");

if ("IntersectionObserver" in window) {
  const timelineObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("timeline-visible");

          timelineObserver.unobserve(entry.target);
        }
      });
    },

    {
      threshold: 0.25,
    },
  );

  timelineItems.forEach((item) => {
    timelineObserver.observe(item);
  });
} else {
  timelineItems.forEach((item) => {
    item.classList.add("timeline-visible");
  });
}

/* =========================================================
   11 — RSVP HELPERS
========================================================= */

function getSelectedRsvpStatus() {
  const selectedStatus = document.querySelector('input[name="status"]:checked');

  return selectedStatus ? selectedStatus.value : "";
}

function updateAttendanceField() {
  if (!attendanceCountField || !rsvpCount) {
    return;
  }

  const status = getSelectedRsvpStatus();

  if (status === "Tidak Dapat Hadir") {
    attendanceCountField.classList.add("rsvp-field-hidden");

    rsvpCount.disabled = true;
  } else {
    attendanceCountField.classList.remove("rsvp-field-hidden");

    rsvpCount.disabled = false;
  }
}

function setRsvpLoading(isLoading) {
  if (!rsvpSubmit) {
    return;
  }

  rsvpSubmit.disabled = isLoading;

  rsvpSubmit.classList.toggle("is-loading", isLoading);
}

function showRsvpModal(title, message) {
  if (!rsvpModal || !rsvpModalTitle || !rsvpModalMessage) {
    return;
  }

  rsvpModalTitle.textContent = title;

  rsvpModalMessage.textContent = message;

  rsvpModal.classList.add("show");

  rsvpModal.setAttribute("aria-hidden", "false");

  document.body.style.overflow = "hidden";

  if (rsvpModalClose) {
    rsvpModalClose.focus();
  }
}

function closeRsvpModal() {
  if (!rsvpModal) {
    return;
  }

  rsvpModal.classList.remove("show");

  rsvpModal.setAttribute("aria-hidden", "true");

  document.body.style.overflow = "";
}

/* Status hadir / tidak hadir */

const rsvpStatusInputs = document.querySelectorAll('input[name="status"]');

rsvpStatusInputs.forEach((input) => {
  input.addEventListener("change", updateAttendanceField);
});

updateAttendanceField();

/* Tutup modal */

if (rsvpModalClose) {
  rsvpModalClose.addEventListener("click", closeRsvpModal);
}

if (rsvpModal) {
  rsvpModal.addEventListener("click", (event) => {
    if (event.target === rsvpModal) {
      closeRsvpModal();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    rsvpModal &&
    rsvpModal.classList.contains("show")
  ) {
    closeRsvpModal();
  }
});

/* =========================================================
   12 — RSVP SUBMISSION
========================================================= */

if (rsvpForm) {
  rsvpForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (rsvpError) {
      rsvpError.textContent = "";
    }

    const nameInput = document.getElementById("rsvpName");

    const categoryInput = document.getElementById("rsvpCategory");

    const messageInput = document.getElementById("rsvpMessage");

    const nama = nameInput ? nameInput.value.trim() : "";

    const kategori = categoryInput ? categoryInput.value : "";

    const status = getSelectedRsvpStatus();

    const ucapan = messageInput ? messageInput.value.trim() : "";

    /* Validation nama */

    if (!nama) {
      if (rsvpError) {
        rsvpError.textContent = "Sila masukkan nama penuh anda.";
      }

      if (nameInput) {
        nameInput.focus();
      }

      return;
    }

    /* Validation kategori */

    if (!kategori) {
      if (rsvpError) {
        rsvpError.textContent = "Sila pilih kategori jemputan.";
      }

      if (categoryInput) {
        categoryInput.focus();
      }

      return;
    }

    /* Validation status */

    if (!status) {
      if (rsvpError) {
        rsvpError.textContent = "Sila pilih status kehadiran.";
      }

      return;
    }

    /* Validation URL */

    if (!RSVP_SCRIPT_URL || !RSVP_SCRIPT_URL.endsWith("/exec")) {
      if (rsvpError) {
        rsvpError.textContent = "URL Apps Script tidak sah.";
      }

      return;
    }

    const bilangan = status === "Hadir" && rsvpCount ? rsvpCount.value : "0";

    const formData = new FormData();

    formData.append("nama", nama);

    formData.append("kategori", kategori);

    formData.append("status", status);

    formData.append("bilangan", bilangan);

    formData.append("ucapan", ucapan);

    setRsvpLoading(true);

    try {
      /*
                    mode no-cors diperlukan untuk
                    Google Apps Script Web App.

                    Browser tidak boleh membaca response,
                    tetapi request masih dihantar.
                */

      await fetch(
        RSVP_SCRIPT_URL,

        {
          method: "POST",
          mode: "no-cors",
          body: formData,
        },
      );

      /*
                    Beri masa sekejap supaya animasi
                    loading tidak terlalu pantas.
                */

      await wait(900);

      if (status === "Hadir") {
        showRsvpModal(
          "Alhamdulillah",

          `Terima kasih, ${nama}.

Kehadiran anda seramai ${bilangan} orang telah direkodkan.

Jumpa anda pada 26 September 2026.`,
        );
      } else {
        showRsvpModal(
          "Terima Kasih",

          `Terima kasih, ${nama}, kerana memaklumkan kepada kami.

Doa dan ingatan anda amat kami hargai.`,
        );
      }

      rsvpForm.reset();

      updateAttendanceField();
    } catch (error) {
      console.error("RSVP submission error:", error);

      if (rsvpError) {
        rsvpError.textContent = "RSVP gagal dihantar. Sila cuba semula.";
      }
    } finally {
      setRsvpLoading(false);
    }
  });
}

/* =========================================================
   TANDA KASIH — TOGGLE QR
========================================================= */

const giftToggleButton = document.getElementById("giftToggleButton");

const giftQrPanel = document.getElementById("giftQrPanel");

if (giftToggleButton && giftQrPanel) {
  giftToggleButton.addEventListener("click", () => {
    const isOpen = giftToggleButton.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      giftQrPanel.classList.remove("show");

      giftToggleButton.setAttribute("aria-expanded", "false");

      giftToggleButton.textContent = "Buka QR";

      window.setTimeout(() => {
        giftQrPanel.hidden = true;
      }, 400);
    } else {
      giftQrPanel.hidden = false;

      requestAnimationFrame(() => {
        giftQrPanel.classList.add("show");
      });

      giftToggleButton.setAttribute("aria-expanded", "true");

      giftToggleButton.textContent = "Tutup QR";
    }
  });
}

/* =========================================================
   GALERI KENANGAN — TOGGLE QR
========================================================= */

const galleryQrToggle = document.getElementById("galleryQrToggle");

const galleryQrPanel = document.getElementById("galleryQrPanel");

if (galleryQrToggle && galleryQrPanel) {
  galleryQrToggle.addEventListener("click", () => {
    const isOpen = galleryQrToggle.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      galleryQrPanel.classList.remove("show");

      galleryQrToggle.setAttribute("aria-expanded", "false");

      galleryQrToggle.textContent = "Imbas Kod QR";

      window.setTimeout(() => {
        galleryQrPanel.hidden = true;
      }, 400);
    } else {
      galleryQrPanel.hidden = false;

      requestAnimationFrame(() => {
        galleryQrPanel.classList.add("show");
      });

      galleryQrToggle.setAttribute("aria-expanded", "true");

      galleryQrToggle.textContent = "Tutup Kod QR";
    }
  });
}

/* =========================================================
   13 — BOTTOM NAVIGATION
========================================================= */

const bottomNav = document.getElementById("bottomNav");

const bottomNavItems = document.querySelectorAll(
  ".bottom-nav-item[data-target]",
);

const bottomNavSections = Array.from(bottomNavItems)
  .map((item) => {
    const targetId = item.dataset.target;

    return document.getElementById(targetId);
  })
  .filter(Boolean);

function initializeLucideIcons() {
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

function showBottomNav() {
  if (!bottomNav) {
    return;
  }

  bottomNav.classList.add("show");

  bottomNav.setAttribute("aria-hidden", "false");
}

function setActiveBottomNav(sectionId) {
  bottomNavItems.forEach((item) => {
    const isActive = item.dataset.target === sectionId;

    item.classList.toggle("active", isActive);

    if (isActive) {
      item.setAttribute("aria-current", "page");
    } else {
      item.removeAttribute("aria-current");
    }
  });
}

bottomNavItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();

    const section = document.getElementById(item.dataset.target);

    if (!section) {
      return;
    }

    setActiveBottomNav(item.dataset.target);

    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
});

if ("IntersectionObserver" in window) {
  const bottomNavObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort(
          (first, second) => second.intersectionRatio - first.intersectionRatio,
        );

      if (visibleEntries.length > 0) {
        setActiveBottomNav(visibleEntries[0].target.id);
      }
    },
    {
      threshold: [0.2, 0.4, 0.6],
      rootMargin: "-15% 0px -55% 0px",
    },
  );

  bottomNavSections.forEach((section) => {
    bottomNavObserver.observe(section);
  });
}

/* =========================================================
   14 — CALENDAR
========================================================= */

const calendarButton = document.getElementById("calendarButton");

const calendarModal = document.getElementById("calendarModal");

const calendarModalX = document.getElementById("calendarModalX");

const calendarModalClose = document.getElementById("calendarModalClose");

const googleCalendarLink = document.getElementById("googleCalendarLink");

const GOOGLE_CALENDAR_URL =
  "https://calendar.google.com/calendar/render" +
  "?action=TEMPLATE" +
  "&text=" +
  encodeURIComponent("Majlis Bertaut Kasih – Iryanie & Safiuddin") +
  "&dates=20260926T033000Z/20260926T080000Z" +
  "&details=" +
  encodeURIComponent(
    "Majlis Bertaut Kasih Iryanie & Safiuddin. Majlis berlangsung dari 11.30 pagi hingga 4.00 petang.",
  ) +
  "&location=" +
  encodeURIComponent(
    "Rumah Minangkabau Homestay, Lot 71, Kampung Kelapa, 44000 Kuala Kubu Bharu, Selangor",
  );

if (googleCalendarLink) {
  googleCalendarLink.href = GOOGLE_CALENDAR_URL;
}

function openCalendarModal() {
  if (!calendarModal) {
    return;
  }

  calendarModal.classList.add("show");

  calendarModal.setAttribute("aria-hidden", "false");

  document.body.style.overflow = "hidden";

  initializeLucideIcons();

  window.setTimeout(() => {
    if (calendarModalX) {
      calendarModalX.focus();
    }
  }, 50);
}

function closeCalendarModal() {
  if (!calendarModal) {
    return;
  }

  calendarModal.classList.remove("show");

  calendarModal.setAttribute("aria-hidden", "true");

  document.body.style.overflow = "";
}

if (calendarButton) {
  calendarButton.addEventListener("click", openCalendarModal);
}

[calendarModalX, calendarModalClose].filter(Boolean).forEach((button) => {
  button.addEventListener("click", closeCalendarModal);
});

if (calendarModal) {
  calendarModal.addEventListener("click", (event) => {
    if (event.target === calendarModal) {
      closeCalendarModal();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    calendarModal &&
    calendarModal.classList.contains("show")
  ) {
    closeCalendarModal();
  }
});

initializeLucideIcons();

/* =========================================================
   END OF SCRIPT.JS V7
========================================================= */
