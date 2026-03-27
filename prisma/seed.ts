import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // ── Users ──────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const userPassword = await bcrypt.hash('User1234!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@compushop.com' },
    update: {},
    create: {
      email: 'admin@compushop.com',
      name: 'Admin CompuShop',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'cliente@compushop.com' },
    update: {},
    create: {
      email: 'cliente@compushop.com',
      name: 'Juan Pérez',
      password: userPassword,
      role: Role.CUSTOMER,
    },
  });

  console.log('Users:', { admin: admin.email, customer: customer.email });

  // ── Categories ─────────────────────────────────────────────
  const laptops = await prisma.category.upsert({
    where: { name: 'Laptops' },
    update: {},
    create: {
      name: 'Laptops',
      description: 'Laptops y notebooks para trabajo, gaming y uso diario',
    },
  });

  const desktops = await prisma.category.upsert({
    where: { name: 'Desktops' },
    update: {},
    create: {
      name: 'Desktops',
      description: 'Computadoras de escritorio armadas y pre-ensambladas',
    },
  });

  const componentes = await prisma.category.upsert({
    where: { name: 'Componentes' },
    update: {},
    create: {
      name: 'Componentes',
      description: 'Procesadores, tarjetas gráficas, memorias RAM y más',
    },
  });

  const perifericos = await prisma.category.upsert({
    where: { name: 'Periféricos' },
    update: {},
    create: {
      name: 'Periféricos',
      description: 'Teclados, mouse, monitores y accesorios',
    },
  });

  console.log('Categories:', [laptops.name, desktops.name, componentes.name, perifericos.name]);

  // ── Products ───────────────────────────────────────────────
  // Product.name is not unique, so we check count and skip if already seeded
  const existingCount = await prisma.product.count();
  if (existingCount > 0) {
    console.log(`Products: skipped (${existingCount} already exist)`);
  } else {
    const products = [
      // Laptops
      {
        name: 'ASUS ROG Strix G16',
        description: 'Laptop gaming con Intel Core i9-14900HX, RTX 4070, 16GB DDR5, 1TB SSD NVMe, pantalla 16" 240Hz',
        price: 1899.99,
        stock: 12,
        imageUrl: 'https://placehold.co/600x400?text=ASUS+ROG+Strix+G16',
        categoryId: laptops.id,
      },
      {
        name: 'MacBook Pro 14" M3 Pro',
        description: 'Apple MacBook Pro con chip M3 Pro, 18GB RAM unificada, 512GB SSD, pantalla Liquid Retina XDR',
        price: 1999.99,
        stock: 8,
        imageUrl: 'https://placehold.co/600x400?text=MacBook+Pro+14',
        categoryId: laptops.id,
      },
      {
        name: 'Lenovo ThinkPad X1 Carbon Gen 11',
        description: 'Ultrabook empresarial con Intel Core i7-1365U, 16GB LPDDR5, 512GB SSD, pantalla 14" 2.8K OLED',
        price: 1549.99,
        stock: 15,
        imageUrl: 'https://placehold.co/600x400?text=ThinkPad+X1+Carbon',
        categoryId: laptops.id,
      },
      // Desktops
      {
        name: 'PC Gaming RTX 4090 Ultimate',
        description: 'Desktop gaming: AMD Ryzen 9 7950X, NVIDIA RTX 4090 24GB, 64GB DDR5, 2TB NVMe Gen4, refrigeración líquida 360mm',
        price: 3499.99,
        stock: 5,
        imageUrl: 'https://placehold.co/600x400?text=PC+Gaming+RTX+4090',
        categoryId: desktops.id,
      },
      {
        name: 'PC Oficina Pro',
        description: 'Desktop productividad: Intel Core i5-14400, 16GB DDR5, 512GB SSD NVMe, Wi-Fi 6E, Windows 11 Pro',
        price: 699.99,
        stock: 25,
        imageUrl: 'https://placehold.co/600x400?text=PC+Oficina+Pro',
        categoryId: desktops.id,
      },
      // Componentes
      {
        name: 'NVIDIA GeForce RTX 4070 Ti Super',
        description: 'Tarjeta gráfica con 16GB GDDR6X, ray tracing 3ra gen, DLSS 3.5, reloj boost 2610 MHz',
        price: 799.99,
        stock: 20,
        imageUrl: 'https://placehold.co/600x400?text=RTX+4070+Ti+Super',
        categoryId: componentes.id,
      },
      {
        name: 'AMD Ryzen 7 7800X3D',
        description: 'Procesador gaming: 8 núcleos / 16 hilos, 3D V-Cache 96MB, socket AM5, 120W TDP',
        price: 349.99,
        stock: 30,
        imageUrl: 'https://placehold.co/600x400?text=Ryzen+7+7800X3D',
        categoryId: componentes.id,
      },
      {
        name: 'Corsair Vengeance DDR5 32GB (2x16GB)',
        description: 'Kit memoria RAM DDR5-6000 CL30, Intel XMP 3.0, disipador de aluminio, optimizado para AMD EXPO',
        price: 109.99,
        stock: 50,
        imageUrl: 'https://placehold.co/600x400?text=Corsair+DDR5+32GB',
        categoryId: componentes.id,
      },
      // Periféricos
      {
        name: 'LG UltraGear 27GP850-B',
        description: 'Monitor gaming 27" QHD 2560x1440, Nano IPS, 180Hz, 1ms GtG, HDR400, compatible G-Sync y FreeSync',
        price: 349.99,
        stock: 18,
        imageUrl: 'https://placehold.co/600x400?text=LG+UltraGear+27',
        categoryId: perifericos.id,
      },
      {
        name: 'Logitech MX Master 3S',
        description: 'Mouse inalámbrico ergonómico, sensor 8000 DPI, scroll MagSpeed, USB-C, Bluetooth, hasta 70 días de batería',
        price: 99.99,
        stock: 40,
        imageUrl: 'https://placehold.co/600x400?text=MX+Master+3S',
        categoryId: perifericos.id,
      },
    ];

    await prisma.product.createMany({ data: products });
    console.log(`Products: ${products.length} created`);
  }

  console.log('Seed completed!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
