# Games. / by d4rk

A web-based game library featuring a modular structure and a decoupled backend to allow for easy game integration and persistent player data. Built as a personal project during some of my free time, the platform focuses on a clean, functional interface designed for straightforward gameplay and progress tracking.

---

###  Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide Icons |
| **Backend** | Node.js, Express (ESM) |
| **Database** | Neon (Serverless Postgres), SQL |
| **Auth** | Better-Auth |
| **Deployment** | Vercel (Edge-optimized) |



###  Active Development

My development process is balanced alongside other side projects and academic commitments. While I am currently focused on architectural improvements, the next game module is in the early stages of planning. As such, new releases will follow a steady, measured pace as I find time to build them properly.

---

# Access

Live Preview: https://games-d4rk.vercel.app

This repo contains the source code for the site. You are welcome to explore the structure if you are interested in the implementation.

--- 

# Cloning

This is a personal project, and I would be happy if I could help other people by keeping this open. While the source code is public and open for study, please note that it is actively under development. If you find the structure helpful for your own projects, feel free to reference the patterns I've used.

1. **Cloning the repository**
```
git clone https://github.com/D4RKMTR0/games
cd games
```

2. **Install Dependencies**
```
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. **Run**
```
# Start the client (from /client)
npm run dev

# Start the server (from /server)
npm run dev
```

small note: /client starts at port 5173, and /server will start at 3001 if you haven't set up a .env file.
