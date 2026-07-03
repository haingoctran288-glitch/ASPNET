const puppeteer = require('puppeteer-core');
const fs = require('fs');

async function run() {
    const browser = await puppeteer.launch({ 
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: 'new', 
        defaultViewport: { width: 1280, height: 800 } 
    });
    
    console.log('Capturing Frontend...');
    
    try {
        const page = await browser.newPage();
        
        // 1. Home Page
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
        await page.screenshot({ path: 'frontend_home.png' });
        console.log('Saved frontend_home.png');

        // 2. Search
        await page.goto('http://localhost:3000/products?search=giay', { waitUntil: 'networkidle2' });
        await page.screenshot({ path: 'frontend_search.png' });
        console.log('Saved frontend_search.png');

        // 3. Products Filter & Empty State
        await page.goto('http://localhost:3000/products?minPrice=100000000', { waitUntil: 'networkidle2' });
        await page.screenshot({ path: 'frontend_empty_state.png' });
        console.log('Saved frontend_empty_state.png');

        // 4. Cart
        await page.goto('http://localhost:3000/cart', { waitUntil: 'networkidle2' });
        await page.screenshot({ path: 'frontend_cart.png' });
        console.log('Saved frontend_cart.png');
        
        // 5. Login
        await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
        await page.screenshot({ path: 'frontend_login.png' });
        console.log('Saved frontend_login.png');
        
        // Login action
        await page.type('#email', 'an.nguyen@gmail.com');
        await page.type('#password', 'password123');
        await page.click('button[type="submit"]');
        await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(()=>null);
        await page.screenshot({ path: 'frontend_login_success.png' });
        console.log('Saved frontend_login_success.png');
        
        await page.close();
    } catch(e) { console.log('Error frontend:', e); }

    // Backend / Admin (Wait, backend port might be 5173, let's verify)
    console.log('Capturing Backend Admin...');
    try {
        const pageAdmin = await browser.newPage();
        await pageAdmin.goto('http://localhost:5173/Account/Login', { waitUntil: 'networkidle2' });
        await pageAdmin.screenshot({ path: 'admin_login.png' });
        
        await pageAdmin.type('#Email', 'admin');
        await pageAdmin.type('#Password', '123456');
        await pageAdmin.keyboard.press('Enter');
        await pageAdmin.waitForNavigation({ waitUntil: 'networkidle2' }).catch(()=>null);
        
        await pageAdmin.goto('http://localhost:5173/Product', { waitUntil: 'networkidle2' });
        await pageAdmin.screenshot({ path: 'admin_products.png' });
        console.log('Saved admin_products.png');

        await pageAdmin.goto('http://localhost:5173/Post/Create', { waitUntil: 'networkidle2' });
        await pageAdmin.screenshot({ path: 'admin_post_create.png' });
        console.log('Saved admin_post_create.png');

        await pageAdmin.goto('http://localhost:5173/Order', { waitUntil: 'networkidle2' });
        await pageAdmin.screenshot({ path: 'admin_orders.png' });
        console.log('Saved admin_orders.png');
        
        await pageAdmin.close();
    } catch(e) { console.log('Error admin:', e); }

    await browser.close();
    console.log('Done capturing screenshots!');
}

run();
