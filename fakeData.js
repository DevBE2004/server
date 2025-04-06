const { faker } = require("@faker-js/faker");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Kết nối MongoDB
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Import models - Đảm bảo thứ tự import không gây lỗi
const User = require("./models/user");
const Product = require("./models/product");
const Order = require("./models/order");
const Warrantie = require("./models/warrantie");

// Danh mục và dữ liệu mẫu
const directories = [
  "Chăm sóc răng",
  "Chỉnh nha",
  "Phẫu thuật",
  "Vật liệu nha khoa",
  "Thiết bị phòng khám",
  "Dụng cụ nha khoa",
  "Vệ sinh răng miệng",
];

const categories = [
  "Dụng cụ đa khoa",
  "Thuốc tẩy trắng",
  "Đá gắn răng thẩm mỹ",
  "Vật liệu hàn răng",
  "Dụng cụ chỉnh nha",
  "Dụng cụ phẫu thuật",
  "Thiết bị phòng khám",
  "Vật tư tiêu hao",
  "Dụng cụ nội nha",
  "Dụng cụ nha chu",
];

const productNames = [
  "Cây thăm dò nha khoa",
  "Thước đo nha chu",
  "Bộ tẩy trắng răng tại nhà",
  "Bộ tẩy trắng răng chuyên nghiệp",
  "Đá gắn răng sứ Zirconia",
  "Đá gắn răng Emax",
  "Composite hàn răng A2",
  "Composite hàn răng A3",
  "Máng chỉnh nha trong suốt",
  "Mắc cài kim loại",
  "Mắc cài sứ",
  "Dây cung chỉnh nha",
  "Kìm nhổ răng",
  "Kìm phẫu thuật",
  "Máy đo tủy điện tử",
  "Máy hàn siêu âm",
  "Găng tay nha khoa",
  "Khẩu trang phẫu thuật",
  "Bơm tiêm nha khoa",
  "Kim tiêm vô trùng",
  "Mũi khoan FG",
  "Mũi khoan RA",
  "Dũa nội nha",
  "Trâm nội nha",
  "Cây nạo nha chu",
  "Bột lấy dấu Alginate",
  "Silicon lấy dấu",
  "Gel cầm máu",
  "Thuốc tê Lidocaine",
  "Thuốc sát trùng Chlorhexidine",
  "Bàn chải nha khoa",
  "Chỉ nha khoa",
  "Nước súc miệng",
  "Máy lấy cao răng",
  "Đèn quang trùng hợp",
  "Máy X-quang di động",
  "Máy đo pH nước bọt",
  "Máy khử trùng dụng cụ",
  "Ghế nha khoa",
  "Đèn khám răng",
  "Bộ dụng cụ khám tổng quát",
  "Gương khám răng",
  "Kìm gắp cotton",
  "Bộ mũi khoan đa năng",
  "Bộ dụng cụ nhổ răng",
  "Bộ dụng cụ trám răng",
  "Bộ dụng cụ lấy tủy",
  "Bộ dụng cụ cạo vôi",
  "Bộ dụng cụ phẫu thuật",
  "Bộ dụng cụ cắm implant",
  "Bộ dụng cụ chỉnh hình",
  "Bộ dụng cụ nắn chỉnh",
  "Bộ dụng cụ chữa tủy",
  "Bộ dụng cụ chữa nha chu",
  "Bộ dụng cụ gây tê",
  "Bộ dụng cụ tiểu phẫu",
];

const getDirectoryForCategory = (category) => {
  if (
    category.includes("tẩy trắng") ||
    category.includes("răng thẩm mỹ") ||
    category.includes("hàn răng")
  ) {
    return "Chăm sóc răng";
  } else if (category.includes("chỉnh nha")) {
    return "Chỉnh nha";
  } else if (category.includes("phẫu thuật")) {
    return "Phẫu thuật";
  } else if (category.includes("Vật liệu")) {
    return "Vật liệu nha khoa";
  } else if (category.includes("Thiết bị")) {
    return "Thiết bị phòng khám";
  } else if (category.includes("tiêu hao") || category.includes("vệ sinh")) {
    return "Vệ sinh răng miệng";
  } else {
    return "Dụng cụ nha khoa";
  }
};

