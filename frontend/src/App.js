import React, { useState, useEffect } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';
import { movies, slots, seats } from './data';
import './App.css';

function App() {
  // =============================================
  // STATE MANAGEMENT
  // =============================================
  const [selectedMovie, setSelectedMovie] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedSeats, setSelectedSeats] = useState({
    A1: 0, A2: 0, A3: 0, A4: 0, D1: 0, D2: 0
  });
  const [lastBooking, setLastBooking] = useState(null);
  const [theme, setTheme] = useState('light');
  const [showModal, setShowModal] = useState(false);
  const [showMovieModal, setShowMovieModal] = useState(false);
  const [selectedMovieInfo, setSelectedMovieInfo] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketData, setTicketData] = useState(null);
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // FOOD & BEVERAGES STATE
  const [selectedFood, setSelectedFood] = useState({
    popcorn_small: 0,
    popcorn_large: 0,
    coke: 0,
    pepsi: 0,
    nachos: 0,
    combo: 0
  });

  // VISUAL SEAT MAP STATE
  const [visualSeats, setVisualSeats] = useState({});

  // Seat prices
  const seatPrices = {
    A1: 150, A2: 150, A3: 200, A4: 200, D1: 250, D2: 250
  };

  // Food prices
  const foodPrices = {
    popcorn_small: 100,
    popcorn_large: 180,
    coke: 80,
    pepsi: 80,
    nachos: 120,
    combo: 250
  };

  // Food items data
  const foodItems = [
    { id: 'popcorn_small', name: 'Popcorn Small', emoji: '🍿', price: 100 },
    { id: 'popcorn_large', name: 'Popcorn Large', emoji: '🍿', price: 180 },
    { id: 'coke', name: 'Coca Cola', emoji: '🥤', price: 80 },
    { id: 'pepsi', name: 'Pepsi', emoji: '🥤', price: 80 },
    { id: 'nachos', name: 'Nachos', emoji: '🌮', price: 120 },
    { id: 'combo', name: 'Combo Deal', emoji: '🎁', price: 250 }
  ];

  // Movie data with detailed info
  const movieData = {
    "Suraj par Mangal Bhari": {
      poster: "🎭",
      rating: 4.2,
      genre: "Comedy, Drama",
      duration: "135 min",
      language: "Hindi",
      description: "A comedy about a wedding detective who investigates grooms for suspicious brides and their families.",
      cast: "Diljit Dosanjh, Manoj Bajpayee, Fatima Sana Shaikh",
      trailer: "https://www.youtube.com/embed/gq5Y_kVFXkA"
    },
    "Tenet": {
      poster: "🕐",
      rating: 4.5,
      genre: "Sci-Fi, Action",
      duration: "150 min",
      language: "English",
      description: "Armed with only one word, Tenet, and fighting for the survival of the entire world, a Protagonist journeys through a twilight world of international espionage on a mission that will unfold in something beyond real time.",
      cast: "John David Washington, Robert Pattinson, Elizabeth Debicki",
      trailer: "https://www.youtube.com/embed/AZGcmvrTX9M"
    },
    "The War with Grandpa": {
      poster: "👴",
      rating: 3.8,
      genre: "Family, Comedy",
      duration: "94 min",
      language: "English",
      description: "Upset that he has to share the room he loves with his grandfather, Peter decides to declare war in an attempt to get it back.",
      cast: "Robert De Niro, Uma Thurman, Rob Riggle",
      trailer: "https://www.youtube.com/embed/t8p5i-D5RuQ"
    },
    "The Personal History of David Copperfield": {
      poster: "📖",
      rating: 4.0,
      genre: "Biography, Drama",
      duration: "119 min",
      language: "English",
      description: "A modern take on Charles Dickens's classic tale of a young orphan who is able to triumph over many obstacles.",
      cast: "Dev Patel, Hugh Laurie, Tilda Swinton",
      trailer: "https://www.youtube.com/embed/fRVLMLiktxM"
    }
  };

  // Initialize visual seat map
  useEffect(() => {
    const initialSeats = {};
    ['A', 'B', 'C', 'D'].forEach(row => {
      for (let i = 1; i <= 10; i++) {
        initialSeats[`${row}${i}`] = false;
      }
    });
    setVisualSeats(initialSeats);
  }, []);

  // =============================================
  // CONFETTI ANIMATION
  // =============================================
  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const colors = ['#e50914', '#667eea', '#764ba2', '#f093fb'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  // =============================================
  // THEME MANAGEMENT
  // =============================================
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    showToast('Theme changed to ' + newTheme + ' mode', 'success');
  };

  // =============================================
  // LOAD SAVED DATA
  // =============================================
  useEffect(() => {
    const savedMovie = localStorage.getItem('movie');
    if (savedMovie) setSelectedMovie(savedMovie);

    const savedSlot = localStorage.getItem('slot');
    if (savedSlot) setSelectedSlot(savedSlot);

    const savedSeats = localStorage.getItem('seats');
    if (savedSeats) {
      const seats = JSON.parse(savedSeats);
      setSelectedSeats(seats);
      // Sync visual map with saved seats
      syncVisualMapFromSeats(seats);
    }

    const savedFood = localStorage.getItem('food');
    if (savedFood) setSelectedFood(JSON.parse(savedFood));

    fetchLastBooking();
  }, []);

  // =============================================
  // SYNC VISUAL MAP FROM SEAT COUNTS
  // =============================================
  const syncVisualMapFromSeats = (seats) => {
    const newVisualSeats = {};
    ['A', 'B', 'C', 'D'].forEach(row => {
      for (let i = 1; i <= 10; i++) {
        newVisualSeats[`${row}${i}`] = false;
      }
    });

    // Select seats based on counts
    let counts = { A1: 0, A2: 0, A3: 0, A4: 0, D1: 0, D2: 0 };
    
    Object.keys(newVisualSeats).forEach(seatId => {
      const row = seatId[0];
      const num = parseInt(seatId.slice(1));
      const isMiddle = num >= 4 && num <= 7;

      if (row === 'A') {
        if (!isMiddle && counts.A1 < seats.A1) {
          newVisualSeats[seatId] = true;
          counts.A1++;
        } else if (isMiddle && counts.A2 < seats.A2) {
          newVisualSeats[seatId] = true;
          counts.A2++;
        }
      } else if (row === 'B') {
        if (!isMiddle && counts.A3 < seats.A3) {
          newVisualSeats[seatId] = true;
          counts.A3++;
        } else if (isMiddle && counts.A4 < seats.A4) {
          newVisualSeats[seatId] = true;
          counts.A4++;
        }
      } else if (row === 'C') {
        if (!isMiddle && counts.A3 < seats.A3) {
          newVisualSeats[seatId] = true;
          counts.A3++;
        } else if (isMiddle && counts.A4 < seats.A4) {
          newVisualSeats[seatId] = true;
          counts.A4++;
        }
      } else if (row === 'D') {
        if (!isMiddle && counts.D1 < seats.D1) {
          newVisualSeats[seatId] = true;
          counts.D1++;
        } else if (isMiddle && counts.D2 < seats.D2) {
          newVisualSeats[seatId] = true;
          counts.D2++;
        }
      }
    });

    setVisualSeats(newVisualSeats);
  };

  // =============================================
  // FETCH LAST BOOKING
  // =============================================
  const fetchLastBooking = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/booking');
      if (!response.data.message) {
        setLastBooking(response.data);
      }
    } catch (error) {
      console.error('Error fetching last booking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // =============================================
  // TOAST NOTIFICATIONS
  // =============================================
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // =============================================
  // MOVIE INFO MODAL
  // =============================================
  const openMovieInfo = (movie) => {
    setSelectedMovieInfo(movieData[movie]);
    setShowMovieModal(true);
  };

  // =============================================
  // HANDLE SELECTIONS
  // =============================================
  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
    localStorage.setItem('movie', movie);
    showToast(`Selected: ${movie}`, 'success');
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    localStorage.setItem('slot', slot);
    showToast(`Time slot: ${slot}`, 'success');
  };

  const handleSeatChange = (seatType, value) => {
    const count = parseInt(value) || 0;
    const updatedSeats = {
      ...selectedSeats,
      [seatType]: count
    };
    setSelectedSeats(updatedSeats);
    localStorage.setItem('seats', JSON.stringify(updatedSeats));
    
    // Sync visual map
    syncVisualMapFromSeats(updatedSeats);
  };

  // =============================================
  // VISUAL SEAT MAP TOGGLE - SMART PRICING!
  // =============================================
  const toggleVisualSeat = (seatId) => {
    // Toggle the visual selection
    const newVisualSeats = {
      ...visualSeats,
      [seatId]: !visualSeats[seatId]
    };
    setVisualSeats(newVisualSeats);

    // Smart seat type mapping based on row AND position
    const seatCounts = { A1: 0, A2: 0, A3: 0, A4: 0, D1: 0, D2: 0 };
    
    Object.keys(newVisualSeats).forEach(seat => {
      if (newVisualSeats[seat]) {
        const row = seat[0];
        const number = parseInt(seat.slice(1));
        
        // Premium seats (middle seats 4-7) cost more!
        if (row === 'A') {
          if (number >= 4 && number <= 7) {
            seatCounts.A2++; // Middle A seats = A2 price (₹150)
          } else {
            seatCounts.A1++; // Side A seats = A1 price (₹150)
          }
        } else if (row === 'B') {
          if (number >= 4 && number <= 7) {
            seatCounts.A4++; // Middle B seats = A4 price (₹200)
          } else {
            seatCounts.A3++; // Side B seats = A3 price (₹200)
          }
        } else if (row === 'C') {
          if (number >= 4 && number <= 7) {
            seatCounts.A4++; // Middle C seats = premium
          } else {
            seatCounts.A3++; // Side C seats
          }
        } else if (row === 'D') {
          if (number >= 4 && number <= 7) {
            seatCounts.D2++; // Middle D seats = D2 price (₹250)
          } else {
            seatCounts.D1++; // Side D seats = D1 price (₹250)
          }
        }
      }
    });

    setSelectedSeats(seatCounts);
    localStorage.setItem('seats', JSON.stringify(seatCounts));
    
    const totalSelected = Object.values(seatCounts).reduce((sum, count) => sum + count, 0);
    const totalPrice = calculateSeatsTotal();
    
    if (totalSelected > 0) {
      showToast(`${totalSelected} seat(s) selected - ₹${totalPrice}`, 'success');
    } else {
      showToast('All seats deselected', 'info');
    }
  };

  // Handle food selection
  const handleFoodChange = (foodId, value) => {
    const count = parseInt(value) || 0;
    const updatedFood = {
      ...selectedFood,
      [foodId]: count
    };
    setSelectedFood(updatedFood);
    localStorage.setItem('food', JSON.stringify(updatedFood));
  };

  // =============================================
  // CALCULATE TOTALS
  // =============================================
  const calculateSeatsTotal = () => {
    let total = 0;
    Object.keys(selectedSeats).forEach(seatType => {
      total += selectedSeats[seatType] * seatPrices[seatType];
    });
    return total;
  };

  const calculateFoodTotal = () => {
    let total = 0;
    Object.keys(selectedFood).forEach(foodId => {
      total += selectedFood[foodId] * foodPrices[foodId];
    });
    return total;
  };

  const calculateGrandTotal = () => {
    return calculateSeatsTotal() + calculateFoodTotal();
  };

  const getTotalSeats = () => {
    return Object.values(selectedSeats).reduce((sum, count) => sum + count, 0);
  };

  const getTotalFood = () => {
    return Object.values(selectedFood).reduce((sum, count) => sum + count, 0);
  };

  // =============================================
  // GENERATE TICKET DATA
  // =============================================
  const generateTicket = () => {
    const bookingId = 'BMS' + Date.now().toString().slice(-8);
    const qrData = `BOOKING:${bookingId}|MOVIE:${selectedMovie}|TIME:${selectedSlot}`;
    
    return {
      bookingId,
      movie: selectedMovie,
      slot: selectedSlot,
      seats: selectedSeats,
      food: selectedFood,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      total: calculateGrandTotal(),
      qrCode: qrData,
      theater: "PVR Cinemas, Phoenix Mall",
      screen: "Screen 3"
    };
  };

  // =============================================
  // HANDLE BOOKING
  // =============================================
  const handleSubmit = async () => {
    if (!selectedMovie || !selectedSlot) {
      showToast('Please select a movie and time slot!', 'error');
      return;
    }

    const totalSeats = getTotalSeats();
    if (totalSeats === 0) {
      showToast('Please select at least one seat!', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/api/booking', {
        movie: selectedMovie,
        slot: selectedSlot,
        seats: selectedSeats
      });

      if (response.status === 200) {
        // Trigger confetti!
        triggerConfetti();

        // Generate ticket
        const ticket = generateTicket();
        setTicketData(ticket);

        // Update last booking
        setLastBooking({
          movie: selectedMovie,
          slot: selectedSlot,
          seats: selectedSeats
        });

        // Show success modal
        setShowModal(true);

        // Clear after 6 seconds
        setTimeout(() => {
          clearSelections();
        }, 6000);
      }
    } catch (error) {
      console.error('Error making booking:', error);
      showToast('Failed to make booking. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // =============================================
  // DOWNLOAD TICKET
  // =============================================
  const downloadTicket = () => {
    setShowModal(false);
    setShowTicketModal(true);
  };

  // =============================================
  // CLEAR SELECTIONS
  // =============================================
  const clearSelections = () => {
    setSelectedMovie('');
    setSelectedSlot('');
    setSelectedSeats({ A1: 0, A2: 0, A3: 0, A4: 0, D1: 0, D2: 0 });
    setSelectedFood({
      popcorn_small: 0,
      popcorn_large: 0,
      coke: 0,
      pepsi: 0,
      nachos: 0,
      combo: 0
    });
    
    // Clear visual map
    const clearedVisualSeats = {};
    ['A', 'B', 'C', 'D'].forEach(row => {
      for (let i = 1; i <= 10; i++) {
        clearedVisualSeats[`${row}${i}`] = false;
      }
    });
    setVisualSeats(clearedVisualSeats);
    
    localStorage.removeItem('movie');
    localStorage.removeItem('slot');
    localStorage.removeItem('seats');
    localStorage.removeItem('food');
  };

  // =============================================
  // RENDER STARS
  // =============================================
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
      stars += '⭐';
    }
    if (hasHalfStar) {
      stars += '⭐';
    }
    
    return stars;
  };

  // =============================================
  // GET SEAT PRICE BY POSITION
  // =============================================
  const getSeatPrice = (row, num) => {
    const isMiddle = num >= 4 && num <= 7;
    
    if (row === 'A') {
      return isMiddle ? seatPrices.A2 : seatPrices.A1; // ₹150
    } else if (row === 'B' || row === 'C') {
      return isMiddle ? seatPrices.A4 : seatPrices.A3; // ₹200
    } else if (row === 'D') {
      return isMiddle ? seatPrices.D2 : seatPrices.D1; // ₹250
    }
    return 150;
  };

  // =============================================
  // RENDER UI
  // =============================================
  return (
    <div className="App">
      {/* THEME TOGGLE */}
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      {/* HEADER */}
      <header className="app-header">
        <div className="header-content">
          <h1>🎬 BookMyShow</h1>
          <p>Your ultimate movie ticket booking experience</p>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="container">
        
        {/* ==================== MOVIES ==================== */}
        <section className="section">
          <div className="section-header">
            <span className="section-icon">🎥</span>
            <h2>Select Your Movie</h2>
          </div>
          <div className="movies-grid">
            {movies.map((movie) => (
              <div
                key={movie}
                className={`movie-card ${selectedMovie === movie ? 'selected' : ''}`}
              >
                {selectedMovie === movie && (
                  <div className="selected-badge">
                    <span>✓</span> Selected
                  </div>
                )}
                <div 
                  className="movie-poster"
                  onClick={() => handleMovieSelect(movie)}
                >
                  {movieData[movie].poster}
                </div>
                <div className="movie-info">
                  <h3 className="movie-title">{movie}</h3>
                  <div className="movie-rating">
                    <span className="stars">{renderStars(movieData[movie].rating)}</span>
                    <span className="rating-text">{movieData[movie].rating}/5</span>
                  </div>
                  <p className="movie-genre">{movieData[movie].genre}</p>
                  <button 
                    className="info-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openMovieInfo(movie);
                    }}
                  >
                    ℹ️ More Info
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==================== TIME SLOTS ==================== */}
        <section className="section">
          <div className="section-header">
            <span className="section-icon">🕐</span>
            <h2>Choose Your Time</h2>
          </div>
          <div className="slots-grid">
            {slots.map((slot) => (
              <div
                key={slot}
                className={`slot-pill ${selectedSlot === slot ? 'selected' : ''}`}
                onClick={() => handleSlotSelect(slot)}
              >
                <span className="slot-icon">⏰</span>
                {slot}
              </div>
            ))}
          </div>
        </section>

        {/* ==================== VISUAL SEAT MAP ==================== */}
        <section className="section">
          <div className="section-header">
            <span className="section-icon">💺</span>
            <h2>Select Your Seats - Interactive Map</h2>
          </div>
          
          <div className="pricing-info" style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            marginBottom: '20px',
            flexWrap: 'wrap',
            padding: '15px',
            background: 'var(--bg-secondary)',
            borderRadius: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '20px', 
                height: '20px', 
                background: '#28a745',
                borderRadius: '4px'
              }}></div>
              <span><strong>Row A (Side):</strong> ₹150</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '20px', 
                height: '20px', 
                background: '#20c997',
                borderRadius: '4px'
              }}></div>
              <span><strong>Row A (Middle):</strong> ₹150</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '20px', 
                height: '20px', 
                background: '#ffc107',
                borderRadius: '4px'
              }}></div>
              <span><strong>Row B-C (Side):</strong> ₹200</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '20px', 
                height: '20px', 
                background: '#ff9800',
                borderRadius: '4px'
              }}></div>
              <span><strong>Row B-C (Middle):</strong> ₹200</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '20px', 
                height: '20px', 
                background: '#e50914',
                borderRadius: '4px'
              }}></div>
              <span><strong>Row D (Side):</strong> ₹250</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '20px', 
                height: '20px', 
                background: '#b20710',
                borderRadius: '4px'
              }}></div>
              <span><strong>Row D (Middle - VIP):</strong> ₹250</span>
            </div>
          </div>

          <div className="screen-indicator">
            <div className="screen">🎬 SCREEN</div>
          </div>

          <div className="seat-map">
            {['A', 'B', 'C', 'D'].map(row => (
              <div key={row} className="seat-row">
                <div className="row-label">{row}</div>
                <div className="seats-in-row">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => {
                    const seatId = `${row}${num}`;
                    const isSelected = visualSeats[seatId];
                    const price = getSeatPrice(row, num);
                    const isMiddle = num >= 4 && num <= 7;
                    
                    return (
                      <div
                        key={seatId}
                        className={`visual-seat ${isSelected ? 'seat-selected' : ''}`}
                        onClick={() => toggleVisualSeat(seatId)}
                        title={`Seat ${seatId} - ₹${price}${isMiddle ? ' (Premium)' : ''}`}
                        style={{
                          borderColor: isMiddle ? 
                            (row === 'A' ? '#20c997' : row === 'D' ? '#b20710' : '#ff9800') :
                            (row === 'A' ? '#28a745' : row === 'D' ? '#e50914' : '#ffc107')
                        }}
                      >
                        {num}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="seat-legend">
            <div className="legend-item">
              <div className="visual-seat"></div>
              <span>Available</span>
            </div>
            <div className="legend-item">
              <div className="visual-seat seat-selected"></div>
              <span>Selected</span>
            </div>
            <div className="legend-item">
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                💡 Middle seats (4-7) are premium positions
              </span>
            </div>
          </div>
        </section>

        {/* ==================== REGULAR SEATS (BACKUP) ==================== */}
        <section className="section">
          <div className="section-header">
            <span className="section-icon">🎫</span>
            <h2>Or Enter Seat Count Manually</h2>
          </div>
          <div className="seats-grid">
            {seats.map((seatType) => (
              <div key={seatType} className="seat-card">
                <div className="seat-header">
                  <div className="seat-type-label">
                    <span className="seat-icon">🪑</span>
                    {seatType}
                  </div>
                  <div className="seat-price">₹{seatPrices[seatType]}</div>
                </div>
                <div className="seat-input-wrapper">
                  <input
                    id={`seat-${seatType}`}
                    type="number"
                    min="0"
                    max="10"
                    className="seat-input"
                    value={selectedSeats[seatType]}
                    onChange={(e) => handleSeatChange(seatType, e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==================== FOOD & BEVERAGES ==================== */}
        <section className="section">
          <div className="section-header">
            <span className="section-icon">🍿</span>
            <h2>Add Food & Beverages</h2>
          </div>
          <div className="food-grid">
            {foodItems.map((item) => (
              <div key={item.id} className="food-card">
                <div className="food-emoji">{item.emoji}</div>
                <h3 className="food-name">{item.name}</h3>
                <div className="food-price">₹{item.price}</div>
                <div className="food-controls">
                  <button
                    className="food-btn"
                    onClick={() => handleFoodChange(item.id, selectedFood[item.id] - 1)}
                    disabled={selectedFood[item.id] === 0}
                  >
                    −
                  </button>
                  <span className="food-count">{selectedFood[item.id]}</span>
                  <button
                    className="food-btn"
                    onClick={() => handleFoodChange(item.id, selectedFood[item.id] + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==================== BOOKING SUMMARY ==================== */}
        {(getTotalSeats() > 0 || getTotalFood() > 0) && (
          <div className="booking-summary">
            <div className="summary-header">
              <h3>📋 Booking Summary</h3>
            </div>
            
            {getTotalSeats() > 0 && (
              <>
                <h4 className="summary-section-title">🎫 Tickets</h4>
                <div className="summary-items">
                  {Object.keys(selectedSeats).map((seatType) => (
                    selectedSeats[seatType] > 0 && (
                      <div key={seatType} className="summary-item">
                        <span>{seatType} × {selectedSeats[seatType]}</span>
                        <span>₹{selectedSeats[seatType] * seatPrices[seatType]}</span>
                      </div>
                    )
                  ))}
                  <div className="summary-subtotal">
                    <span>Subtotal:</span>
                    <span>₹{calculateSeatsTotal()}</span>
                  </div>
                </div>
              </>
            )}

            {getTotalFood() > 0 && (
              <>
                <h4 className="summary-section-title">🍿 Food & Beverages</h4>
                <div className="summary-items">
                  {Object.keys(selectedFood).map((foodId) => {
                    const item = foodItems.find(f => f.id === foodId);
                    return selectedFood[foodId] > 0 && (
                      <div key={foodId} className="summary-item">
                        <span>{item.name} × {selectedFood[foodId]}</span>
                        <span>₹{selectedFood[foodId] * foodPrices[foodId]}</span>
                      </div>
                    );
                  })}
                  <div className="summary-subtotal">
                    <span>Subtotal:</span>
                    <span>₹{calculateFoodTotal()}</span>
                  </div>
                </div>
              </>
            )}

            <div className="summary-total">
              <span>Grand Total:</span>
              <span>₹{calculateGrandTotal()}</span>
            </div>
          </div>
        )}

        {/* ==================== SUBMIT BUTTON ==================== */}
        <button 
          className="submit-button" 
          onClick={handleSubmit}
          disabled={isLoading}
        >
          <span className="button-content">
            {isLoading ? (
              <>
                <span>⏳</span> Processing...
              </>
            ) : (
              <>
                <span>🎟️</span> Book Now - ₹{calculateGrandTotal()}
              </>
            )}
          </span>
        </button>

        {/* ==================== LAST BOOKING ==================== */}
        <section className="last-booking">
          <h2>
            <span>📜</span> Last Booking Details
          </h2>
          {isLoading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : lastBooking ? (
            <div className="booking-content">
              <div className="booking-detail">
                <div className="detail-label">🎬 Movie</div>
                <div className="detail-value">{lastBooking.movie}</div>
              </div>
              <div className="booking-detail">
                <div className="detail-label">🕐 Time Slot</div>
                <div className="detail-value">{lastBooking.slot}</div>
              </div>
              <div className="booking-detail">
                <div className="detail-label">💺 Seats Booked</div>
                <div className="seats-breakdown">
                  {Object.entries(lastBooking.seats).map(([seatType, count]) => (
                    count > 0 && (
                      <div key={seatType} className="seat-badge">
                        {seatType}: {count}
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="no-booking">
              <div className="no-booking-icon">🎫</div>
              <p>No previous booking found</p>
            </div>
          )}
        </section>
      </div>

      {/* ==================== MOVIE INFO MODAL ==================== */}
      {showMovieModal && selectedMovieInfo && (
        <div className="modal-overlay" onClick={() => setShowMovieModal(false)}>
          <div className="modal movie-info-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowMovieModal(false)}>✕</button>
            
            <div className="movie-info-header">
              <div className="movie-info-poster">{movieData[selectedMovie]?.poster}</div>
              <div>
                <h2>{selectedMovie}</h2>
                <div className="movie-rating">
                  <span className="stars">{renderStars(selectedMovieInfo.rating)}</span>
                  <span className="rating-text">{selectedMovieInfo.rating}/5</span>
                </div>
              </div>
            </div>

            <div className="movie-info-details">
              <div className="info-row">
                <strong>Genre:</strong> {selectedMovieInfo.genre}
              </div>
              <div className="info-row">
                <strong>Duration:</strong> {selectedMovieInfo.duration}
              </div>
              <div className="info-row">
                <strong>Language:</strong> {selectedMovieInfo.language}
              </div>
              <div className="info-row">
                <strong>Cast:</strong> {selectedMovieInfo.cast}
              </div>
            </div>

            <div className="movie-description">
              <h3>Synopsis</h3>
              <p>{selectedMovieInfo.description}</p>
            </div>

            <div className="trailer-container">
              <h3>Watch Trailer</h3>
              <iframe
                width="100%"
                height="315"
                src={selectedMovieInfo.trailer}
                title="Movie Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <button 
              className="modal-button modal-button-primary"
              onClick={() => {
                handleMovieSelect(selectedMovie);
                setShowMovieModal(false);
              }}
            >
              Select This Movie
            </button>
          </div>
        </div>
      )}

      {/* ==================== SUCCESS MODAL ==================== */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-success">
              <div className="success-icon">✓</div>
              <h2>Booking Confirmed! 🎉</h2>
              <p>Your tickets have been successfully booked</p>
            </div>
            <div className="modal-details">
              <div className="modal-detail">
                <span>🎬 Movie:</span>
                <strong>{selectedMovie}</strong>
              </div>
              <div className="modal-detail">
                <span>🕐 Time:</span>
                <strong>{selectedSlot}</strong>
              </div>
              <div className="modal-detail">
                <span>💺 Seats:</span>
                <strong>{getTotalSeats()} tickets</strong>
              </div>
              {getTotalFood() > 0 && (
                <div className="modal-detail">
                  <span>🍿 Food Items:</span>
                  <strong>{getTotalFood()} items</strong>
                </div>
              )}
              <div className="modal-detail">
                <span>💰 Total:</span>
                <strong>₹{calculateGrandTotal()}</strong>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="modal-button modal-button-primary"
                onClick={downloadTicket}
              >
                🎫 View Ticket
              </button>
              <button 
                className="modal-button modal-button-secondary"
                onClick={() => {
                  setShowModal(false);
                  clearSelections();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Book Another
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TICKET MODAL ==================== */}
      {showTicketModal && ticketData && (
        <div className="modal-overlay" onClick={() => setShowTicketModal(false)}>
          <div className="modal ticket-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowTicketModal(false)}>✕</button>
            
            <div className="ticket">
              <div className="ticket-header">
                <h2>🎬 BookMyShow</h2>
                <p className="ticket-id">Booking ID: {ticketData.bookingId}</p>
              </div>

              <div className="ticket-body">
                <div className="ticket-movie">
                  <div className="ticket-poster">{movieData[ticketData.movie]?.poster}</div>
                  <div>
                    <h3>{ticketData.movie}</h3>
                    <p>{movieData[ticketData.movie]?.genre}</p>
                  </div>
                </div>

                <div className="ticket-details-grid">
                  <div className="ticket-detail">
                    <div className="ticket-label">📍 Theater</div>
                    <div className="ticket-value">{ticketData.theater}</div>
                  </div>
                  <div className="ticket-detail">
                    <div className="ticket-label">🎬 Screen</div>
                    <div className="ticket-value">{ticketData.screen}</div>
                  </div>
                  <div className="ticket-detail">
                    <div className="ticket-label">📅 Date</div>
                    <div className="ticket-value">{ticketData.date}</div>
                  </div>
                  <div className="ticket-detail">
                    <div className="ticket-label">🕐 Show Time</div>
                    <div className="ticket-value">{ticketData.slot}</div>
                  </div>
                </div>

                <div className="ticket-seats">
                  <h4>💺 Your Seats</h4>
                  <div className="ticket-seats-list">
                    {Object.entries(ticketData.seats).map(([type, count]) => (
                      count > 0 && (
                        <span key={type} className="ticket-seat-badge">
                          {type} × {count}
                        </span>
                      )
                    ))}
                  </div>
                </div>

                {getTotalFood() > 0 && (
                  <div className="ticket-food">
                    <h4>🍿 Food & Beverages</h4>
                    <div className="ticket-food-list">
                      {Object.entries(ticketData.food).map(([id, count]) => {
                        const item = foodItems.find(f => f.id === id);
                        return count > 0 && (
                          <div key={id} className="ticket-food-item">
                            {item.emoji} {item.name} × {count}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="ticket-qr">
                  <div className="qr-placeholder">
                    <div className="qr-code">QR CODE</div>
                    <p className="qr-text">{ticketData.qrCode}</p>
                  </div>
                </div>

                <div className="ticket-total">
                  <span>Total Amount Paid:</span>
                  <span className="ticket-amount">₹{ticketData.total}</span>
                </div>
              </div>

              <div className="ticket-footer">
                <p>Please show this ticket at the entrance</p>
                <p className="ticket-time">Booked on: {ticketData.date} at {ticketData.time}</p>
              </div>
            </div>

            <button 
              className="modal-button modal-button-primary"
              onClick={() => {
                showToast('Ticket ready! (Download feature demo)', 'success');
                setShowTicketModal(false);
              }}
              style={{ marginTop: '20px' }}
            >
              💾 Download Ticket
            </button>
          </div>
        </div>
      )}

      {/* ==================== TOAST ==================== */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <span className="toast-icon">
            {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✗' : 'ℹ'}
          </span>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

export default App;