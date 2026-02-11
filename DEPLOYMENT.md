# Deployment Guide

This project is built with **Vite** and **React**. It is ready for deployment on modern platforms like **Vercel** or **Netlify**.

## Prerequisites
- A GitHub account.
- A Vercel or Netlify account.
- This repository linked to your GitHub account (already done).

---

## Option 1: Deploy to Vercel (Recommended)

1. **Go to Vercel Dashboard:**
   - Log in to [vercel.com](https://vercel.com).
   - Click **Add New...** -> **Project**.

2. **Import Git Repository:**
   - Find `SCADA-design-challenge` in the list (you may need to install the Vercel GitHub App if you haven't already).
   - Click **Import**.

3. **Configure Project:**
   - **Framework Preset:** `Vite` should be auto-detected.
   - **Root Directory:** `./`
   - **Build Command:** `npm run build` (or `vite build`)
   - **Output Directory:** `dist`
   - **Environment Variables:** None required for this project.

4. **Deploy:**
   - Click **Deploy**.
   - Wait ~1 minute.
   - You will get a live URL (e.g., `https://scada-design-challenge.vercel.app`).

---

## Option 2: Deploy to Netlify

1. **Go to Netlify Dashboard:**
   - Log in to [netlify.com](https://www.netlify.com).
   - Click **Add new site** -> **Import from existing project**.

2. **Connect to Git Provider:**
   - Select **GitHub**.
   - Authorize Netlify if prompted.
   - Select the `SCADA-design-challenge` repository.

3. **Build Settings:**
   - **Base directory:** (leave empty)
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

4. **Deploy:**
   - Click **Deploy Site**.
   - Wait ~1 minute.
   - You will get a live URL (e.g., `https://scada-design-challenge.netlify.app`).

---

## Local Development
To run locally:
```bash
npm install
npm run dev
```
Open http://localhost:5173