// Tạo user giả
const generateUsers = async (count = 15) => {
  const users = [];

  // Tạo admin
  const admin = new User({
    name: "Quản Trị Viên",
    email: "admin@nhakhoa.com",
    password: await bcrypt.hash("admin123", 10),
    role: "ADMIN",
    mobile: "09" + faker.string.numeric(8),
    profilePic: faker.image.avatar(),
    address: faker.location.streetAddress(true),
  });
  users.push(admin);

  // Tạo bác sĩ
  const doctor = new User({
    name: "Bác Sĩ Nguyễn Văn A",
    email: "bacsi@nhakhoa.com",
    password: await bcrypt.hash("bacsi123", 10),
    role: "USER",
    mobile: "09" + faker.string.numeric(8),
    profilePic: faker.image.avatar(),
    address: faker.location.streetAddress(true),
  });
  users.push(doctor);

  // Tạo user thường
  for (let i = 0; i < count - 2; i++) {
    const user = new User({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: await bcrypt.hash("user123", 10),
      role: "USER",
      mobile: "09" + faker.string.numeric(8),
      profilePic: faker.image.avatar(),
      address: faker.location.streetAddress(true),
    });
    users.push(user);
  }

  return User.insertMany(users);
};

// Tạo sản phẩm giả
const generateProducts = async (count = 50) => {
  const products = [];

  for (let i = 0; i < count; i++) {
    const originalPrice = faker.commerce.price({
      min: 50000,
      max: 5000000,
      dec: 0,
    });
    const salePrice = Math.round(
      originalPrice * (1 - faker.number.float({ min: 0.05, max: 0.3 }))
    );
    const category = categories[i % categories.length];
    const directory = getDirectoryForCategory(category);

    const product = new Product({
      title: productNames[i % productNames.length],
      description: `Sản phẩm ${
        productNames[i % productNames.length]
      } chất lượng cao, xuất xứ rõ ràng, phù hợp cho nha khoa. ${faker.lorem.paragraph()}`,
      category: category,
      directory: directory,
      originalPrice: originalPrice,
      salePrice: salePrice,
      productPics: Array.from({ length: 3 }, () =>
        faker.image.urlLoremFlickr({ category: "dental" })
      ),
      quantity: faker.number.int({ min: 5, max: 100 }),
      isLiquidation: faker.datatype.boolean({ probability: 0.15 }),
    });
    products.push(product);
  }

  return Product.insertMany(products);
};

// Tạo bảo hành giả
const generateWarranties = async (products) => {
  const warranties = [];
  const eligibleProducts = products.filter(
    (product) =>
      !product.category.includes("Vật tư tiêu hao") &&
      !product.category.includes("tiêu hao")
  );

  for (const product of eligibleProducts) {
    if (faker.datatype.boolean({ probability: 0.8 })) {
      const warrantie = new Warrantie({
        productId: product._id,
        durationMonths: faker.helpers.arrayElement([6, 12, 18, 24, 36]),
        terms: `Điều kiện bảo hành cho sản phẩm ${
          product.title
        }:\n1. Bảo hành ${faker.helpers.arrayElement([
          "lỗi kỹ thuật",
          "hư hỏng do nhà sản xuất",
        ])}\n2. ${faker.lorem.sentence()}\n3. ${faker.lorem.sentence()}`,
      });
      warranties.push(warrantie);
    }
  }

  return Warrantie.insertMany(warranties);
};

// Tạo đơn hàng giả
const generateOrders = async (users, products, count = 100) => {
  const orders = [];

  for (let i = 0; i < count; i++) {
    const user = faker.helpers.arrayElement(users);
    const productCount = faker.number.int({ min: 1, max: 6 });
    const orderProducts = [];

    // Chọn sản phẩm ngẫu nhiên không trùng lặp
    const selectedProducts = faker.helpers.arrayElements(
      products,
      productCount
    );

    for (const product of selectedProducts) {
      orderProducts.push({
        product: product._id,
        quantity: faker.number.int({ min: 1, max: 5 }),
      });
    }

    const order = new Order({
      products: orderProducts,
      status: faker.helpers.arrayElement(["chưa xử lí", "thành công"]),
      orderBy: user._id,
      orderIdMomo: `MOMO${faker.string.numeric(10)}`,
    });
    orders.push(order);
  }

  return Order.insertMany(orders);
};

// Hàm chính để tạo dữ liệu
const generateAllData = async () => {
  try {
    // Xóa dữ liệu cũ
    await mongoose.connection.dropDatabase();
    console.log("Đã xóa dữ liệu cũ");

    // Tạo dữ liệu mới theo thứ tự đúng
    console.log("Đang tạo người dùng...");
    const users = await generateUsers();
    console.log(`Đã tạo ${users.length} người dùng`);

    console.log("Đang tạo sản phẩm...");
    const products = await generateProducts();
    console.log(`Đã tạo ${products.length} sản phẩm`);

    console.log("Đang tạo chính sách bảo hành...");
    const warranties = await generateWarranties(products);
    console.log(`Đã tạo ${warranties.length} chính sách bảo hành`);

    console.log("Đang tạo đơn hàng...");
    const orders = await generateOrders(users, products);
    console.log(`Đã tạo ${orders.length} đơn hàng`);

    console.log("Hoàn thành tạo dữ liệu giả!");
  } catch (error) {
    console.error("Lỗi khi tạo dữ liệu:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Chạy chương trình
generateAllData();