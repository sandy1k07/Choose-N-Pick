# Choose-N-Pick 🛒  
An online grocery store built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js).  
The application supports customer shopping flows, secure authentication, payments, product image storage, and an admin dashboard for product/order management.  

---

## 🚀 Features  

### 👥 User Features
- Register, login, and manage profile (JWT + bcrypt authentication)  
- Browse products by category or search with a dynamic search bar  
- Individual product pages with detailed descriptions  
- Add/remove items from cart and update quantities  
- Address management with database persistence  
- Checkout flow with billing & charges summary  
- Order tracking via **My Orders** page  
- Multiple payment options: **Cash on Delivery (COD)** or **Online Payment** (Razorpay integration)  

### 🛠️ Admin Features
- Add new products with images and details (stored in **Cloudinary**)  
- View and manage all products with stock toggle (In Stock / Out of Stock)  
- Monitor all orders and payment statuses  

---

## 🧑‍💻 Tech Stack
- **Frontend:** React.js, React Router, Tailwind CSS, Toast Notifications  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Mongoose)  
- **Authentication:** JWT, bcrypt  
- **Payments:** Razorpay Payment Gateway  
- **File Storage:** Cloudinary (for product images)  
- **API Calls:** Axios  
- **Deployment:** Vercel  

---

## 📂 Project Structure
```
/client   → React frontend  
/server   → Express + Node.js backend  
/models   → Mongoose schemas (User, Product, Order, etc.)  
```

---

## ⚡ Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/sandy1k07/Choose-N-Pick.git
cd Choose-N-Pick
```

### 2. Install dependencies
```bash
cd client && npm install
cd ../server && npm install
```

### 3. Add environment variables
Create a `.env` file in `/server` with:  
```
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Run the app
```bash
# Run backend
cd server && npm start

# Run frontend
cd client && npm start
```

---

## 🌐 Deployment
- **Frontend:** [Choose-N-Pick](https://choose-n-pickfrontend.vercel.app/)  
- **Backend:** Hosted separately (Node/Express + MongoDB Atlas).  
- **Image Storage:** Cloudinary  

