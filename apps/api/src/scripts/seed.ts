import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from '../config/index.js';
import { User } from '../models/User.model.js';
import { Category } from '../models/Category.model.js';
import { Product } from '../models/Product.model.js';
import { Coupon } from '../models/Coupon.model.js';
import { StoreSettings } from '../models/StoreSettings.model.js';
import { Review } from '../models/Review.model.js';

export const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB for seeding...');
    await mongoose.connect(config.mongoUri);
    console.log('Clearing existing collections...');

    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Coupon.deleteMany({}),
      StoreSettings.deleteMany({}),
      Review.deleteMany({}),
    ]);

    console.log('🌱 Seeding Users...');
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('SmashdAdmin@2026', salt);
    const customerPassword = await bcrypt.hash('Customer@2026', salt);

    const adminUser = await User.create({
      name: 'Executive Chef Admin',
      email: 'admin@smashd.com',
      phone: '9876543210',
      passwordHash: adminPassword,
      role: 'admin',
      isEmailVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      addresses: [
        {
          label: 'Work',
          street: '101 Gourmet Boulevard, Central Kitchen',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400050',
          isDefault: true,
        },
      ],
    });

    const customerUser = await User.create({
      name: 'Rohan Sharma',
      email: 'customer@gmail.com',
      phone: '9812345678',
      passwordHash: customerPassword,
      role: 'customer',
      isEmailVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
      addresses: [
        {
          label: 'Home',
          street: 'Flat 402, Sea Breeze Apts, Bandra West',
          landmark: 'Near Carter Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400050',
          isDefault: true,
        },
      ],
    });

    console.log('🌱 Seeding Categories...');
    const categories = await Category.create([
      {
        name: 'Smash Burgers',
        slug: 'smash-burgers',
        description: 'Crispy lace-edged 100% prime Angus patties smashed on 450°F seasoned iron.',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
        icon: 'Flame',
        sortOrder: 1,
        isActive: true,
      },
      {
        name: 'Crispy Chicken',
        slug: 'crispy-chicken',
        description: '24-hour buttermilk brined double-fried chicken with fiery dry rubs and glazes.',
        image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80',
        icon: 'Drumstick',
        sortOrder: 2,
        isActive: true,
      },
      {
        name: 'Plant & Veg',
        slug: 'plant-and-veg',
        description: 'Chef-crafted portobello, charred paneer, and truffle black bean patties.',
        image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=800&q=80',
        icon: 'Leaf',
        sortOrder: 3,
        isActive: true,
      },
      {
        name: 'Loaded Fries & Sides',
        slug: 'loaded-fries-and-sides',
        description: 'Triple-cooked hand-cut Idaho russets topped with cheese fondue and smash sauce.',
        image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80',
        icon: 'Utensils',
        sortOrder: 4,
        isActive: true,
      },
      {
        name: 'Handspun Shakes',
        slug: 'handspun-shakes',
        description: 'Slow-churned Madagascar vanilla custard shakes with artisanal mix-ins.',
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
        icon: 'CupSoda',
        sortOrder: 5,
        isActive: true,
      },
      {
        name: 'Craft Dips & Sauces',
        slug: 'craft-dips',
        description: 'Small-batch scratch sauces made daily in our test kitchen.',
        image: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?auto=format&fit=crop&w=800&q=80',
        icon: 'Sparkles',
        sortOrder: 6,
        isActive: true,
      },
    ]);

    const catMap = new Map(categories.map((c) => [c.slug, c._id]));

    // Common Customization Matrices
    const standardBurgerCustomizations = [
      {
        groupName: 'Patty Count',
        minSelect: 1,
        maxSelect: 1,
        choices: [
          { name: 'Single Smashed Patty', priceDelta: 0, isDefault: true, caloriesDelta: 0 },
          { name: 'Double Smashed Patty (+₹100)', priceDelta: 100, isDefault: false, caloriesDelta: 240 },
          { name: 'Triple Monster Smash (+₹190)', priceDelta: 190, isDefault: false, caloriesDelta: 480 },
        ],
      },
      {
        groupName: 'Artisan Cheese',
        minSelect: 1,
        maxSelect: 1,
        choices: [
          { name: 'Aged Wisconsin Smoked Cheddar', priceDelta: 0, isDefault: true, caloriesDelta: 0 },
          { name: 'Melted American Vintage', priceDelta: 0, isDefault: false, caloriesDelta: 0 },
          { name: 'Swiss Emmental Melt (+₹35)', priceDelta: 35, isDefault: false, caloriesDelta: 40 },
          { name: 'No Cheese', priceDelta: 0, isDefault: false, caloriesDelta: -110 },
        ],
      },
      {
        groupName: 'Bun Selection',
        minSelect: 1,
        maxSelect: 1,
        choices: [
          { name: 'Toasted Hokkaido Milk Brioche', priceDelta: 0, isDefault: true, caloriesDelta: 0 },
          { name: 'Gluten-Free Artisan Potato Bun (+₹40)', priceDelta: 40, isDefault: false, caloriesDelta: -30 },
          { name: 'Crisp Lettuce Wrap (Keto)', priceDelta: 0, isDefault: false, caloriesDelta: -180 },
        ],
      },
      {
        groupName: 'Extra Gourmet Add-ons',
        minSelect: 0,
        maxSelect: 4,
        choices: [
          { name: 'Smoked Applewood Bacon Strips', priceDelta: 75, caloriesDelta: 140 },
          { name: 'Slow-Caramelized Balsamic Onions', priceDelta: 35, caloriesDelta: 50 },
          { name: 'Pickled Habanero & Jalapeños', priceDelta: 25, caloriesDelta: 15 },
          { name: 'Black Truffle Butter Glaze', priceDelta: 60, caloriesDelta: 90 },
        ],
      },
    ];

    console.log('🌱 Seeding Products...');
    const products = await Product.create([
      {
        name: 'The OG Double Smash',
        slug: 'the-og-double-smash',
        description:
          'Two ultra-crispy smashed beef patties, double aged smoked cheddar, house-brined dill pickles, charred onions, and our legendary secret Umami Smash Sauce on toasted brioche.',
        shortDescription: 'Double Angus smash, aged cheddar, pickles & umami smash sauce',
        price: 329,
        compareAtPrice: 389,
        images: [
          'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1000&q=80',
        ],
        category: catMap.get('smash-burgers'),
        ingredients: [
          'Double Angus Beef Patties',
          'Aged Smoked Cheddar',
          'Dill Pickles',
          'Sweet Charred Onions',
          'Umami Smash Sauce',
          'Butter-Toasted Brioche Bun',
        ],
        nutritionalInformation: {
          calories: 780,
          proteinGrams: 42,
          carbsGrams: 38,
          fatGrams: 48,
        },
        customizationOptions: standardBurgerCustomizations,
        spiceLevel: 1,
        preparationTimeMinutes: 12,
        isFeatured: true,
        isAvailable: true,
        isVegetarian: false,
        sortOrder: 1,
        ratingAverage: 4.9,
        ratingCount: 184,
      },
      {
        name: 'Truffle Umami Melt',
        slug: 'truffle-umami-melt',
        description:
          'Double smashed patty glazed with black summer truffle butter, sauteed portobello mushroom ragout, melted Swiss gruyère, and roasted garlic confit aioli.',
        shortDescription: 'Double smash, black truffle glaze, sauteed portobello & gruyère melt',
        price: 429,
        compareAtPrice: 489,
        images: [
          'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80',
        ],
        category: catMap.get('smash-burgers'),
        ingredients: [
          'Double Angus Beef Patties',
          'Black Truffle Butter',
          'Portobello Ragout',
          'Swiss Gruyère Cheese',
          'Garlic Confit Aioli',
          'Toasted Brioche',
        ],
        nutritionalInformation: {
          calories: 840,
          proteinGrams: 44,
          carbsGrams: 36,
          fatGrams: 54,
        },
        customizationOptions: standardBurgerCustomizations,
        spiceLevel: 0,
        preparationTimeMinutes: 14,
        isFeatured: true,
        isAvailable: true,
        isVegetarian: false,
        sortOrder: 2,
        ratingAverage: 5.0,
        ratingCount: 142,
      },
      {
        name: 'Smoky BBQ Bacon Beast',
        slug: 'smoky-bbq-bacon-beast',
        description:
          'Smashed patties layered with thick crispy applewood smoked bacon, molten cheddar, crispy tobacco onion rings, and Texas bourbon hickory BBQ reduction.',
        shortDescription: 'Double smash, applewood bacon, crisp onion straws & bourbon BBQ',
        price: 379,
        compareAtPrice: 429,
        images: [
          'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1000&q=80',
        ],
        category: catMap.get('smash-burgers'),
        ingredients: [
          'Double Angus Beef Patties',
          'Applewood Bacon',
          'Smoked Cheddar',
          'Crispy Fried Onions',
          'Bourbon BBQ Sauce',
          'Potato Bun',
        ],
        nutritionalInformation: {
          calories: 890,
          proteinGrams: 46,
          carbsGrams: 48,
          fatGrams: 56,
        },
        customizationOptions: standardBurgerCustomizations,
        spiceLevel: 1,
        preparationTimeMinutes: 15,
        isFeatured: true,
        isAvailable: true,
        isVegetarian: false,
        sortOrder: 3,
        ratingAverage: 4.8,
        ratingCount: 98,
      },
      {
        name: 'Nashville Hot Firebird',
        slug: 'nashville-hot-firebird',
        description:
          'Double-dredged crispy buttermilk chicken breast dunked in fiery Nashville chili oil, topped with sweet honey-butter drizzle, vinegar slaw, and bread-and-butter pickles.',
        shortDescription: 'Buttermilk crispy chicken, fiery chili oil dip, vinegar slaw & honey',
        price: 349,
        compareAtPrice: 399,
        images: [
          'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=1000&q=80',
        ],
        category: catMap.get('crispy-chicken'),
        ingredients: [
          '24-hr Buttermilk Brined Chicken',
          'Nashville Cayenne Chili Oil',
          'Crispy Cider Slaw',
          'Honey Butter Drizzle',
          'Bread & Butter Pickles',
          'Potato Bun',
        ],
        nutritionalInformation: {
          calories: 740,
          proteinGrams: 39,
          carbsGrams: 49,
          fatGrams: 41,
        },
        customizationOptions: [
          {
            groupName: 'Heat Level',
            minSelect: 1,
            maxSelect: 1,
            choices: [
              { name: 'Mild Honey Kick', priceDelta: 0, isDefault: false },
              { name: 'Medium Nashville Heat', priceDelta: 0, isDefault: true },
              { name: 'Inferno Reaper (+₹20)', priceDelta: 20, isDefault: false },
            ],
          },
        ],
        spiceLevel: 3,
        preparationTimeMinutes: 14,
        isFeatured: true,
        isAvailable: true,
        isVegetarian: false,
        sortOrder: 4,
        ratingAverage: 4.9,
        ratingCount: 165,
      },
      {
        name: 'Korean Gochujang Crunch',
        slug: 'korean-gochujang-crunch',
        description:
          'Super-crispy chicken thigh tossed in sticky sweet-spicy fermented Gochujang glaze, sesame kimchi crunch slaw, kewpie mayo, and toasted sesame brioche.',
        shortDescription: 'Crispy fried chicken, sticky gochujang glaze, kimchi slaw & kewpie',
        price: 359,
        images: [
          'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=1000&q=80',
        ],
        category: catMap.get('crispy-chicken'),
        ingredients: [
          'Crispy Chicken Thigh',
          'Sticky Gochujang Glaze',
          'Sesame Kimchi Slaw',
          'Japanese Kewpie Mayo',
          'Toasted Brioche',
        ],
        nutritionalInformation: {
          calories: 720,
          proteinGrams: 38,
          carbsGrams: 52,
          fatGrams: 39,
        },
        customizationOptions: [],
        spiceLevel: 2,
        preparationTimeMinutes: 13,
        isFeatured: false,
        isAvailable: true,
        isVegetarian: false,
        sortOrder: 5,
        ratingAverage: 4.7,
        ratingCount: 84,
      },
      {
        name: 'Smoked Paneer Royale',
        slug: 'smoked-paneer-royale',
        description:
          'Charred tandoori spiced artisanal cottage cheese steak, mint-coriander emulsion, pickled red onions, roasted red pepper relish, and crispy onion crunch.',
        shortDescription: 'Spiced cottage cheese steak, mint emulsion & charred pepper relish',
        price: 289,
        compareAtPrice: 329,
        images: [
          'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=1000&q=80',
        ],
        category: catMap.get('plant-and-veg'),
        ingredients: [
          'Spiced Paneer Steak',
          'Mint Herb Emulsion',
          'Pickled Red Onions',
          'Smoked Bell Pepper Relish',
          'Brioche Bun',
        ],
        nutritionalInformation: {
          calories: 610,
          proteinGrams: 28,
          carbsGrams: 42,
          fatGrams: 36,
        },
        customizationOptions: standardBurgerCustomizations,
        spiceLevel: 1,
        preparationTimeMinutes: 12,
        isFeatured: true,
        isAvailable: true,
        isVegetarian: true,
        sortOrder: 6,
        ratingAverage: 4.8,
        ratingCount: 112,
      },
      {
        name: 'Black Bean & Truffle Portobello',
        slug: 'black-bean-and-truffle-portobello',
        description:
          'Handmade roasted black bean & smoked quinoa patty, topped with garlic-herb grilled portobello cap, vegan smoked gouda, and truffle veganaise.',
        shortDescription: 'Roasted black bean patty, grilled portobello mushroom & truffle mayo',
        price: 319,
        images: [
          'https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=1000&q=80',
        ],
        category: catMap.get('plant-and-veg'),
        ingredients: [
          'Black Bean Quinoa Patty',
          'Herb Portobello Cap',
          'Smoked Gouda Melt',
          'Truffle Aioli',
          'Butter Lettuce',
        ],
        nutritionalInformation: {
          calories: 540,
          proteinGrams: 22,
          carbsGrams: 58,
          fatGrams: 24,
        },
        customizationOptions: [],
        spiceLevel: 0,
        preparationTimeMinutes: 12,
        isFeatured: false,
        isAvailable: true,
        isVegetarian: true,
        sortOrder: 7,
        ratingAverage: 4.6,
        ratingCount: 76,
      },
      {
        name: 'Truffle Parmesan Smashed Fries',
        slug: 'truffle-parmesan-fries',
        description:
          'Triple-cooked skin-on Idaho russets tossed in white truffle oil, freshly grated aged Reggiano Parmesan, fresh rosemary, and garlic aioli dip.',
        shortDescription: 'Skin-on russet fries, white truffle oil, grated reggiano & rosemary',
        price: 189,
        images: [
          'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=1000&q=80',
        ],
        category: catMap.get('loaded-fries-and-sides'),
        ingredients: ['Idaho Russet Potatoes', 'White Truffle Oil', 'Aged Reggiano', 'Rosemary Salt', 'Garlic Dip'],
        nutritionalInformation: {
          calories: 420,
          proteinGrams: 8,
          carbsGrams: 52,
          fatGrams: 20,
        },
        customizationOptions: [],
        spiceLevel: 0,
        preparationTimeMinutes: 8,
        isFeatured: true,
        isAvailable: true,
        isVegetarian: true,
        sortOrder: 8,
        ratingAverage: 4.9,
        ratingCount: 230,
      },
      {
        name: 'Monster Smash Dirty Fries',
        slug: 'monster-smash-dirty-fries',
        description:
          'Crispy fries smothered in hot cheddar cheese sauce, crushed smashed burger bits, caramelized onions, jalapeño relish, and signature smash sauce.',
        shortDescription: 'Cheddar fondue, smashed patty bits, caramelized onions & smash sauce',
        price: 249,
        images: [
          'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=1000&q=80',
        ],
        category: catMap.get('loaded-fries-and-sides'),
        ingredients: ['Crispy Fries', 'Smoked Cheddar Sauce', 'Smashed Beef Bits', 'Grilled Onions', 'Smash Sauce'],
        nutritionalInformation: {
          calories: 680,
          proteinGrams: 24,
          carbsGrams: 64,
          fatGrams: 36,
        },
        customizationOptions: [],
        spiceLevel: 1,
        preparationTimeMinutes: 10,
        isFeatured: true,
        isAvailable: true,
        isVegetarian: false,
        sortOrder: 9,
        ratingAverage: 5.0,
        ratingCount: 310,
      },
      {
        name: 'Salted Caramel Pretzel Shake',
        slug: 'salted-caramel-pretzel-shake',
        description:
          'Handspun Madagascar vanilla bean ice cream blended with burnt caramel fudge, Maldon sea salt flakes, and buttered pretzel crust crumbs.',
        shortDescription: 'Vanilla custard, burnt salted caramel & crunchy butter pretzel crumble',
        price: 219,
        images: [
          'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=1000&q=80',
        ],
        category: catMap.get('handspun-shakes'),
        ingredients: ['Madagascar Vanilla Ice Cream', 'Burnt Caramel Sauce', 'Pretzel Crumbs', 'Maldon Salt', 'Heavy Cream'],
        nutritionalInformation: {
          calories: 520,
          proteinGrams: 9,
          carbsGrams: 68,
          fatGrams: 22,
        },
        customizationOptions: [],
        spiceLevel: 0,
        preparationTimeMinutes: 6,
        isFeatured: true,
        isAvailable: true,
        isVegetarian: true,
        sortOrder: 10,
        ratingAverage: 4.9,
        ratingCount: 195,
      },
      {
        name: 'Dark Chocolate Fudge Shake',
        slug: 'dark-chocolate-fudge-shake',
        description:
          'Rich Belgian 70% dark cocoa ganache, whole milk gelato, chocolate brownie chunks, and whipped cocoa cream.',
        shortDescription: 'Belgian 70% dark chocolate ganache, gelato & brownie crumble',
        price: 229,
        images: [
          'https://images.unsplash.com/photo-1579954115545-a95591f28be0?auto=format&fit=crop&w=1000&q=80',
        ],
        category: catMap.get('handspun-shakes'),
        ingredients: ['Belgian Dark Chocolate', 'Whole Milk Custard', 'Brownie Chunks', 'Whipped Cream'],
        nutritionalInformation: {
          calories: 560,
          proteinGrams: 11,
          carbsGrams: 72,
          fatGrams: 26,
        },
        customizationOptions: [],
        spiceLevel: 0,
        preparationTimeMinutes: 6,
        isFeatured: false,
        isAvailable: true,
        isVegetarian: true,
        sortOrder: 11,
        ratingAverage: 4.8,
        ratingCount: 140,
      },
    ]);

    console.log('🌱 Seeding Coupons...');
    await Coupon.create([
      {
        code: 'FIRSTBITE20',
        type: 'percentage',
        value: 20,
        minimumOrderValue: 399,
        maximumDiscount: 150,
        expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months
        usageLimit: 1000,
        usedCount: 14,
        isActive: true,
      },
      {
        code: 'SMASHD100',
        type: 'fixed',
        value: 100,
        minimumOrderValue: 499,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        usageLimit: 500,
        usedCount: 22,
        isActive: true,
      },
      {
        code: 'CHEESEFEST50',
        type: 'fixed',
        value: 50,
        minimumOrderValue: 299,
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        usageLimit: 300,
        usedCount: 5,
        isActive: true,
      },
    ]);

    console.log('🌱 Seeding Store Settings...');
    await StoreSettings.create({
      storeName: 'Smash Burger',
      tagline: 'Unapologetic Flavor. Smashed Fresh.',
      deliveryFee: 49,
      freeDeliveryThreshold: 499,
      taxPercentage: 5,
      isOpen: true,
      locations: [
        {
          city: 'Mumbai',
          address: 'Bandra West, Linking Road, Mumbai, MH 400050',
          phone: '+91 98200 12345',
          openingHours: '11:00 AM – 02:00 AM',
          isActive: true,
        },
        {
          city: 'Bengaluru',
          address: 'Indiranagar 100ft Road, Bengaluru, KA 560038',
          phone: '+91 98450 67890',
          openingHours: '11:00 AM – 01:00 AM',
          isActive: true,
        },
        {
          city: 'Delhi NCR',
          address: 'CyberHub, DLF Phase 2, Gurugram, HR 122002',
          phone: '+91 98110 54321',
          openingHours: '11:00 AM – 03:00 AM',
          isActive: true,
        },
        {
          city: 'Hyderabad',
          address: 'Jubilee Hills Road No. 36, Hyderabad, TS 500033',
          phone: '+91 98660 98765',
          openingHours: '12:00 PM – 01:30 AM',
          isActive: true,
        },
        {
          city: 'Pune',
          address: 'Koregaon Park North Main Rd, Pune, MH 411001',
          phone: '+91 98230 45678',
          openingHours: '12:00 PM – 01:00 AM',
          isActive: true,
        },
      ],
    });

    console.log('🌱 Seeding Sample Reviews...');
    if (products.length > 0) {
      await Review.create([
        {
          user: customerUser._id,
          product: products[0]._id,
          rating: 5,
          comment:
            'Absolute perfection. The crust on the smash patty is mindblowing, easily the best burger in Mumbai right now!',
          isApproved: true,
        },
        {
          user: customerUser._id,
          product: products[1]._id,
          rating: 5,
          comment:
            'The truffle butter with the portobello mushroom glaze is out of this world. Super juicy and decadent.',
          isApproved: true,
        },
      ]);
    }

    console.log(`
  ✅ Database Seeded Successfully!
  ==============================================
  👑 Admin Account:
     Email: admin@smashd.com
     Password: SmashdAdmin@2026
     Role: admin

  🍔 Customer Account:
     Email: customer@gmail.com
     Password: Customer@2026
     Role: customer

  🎁 Test Promo Codes:
     - FIRSTBITE20 (20% off min ₹399)
     - SMASHD100 (₹100 off min ₹499)
  ==============================================
    `);

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
};

seedDatabase();
