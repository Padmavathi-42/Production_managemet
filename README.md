
# Production Management

A full-stack web application for managing products with CRUD operations, built with React frontend and Node.js/Express/MongoDB backend.

## Features

- **Product Management**: Create, read, update, and delete products
- **Search & Filter**: Search products by name and sort by various criteria
- **Category Management**: Organize products into predefined categories
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Validation**: Client-side and server-side validation
- **Image Integration**: Automatic product image fetching from Unsplash API
- **Health Monitoring**: API health check with connection status
- **Error Handling**: Comprehensive error handling and user feedback

## Tech Stack

### Frontend
- **React** - User interface library
- **React Router** - Client-side routing
- **Vite** - Build tool and development server
- **CSS3** - Custom styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB

## Project Structure

```
product-manager/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   └── productController.js # Product CRUD operations
│   ├── middleware/
│   │   ├── errorMiddleware.js   # Error handling
│   │   └── validationMiddleware.js # Input validation
│   ├── models/
│   │   └── Product.js           # Product schema
│   ├── routes/
│   │   └── productRoutes.js     # API routes
│   ├── utils/
│   │   └── responseHelper.js    # Standardized responses
│   └── server.js                # Entry point
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx       # Navigation
    │   │   ├── ProductForm.jsx  # Add/Edit form
    │   │   ├── ProductItem.jsx  # Product card
    │   │   ├── ProductList.jsx  # Products grid
    │   │   ├── SearchBar.jsx    # Search functionality
    │   │   └── SortDropdown.jsx # Sorting options
    │   ├── pages/
    │   │   ├── AddProduct.jsx   # Add product page
    │   │   ├── EditProduct.jsx  # Edit product page
    │   │   ├── Home.jsx         # Homepage
    │   │   ├── Products.jsx     # All products page
    │   │   └── NotFound.jsx     # 404 page
    │   ├── services/
    │   │   └── api.js           # API client
    │   ├── App.jsx              # Main app component
    │   └── main.jsx             # Entry point
    └── public/
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Git

### Backend Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd product-manager/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:

4. Start the backend server:
```bash
npm start
# or for development
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd ../frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:


4. Start the frontend server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Products
- `GET /api/products` - Get all products (with optional search/filter)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Categories
- `GET /api/products/categories` - Get available categories

### Health Check
- `GET /api/health` - Check API status

## Environment Variables

## Product Categories

The application supports the following product categories:
- Electronics
- Clothing
- Books
- Home & Garden
- Sports
- Toys
- Furniture
- Appliances
- Groceries
- Beauty
- Automotive
- Accessories
- Footwear
- Jewelry
- Health
- Pet Supplies
- Music
- Gaming
- Office
- Kitchen
- Garden
- Tools
- Baby
- Outdoor
- Art
- Photography
- Other

## Features in Detail

### Product Management
- Add new products with name, price, description, and category
- Edit existing products
- Delete products with confirmation
- Input validation on both client and server side

### Search & Sorting
- Real-time search by product name
- Sort by name (A-Z)
- Sort by price (low to high, high to low)
- Sort by date (newest first)

### User Interface
- Responsive design for all screen sizes
- Product cards with automatic image fetching
- Loading states and error handling
- Confirmation dialogs for destructive actions

## Database Schema

### Product Model
```javascript
{
  name: String (required, max 100 chars),
  price: Number (required, min 0.01),
  description: String (required, max 500 chars),
  category: String (required, enum from predefined list),
  date: Date (default: current date),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

## Development Scripts

### Backend
```bash
npm start          # Start production server
npm run dev        # Start with nodemon
```

### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## Error Handling

The application includes comprehensive error handling:
- Client-side validation with real-time feedback
- Server-side validation with detailed error messages
- Network error handling with user-friendly messages
- Fallback data when backend is unavailable
- Graceful degradation for offline scenarios
# Production_managemet
