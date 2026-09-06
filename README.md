# ACET 3D — Official 3D Printing Club & Storefront

> **Production Full-Stack Additive Manufacturing & E-Commerce Web Application**  
> **Parent Institution:** Akshaya College of Engineering and Technology ([acetcbe.edu.in](https://acetcbe.edu.in))  
> **TNEA Counselling Code:** 2763 | Kinathukadavu, Coimbatore, Tamil Nadu  
> **Theme:** Red Wine (`#540d2a`) & Carrara Marble (`#fcf9f5`) with Imperial Gold (`#d4af37`) Accents  
> **Architecture Pattern:** SILAII e-commerce layout DNA + Akshaya College institutional brand system  

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js 18 + Vite + Tailwind CSS + React Router v6 + Lucide Icons |
| **3D Graphics** | Three.js WebGL (PBR Material Shader Switcher & OrbitControls) |
| **Backend** | Node.js + Express.js REST API |
| **Database** | MongoDB + Mongoose (with in-memory fallback for local dev) |
| **Authentication**| JWT (JSON Web Tokens) + bcryptjs |
| **Payments** | Razorpay / UPI Gateway Integration + Pay on Pickup |
| **State** | React Context (`CartContext`, `AuthContext`) |

---

## 📁 Repository Structure

```
acet-3d/
├── client/                     # React.js + Vite Frontend
│   ├── src/
│   │   ├── api/client.js       # Axios API client
│   │   ├── context/            # CartContext, AuthContext
│   │   ├── components/
│   │   │   ├── layout/         # Header (2-tier), AnnouncementBar, Footer
│   │   │   ├── product/        # ProductCard, ThreeViewer (WebGL PBR)
│   │   │   └── cart/           # CartDrawer
│   │   └── pages/
│   │       ├── HomePage.jsx        # 11 SILAII sections
│   │       ├── CollectionPage.jsx  # Category & material filter sidebar + grid
│   │       ├── ProductPage.jsx     # Live 3D viewer + material swatches + specs + reviews
│   │       ├── CustomOrderPage.jsx # CAD dropzone + live mathematical estimator
│   │       ├── CartPage.jsx        # Full shopping cart
│   │       ├── CheckoutPage.jsx    # Campus pickup vs Courier + Razorpay flow
│   │       ├── TrackOrderPage.jsx  # 5-stage print bed telemetry
│   │       ├── AboutPage.jsx       # Kinathukadavu lab info & faculty advisor
│   │       ├── AdminLoginPage.jsx  # JWT authentication
│   │       └── AdminDashboard.jsx  # 8-bed telemetry, orders, CAD queue
├── server/                     # Express.js REST API
│   ├── config/db.js            # MongoDB connection
│   ├── models/                 # Product, Order, User, CustomRequest, Review
│   ├── routes/                 # /products, /orders, /custom-requests, /auth, /admin, /reviews
│   ├── middleware/auth.js      # JWT protect & admin guard
│   ├── data/seed.js            # Initial 16+ ACET catalog products & default admin
│   └── server.js               # Express application entrypoint
├── .env.example                # Environment variable template
└── package.json                # Root scripts
```

---

## 🚀 Quick Start & Running Locally

### 1. Install Dependencies
```bash
# Root & server dependencies
npm install

# Client dependencies
npm --prefix client install
```

### 2. Build Client Production Bundle
```bash
npm run build
```

### 3. Run the Server
```bash
npm start
# or
npm run dev
```

* 🌐 **Storefront & API Live At:** `http://localhost:5000`
* 🔒 **Admin Credentials:** `admin@acetcbe.edu.in` / `acet3d2026`

---

## 🔑 REST API Endpoints

```
GET    /api/products                   # Get all products (with category, search, material filters)
GET    /api/products/:identifier       # Get single product by ID or slug
POST   /api/orders                     # Place a 3D print order
GET    /api/orders/track?orderId=      # Live print bed queue telemetry
POST   /api/custom-requests            # Submit student CAD/STL project quote
POST   /api/auth/login                 # JWT login for club leads
GET    /api/admin/stats                # 8-bed print farm monitor & revenue metrics
GET    /api/reviews/:productId         # Fetch verified student reviews
POST   /api/reviews                    # Submit product review
```
<!-- redeploy trigger -->
