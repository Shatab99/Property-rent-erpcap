# Rent Property Frontend

A web application for managing rental properties, allowing users to browse, list, and manage rental units.

## Features

**Property Listings:**
    - View a comprehensive list of available rental properties with high-quality images, detailed descriptions, and transparent pricing information.
    - Access property details including amenities, location map, landlord contact, and availability status.

**Search & Filter:**
    - Search properties by city, neighborhood, price range, property type (apartment, house, etc.), and number of bedrooms/bathrooms.
    - Use advanced filters for amenities, pet policies, furnished/unfurnished options, and more.
    - Sort results by relevance, price, or newest listings.

**User Authentication:**
    - Secure registration and login for both tenants and landlords using email/password or social login.
    - Manage user profiles, including updating contact information, profile picture, and password.
    - Role-based access for tenants and landlords with personalized dashboards.

**Add/Edit Properties:**
    - Landlords can add new property listings with multiple images, detailed descriptions, and pricing.
    - Edit or update property details, availability, and images at any time.
    - Manage all listed properties from a dedicated dashboard, including viewing inquiries and booking requests.

**Booking System:**
    - Tenants can request property bookings, schedule viewings, and communicate with landlords.
    - View and manage booking history, including upcoming and past bookings.
    - Receive notifications for booking confirmations, cancellations, and updates.
- **Responsive Design:** Optimized for desktop and mobile devices.

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

```bash
git clone https://github.com/yourusername/rent-property-frontend.git
cd rent-property-frontend
npm install
```

### Running the App

```bash
npm start
```

The app will run at `http://localhost:3000`.

## Project Structure

```
src/
    components/      # Reusable UI components
    pages/           # Application pages (Home, Login, Property Details, etc.)
    services/        # API calls and business logic
    assets/          # Images and static files
    utils/           # Utility functions
```

## Technologies Used

- React
- Redux (or Context API)
- React Router
- Axios
- Material-UI / Tailwind CSS

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
