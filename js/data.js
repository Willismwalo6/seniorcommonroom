/* COMMON ROOM — site data & configuration.
   Edit CONFIG below (WhatsApp number, contacts, delivery zones) — everything else updates automatically. */
window.CR = window.CR || {};
(function (CR) {
  CR.CONFIG = {
    name: 'COMMON ROOM',
    /* WhatsApp number: country code + number, digits only */
    whatsapp: '254791636416',
    phone: '+254 791 636 416',
    email: 'hello@commonroom.co.ke',
    location: 'Egerton University, Njoro, Nakuru County, Kenya',
    open: 8, close: 22, hoursLabel: '8:00 AM – 10:00 PM',
    /* Shows a small "sample feedback" note under the reviews. Set to false once you add real student reviews. */
    sampleReviewsNotice: false,
    delivery: {
      minOrder: 'To be confirmed',
      time: 'To be confirmed',
      /* Edit/add zones and fees here when ready. */
      zones: [
        { zone: 'CBD hostels', note: 'Priority coverage', fee: 'To be confirmed' },
        { zone: 'Hostels near campus', note: 'Priority coverage', fee: 'To be confirmed' },
        { zone: 'Other hostels', note: 'Ask us on WhatsApp first', fee: 'To be confirmed' }
      ]
    }
  };

  CR.CATS = [
    { id: 'breakfast', short: 'Breakfast', name: 'Breakfast & Eggs', blurb: 'Eggs, ndazi, chapati and fresh fruit to start your day.' },
    { id: 'legumes', short: 'Legumes & Rice', name: 'Legumes, Grains & Rice', blurb: 'Beans, ndengu, lentils, githeri and pilau — filling and pocket-friendly.' },
    { id: 'chicken-fish', short: 'Chicken & Fish', name: 'Chicken & Fish', blurb: 'Broiler, kienyeji, tilapia and fish fillet plates.' },
    { id: 'beef', short: 'Beef & Offal', name: 'Beef & Offal', blurb: 'Beef wet fry, liver and matumbo, your way.' },
    { id: 'beverages', short: 'Beverage', name: 'Beverages', blurb: 'Tea, coffee, milk and white chocolate.' },
    { id: 'snacks', short: 'Snack', name: 'Snacks', blurb: 'Sausage, samosas and smokies for between lectures.' }
  ];

  /* [category, name, price (KSh), short description] */
  const RAW = [
    ['breakfast', '2 Eggs Spanish Omelette', 100, 'Two eggs folded with onion, tomato and pepper.'],
    ['breakfast', '2 Eggs Scrambled Plain', 100, 'Soft, fluffy scrambled eggs — simple and quick.'],
    ['breakfast', '2 Eggs Plain Omelette', 80, 'A classic two-egg omelette, light and golden.'],
    ['breakfast', 'Eggs Scrambled, Ugali & Veges', 140, 'Scrambled eggs with a hearty serving of ugali and veges.'],
    ['breakfast', 'Ndazi', 20, 'Soft, sweet fried dough — the campus snack classic.'],
    ['breakfast', 'Chapati', 30, 'Soft, layered chapati, cooked fresh.'],
    ['breakfast', 'Fruit Cuts', 50, 'Fresh seasonal fruit, cut and ready to eat.'],

    ['legumes', 'Beans, Chapati & 2 Veges', 130, 'Slow-cooked beans with soft chapati and two veges.'],
    ['legumes', 'Beans, Rice & Veges', 100, 'Savoury beans over rice with veges on the side.'],
    ['legumes', 'Beans Plain', 70, 'A bowl of well-seasoned beans.'],
    ['legumes', 'Green Grams (Ndengu), Rice & Veges', 110, 'Creamy ndengu with rice and fresh veges.'],
    ['legumes', 'Green Grams, Chapati & 2 Veges', 140, 'Ndengu with soft chapati and two veges.'],
    ['legumes', 'Green Grams', 80, 'A bowl of home-style green grams.'],
    ['legumes', 'Green Peas, Rice & Veges', 110, 'Tender green peas with rice and veges.'],
    ['legumes', 'Green Peas, 2 Chapati & Veges', 140, 'Green peas with two chapati and veges.'],
    ['legumes', 'Lentils, Rice & Veges', 110, 'Hearty lentils served with rice and veges.'],
    ['legumes', 'Lentils, 2 Chapati & Veges', 140, 'Lentils with two chapati and veges.'],
    ['legumes', 'Pilau & Veges', 110, 'Fragrant spiced rice served with fresh veges.'],
    ['legumes', 'Githeri & Veges', 90, 'Maize and beans, slow-cooked and served with veges.'],
    ['legumes', 'Githeri Special & Veges', 130, 'A richer, fully loaded githeri with veges.'],
    ['legumes', 'Rice & Veges', 60, 'Plain rice with a side of veges.'],
    ['legumes', 'Ugali & Veges', 60, 'Ugali with a side of veges — the budget classic.'],

    ['chicken-fish', 'Chicken (Broiler), Ugali/Rice & Veges', 350, 'Juicy broiler chicken with your choice of ugali or rice, plus veges.'],
    ['chicken-fish', 'Chicken (Kienyeji), Ugali/Rice & Veges', 450, 'Kienyeji chicken with your choice of ugali or rice, plus veges.'],
    ['chicken-fish', 'Chicken (Broiler), 2 Chapati & Veges', 380, 'Broiler chicken with two chapati and veges.'],
    ['chicken-fish', 'Chicken (Kienyeji), 2 Chapati & Veges', 430, 'Kienyeji chicken with two chapati and veges.'],
    ['chicken-fish', 'Chicken (K.T.A.)', 400, 'Kienyeji chicken, packed for takeaway.'],
    ['chicken-fish', 'Chicken B Plain (T/A)', 300, 'Plain broiler chicken, packed for takeaway.'],
    ['chicken-fish', 'Whole Fish, Ugali/Rice & Veges', 450, 'A whole fish with your choice of ugali or rice, plus veges.'],
    ['chicken-fish', 'Whole Fish, Chapati & Veges', 480, 'A whole fish with chapati and veges.'],
    ['chicken-fish', 'Whole Fish Plain (T/A)', 400, 'Whole fish on its own, packed for takeaway.'],
    ['chicken-fish', 'Fish (Tilapia)', 450, 'Tilapia, the lake-side favourite.'],
    ['chicken-fish', 'Fish Fillet, Ugali/Rice & Veges', 460, 'Boneless fish fillet with your choice of ugali or rice, plus veges.'],
    ['chicken-fish', 'Fish Fillet, 2 Chapati & Veges', 480, 'Boneless fish fillet with two chapati and veges.'],

    ['beef', 'Beef Wet Fry, Ugali/Rice & Veges', 170, 'Tender beef in a rich wet fry, with ugali or rice and veges.'],
    ['beef', 'Beef, 2 Chapati & Veges', 200, 'Beef served with two chapati and veges.'],
    ['beef', 'Liver, 2 Chapati & Eggs', 430, 'Liver with two chapati and eggs.'],
    ['beef', 'Matumbo Panfry, Ugali/Rice & Veges', 300, 'Pan-fried matumbo with ugali or rice and veges.'],
    ['beef', 'Matumbo, Ugali/Rice & Veges', 140, 'Matumbo with ugali or rice and veges.'],
    ['beef', 'Matumbo, 2 Chapati & Veges', 170, 'Matumbo with two chapati and veges.'],

    ['beverages', 'Milk (Mug)', 100, 'A warm mug of milk.'],
    ['beverages', 'Tea (Mug, Mixed)', 30, 'Mixed tea in a mug — quick and comforting.'],
    ['beverages', 'Standard Tea (Mug)', 50, 'Standard tea, hot and simple.'],
    ['beverages', 'Standard Tea Pot (2 Mugs)', 100, 'A pot of tea, enough for two mugs.'],
    ['beverages', 'White Chocolate (Mug)', 50, 'A creamy mug of white chocolate.'],
    ['beverages', 'White Coffee (Mug)', 50, 'Coffee with milk, served hot.'],
    ['beverages', 'Black Coffee (Mug)', 30, 'Strong black coffee for long study nights.'],

    ['snacks', 'Sausage', 50, 'A hot, savoury sausage.'],
    ['snacks', 'Samosas (Beef)', 50, 'Crispy samosas with a beef filling.'],
    ['snacks', 'Smokie', 40, 'A hot smokie — quick, tasty, easy.']
  ];

  const slug = s => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  CR.slug = slug;
  CR.ITEMS = RAW.map(([cat, name, price, desc]) => ({
    id: slug(name), cat, name, price, desc,
    opts: /ugali\/rice/i.test(name) ? ['Ugali', 'Rice'] : null,
    img: 'images/menu/' + slug(name) + '.jpg',      /* meal photo: images/menu/<id>.jpg */
    fb: 'images/categories/' + cat + '.jpg'          /* fallback photo per category */
  }));
  CR.byId = Object.fromEntries(CR.ITEMS.map(i => [i.id, i]));
  CR.find = n => CR.ITEMS.find(i => i.name === n);

  CR.HERO = ['Chicken (Broiler), Ugali/Rice & Veges', 'Pilau & Veges', 'Beans, Chapati & 2 Veges', 'Fish Fillet, Ugali/Rice & Veges', '2 Eggs Spanish Omelette'];
  CR.POPULAR = [
    'Chicken (Broiler), Ugali/Rice & Veges',
    'Chicken (Kienyeji), Ugali/Rice & Veges',
    'Whole Fish, Ugali/Rice & Veges',
    'Fish Fillet, Ugali/Rice & Veges',
    'Pilau & Veges',
    'Beans, Chapati & 2 Veges',
    'Beef Wet Fry, Ugali/Rice & Veges',
    'Githeri Special & Veges',
    'Green Grams (Ndengu), Rice & Veges',
    'Lentils, 2 Chapati & Veges',
    '2 Eggs Spanish Omelette',
    'Eggs Scrambled, Ugali & Veges',
    'Chapati',
    'Ndazi',
    'Samosas (Beef)',
    'Smokie',
    'Sausage',
    'Tea (Mug, Mixed)',
    'White Coffee (Mug)',
    'Matumbo, Ugali/Rice & Veges'
  ];

  /* Student reviews */
  CR.REVIEWS = [
    { q: "Honestly, this place has become my go-to spot between lectures. The food is always fresh, portions are generous, and the prices are student-friendly. Definitely worth it!", n: 'Bridgitte Ndungu', c: 'BSc. Computer Science · 3rd Year', r: '5.0' },
    { q: "I love the atmosphere here! It's a great place to grab lunch with friends, relax after class, and enjoy a good meal without spending too much.", n: 'Faith Wanjiku', c: 'Bachelor of Commerce · 2nd Year', r: '5.0' },
    { q: "Quick service, delicious food, and affordable prices. Even when I'm rushing between classes, I can always count on getting something good without waiting too long.", n: 'Kevin Mwangi', c: 'BSc. Information Technology · 4th Year', r: '4.8' },
    { q: "The food is amazing, and the environment is so welcoming. It's one of those places where you can enjoy a proper meal and catch up with your friends.", n: 'Sharon Achieng', c: 'Bachelor of Education · 3rd Year', r: '5.0' },
    { q: "As a student, finding good food at reasonable prices matters. This restaurant gets it right. Great meals, friendly staff, and a convenient location!", n: 'Daniel Otieno', c: 'Criminology & Security Studies · 2nd Year', r: '4.9' }
  ];

  /* Gallery — images/gallery/g1.jpg … g15.jpg */
  CR.GALLERY = [
    { cat: 'chicken-fish', cap: 'Chicken stew, ugali and sukuma', cls: 'wide' },
    { cat: 'stews', cap: 'Potato and peas stew with chapati', cls: 'tall' },
    { cat: 'stews', cap: 'Beef with spinach and rice', cls: 'tall' },
    { cat: 'stews', cap: 'Beef and potato stew with rice', cls: '' },
    { cat: 'rice', cap: 'Fried cabbage with rice', cls: 'tall' },
    { cat: 'stews', cap: 'Braised beef with rice', cls: 'tall' },
    { cat: 'stews', cap: 'Ugali with beef stew and greens', cls: 'tall' },
    { cat: 'breakfast', cap: 'Black coffee', cls: 'tall' },
    { cat: 'chicken-fish', cap: 'Whole fried tilapia', cls: 'tall' },
    { cat: 'chicken-fish', cap: 'Chicken stew with rice', cls: 'tall' },
    { cat: 'chicken-fish', cap: 'Chicken, rice and sukuma', cls: '' },
    { cat: 'rice', cap: 'Pilau', cls: 'tall' },
    { cat: 'rice', cap: 'Pilau with kachumbari', cls: 'tall' },
    { cat: 'stews', cap: 'Peas stew with chapati', cls: 'tall' },
    { cat: 'breakfast', cap: 'Scrambled eggs and chapati', cls: 'tall' },
    { cat: 'rice', cap: 'Rice and lentils', cls: 'wide' },
    { cat: 'chicken-fish', cap: 'Chicken stew, ugali and sukuma', cls: '' }
  ].map((g, i) => Object.assign(g, { src: 'images/gallery/g' + (i + 1) + '.jpg' }));
})(window.CR);
