const { faker } = require("@faker-js/faker");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Kết nối MongoDB
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Import models
const Category = require("./models/category");
const Directory = require("./models/directory");
const Product = require("./models/product");
const User = require("./models/user");
const Order = require("./models/order");
const Warrantie = require("./models/warrantie");
const New = require("./models/new");
const Banner = require("./models/banner");

// ==================== DỮ LIỆU MẪU ====================
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

const newsTitles = [
  "Công nghệ mới trong điều trị nha chu năm 2023",
  "Hướng dẫn chăm sóc răng miệng đúng cách",
  "Xu hướng chỉnh nha trong suốt tại Việt Nam",
  "Vật liệu hàn răng thế hệ mới - Bước đột phá trong nha khoa",
  "Làm thế nào để chọn bàn chải đánh răng phù hợp",
  "Những sai lầm thường gặp khi vệ sinh răng miệng",
  "Cấy ghép Implant không đau - Công nghệ hiện đại",
  "Tẩy trắng răng an toàn - Những điều cần biết",
  "Phòng ngừa sâu răng ở trẻ em - Bí quyết từ chuyên gia",
  "Chế độ dinh dưỡng tốt cho răng miệng",
  "Các bệnh răng miệng thường gặp và cách phòng tránh",
  "Chăm sóc răng miệng cho người niềng răng",
  "Công nghệ scan răng 3D - Bước tiến mới trong nha khoa",
  "Vì sao cần lấy cao răng định kỳ?",
  "Hướng dẫn sử dụng chỉ nha khoa đúng cách",
  "Những điều cần biết về răng khôn",
  "Phục hình răng sứ thẩm mỹ - Giải pháp hoàn hảo cho nụ cười",
  "Chăm sóc răng miệng cho bà bầu đúng cách",
  "Tác hại của việc nghiến răng khi ngủ và cách khắc phục",
  "Công nghệ điều trị tủy không đau - Giải pháp mới",
];

// ==================== HÀM HỖ TRỢ ====================
const getDirectoryForCategory = (categoryTitle) => {
  if (
    categoryTitle.includes("tẩy trắng") ||
    categoryTitle.includes("răng thẩm mỹ") ||
    categoryTitle.includes("hàn răng")
  ) {
    return "Chăm sóc răng";
  } else if (categoryTitle.includes("chỉnh nha")) {
    return "Chỉnh nha";
  } else if (categoryTitle.includes("phẫu thuật")) {
    return "Phẫu thuật";
  } else if (categoryTitle.includes("Vật liệu")) {
    return "Vật liệu nha khoa";
  } else if (categoryTitle.includes("Thiết bị")) {
    return "Thiết bị phòng khám";
  } else if (
    categoryTitle.includes("tiêu hao") ||
    categoryTitle.includes("vệ sinh")
  ) {
    return "Vệ sinh răng miệng";
  } else {
    return "Dụng cụ nha khoa";
  }
};
// Danh sách các thương hiệu giả định (có thể thay bằng API/Faker nếu cần)
const fakeBrands = [
  "Dược Hậu Giang",
  "Pharbaco",
  "Traphaco",
  "Vinapharm",
  "Sanofi",
  "Bayer",
  "AstraZeneca",
  "Pfizer",
  "Merck",
];

// Danh sách các xuất xứ phổ biến
const fakeOrigins = [
  "Việt Nam",
  "Mỹ",
  "Pháp",
  "Đức",
  "Thụy Sĩ",
  "Nhật Bản",
  "Hàn Quốc",
  "Ấn Độ",
];

// ==================== TẠO DỮ LIỆU ====================
// Tạo danh mục
const generateCategories = async () => {
  const categoryDocs = categories.map((title) => ({ title }));
  return Category.insertMany(categoryDocs);
};

// Tạo thư mục
const generateDirectories = async (categories) => {
  const directoryDocs = directories.map((title) => {
    const matchingCategories = categories.filter(
      (cat) => getDirectoryForCategory(cat.title) === title
    );
    return {
      title,
      category: matchingCategories.map((cat) => cat._id),
      directoryPic: faker.image.url(),
    };
  });
  return Directory.insertMany(directoryDocs);
};

// Tạo người dùng
const generateUsers = async (count = 15) => {
  const users = [
    // Admin
    new User({
      name: "Quản Trị Viên",
      email: "leantu2004@gmail.com",
      password: await bcrypt.hash("leanhtu2004@", 10),
      role: "ADMIN",
      mobile: "09" + faker.string.numeric(8),
      profilePic: faker.image.avatar(),
      address: faker.location.streetAddress(true),
    }),
    // Bác sĩ
    new User({
      name: "Bác Sĩ Nguyễn Văn A",
      email: "bacsi@nhakhoa.com",
      password: await bcrypt.hash("bacsi123", 10),
      role: "USER",
      mobile: "09" + faker.string.numeric(8),
      profilePic: faker.image.avatar(),
      address: faker.location.streetAddress(true),
    }),
  ];

  // Người dùng thường
  for (let i = 0; i < count - 2; i++) {
    users.push(
      new User({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: await bcrypt.hash("user123", 10),
        role: "USER",
        mobile: "09" + faker.string.numeric(8),
        profilePic: faker.image.avatar(),
        address: faker.location.streetAddress(true),
      })
    );
  }

  return User.insertMany(users);
};

// Tạo sản phẩm
const generateProducts = async (categories, directories, count = 70) => {
  const products = [];

  // Tạo map để tra cứu directory theo tên
  const directoryMap = {};
  directories.forEach((dir) => {
    directoryMap[dir.title] = dir._id;
  });

  for (let i = 0; i < count; i++) {
    const category = categories[i % categories.length];
    const directoryName = getDirectoryForCategory(category.title);

    products.push(
      new Product({
        title: productNames[i % productNames.length],
        description: `${
          productNames[i % productNames.length]
        } chất lượng cao, xuất xứ rõ ràng. ${faker.lorem.paragraph()}`,
        category: category._id,
        directory: directoryMap[directoryName],
        originalPrice: faker.commerce.price({
          min: 50000,
          max: 5000000,
          dec: 0,
        }),
        salePrice: faker.commerce.price({ min: 40000, max: 4500000, dec: 0 }),
        productPics: Array(3)
          .fill()
          .map(() => faker.image.urlLoremFlickr({ category: "medical" })),
        quantity: faker.number.int({ min: 5, max: 100 }),
        isLiquidation: faker.datatype.boolean({ probability: 0.15 }),
        isFeatured: faker.datatype.boolean({ probability: 0.15 }),
        brand: faker.helpers.arrayElement(fakeBrands),
        origin: faker.helpers.arrayElement(fakeOrigins),
      })
    );
  }

  return Product.insertMany(products);
};

// Tạo bảo hành
const generateWarranties = async (products, categories) => {
  const warranties = [];

  // Tạo map để tra cứu category theo ID
  const categoryMap = {};
  categories.forEach((cat) => {
    categoryMap[cat._id.toString()] = cat.title;
  });

  const eligibleProducts = products.filter((product) => {
    const categoryTitle = categoryMap[product.category.toString()];
    return !categoryTitle.includes("tiêu hao");
  });

  for (const product of eligibleProducts) {
    if (faker.datatype.boolean({ probability: 0.8 })) {
      warranties.push(
        new Warrantie({
          productId: product._id,
          durationMonths: faker.helpers.arrayElement([6, 12, 18, 24, 36]),
          terms: `Bảo hành ${
            product.title
          }:\n1. ${faker.lorem.sentence()}\n2. ${faker.lorem.sentence()}`,
        })
      );
    }
  }

  return Warrantie.insertMany(warranties);
};

const bannerImages = [
  faker.image.urlLoremFlickr({ width: 1200, height: 400, category: "dental" }),
  faker.image.urlLoremFlickr({ width: 1200, height: 400, category: "medical" }),
  faker.image.urlLoremFlickr({ width: 1200, height: 400, category: "doctor" }),
  faker.image.urlLoremFlickr({ width: 1200, height: 400, category: "clinic" }),
  faker.image.urlLoremFlickr({ width: 1200, height: 400, category: "health" }),
];

const generateBanners = async () => {
  const banners = bannerImages.map((image) => ({
    bannerPic: image,
    status: faker.helpers.arrayElement(["ENABLE", "DISABLE"]),
  }));

  return Banner.insertMany(banners);
};

// Tạo đơn hàng
const generateOrders = async (users, products, count = 100) => {
  const orders = [];

  for (let i = 0; i < count; i++) {
    const orderProducts = faker.helpers
      .arrayElements(products, faker.number.int({ min: 1, max: 6 }))
      .map((product) => ({
        product: product._id,
        quantity: faker.number.int({ min: 1, max: 5 }),
      }));

    orders.push(
      new Order({
        products: orderProducts,
        status: faker.helpers.arrayElement(["UNPAID", "PAID"]),
        orderBy: faker.helpers.arrayElement(users)._id,
        orderIdMomo: `MOMO${faker.string.numeric(10)}`,
      })
    );
  }

  return Order.insertMany(orders);
};

// Tạo tin tức
const generateNews = async (count = 20) => {
  const news = [];

  for (let i = 0; i < count; i++) {
    news.push(
      new New({
        title: newsTitles[i % newsTitles.length],
        description: faker.lorem.paragraphs(3, "\n\n"),
        newPic: faker.image.urlLoremFlickr({ category: "medical" }),
        status: faker.helpers.arrayElement(["ENABLE", "DISABLE"]),
      })
    );
  }

  return New.insertMany(news);
};

// ==================== HÀM CHÍNH ====================
const generateAllData = async () => {
  try {
    console.log("Đang xóa dữ liệu cũ...");
    await mongoose.connection.dropDatabase();

    console.log("Đang tạo banner...");
    await generateBanners();

    console.log("Đang tạo danh mục...");
    const categories = await generateCategories();

    console.log("Đang tạo thư mục...");
    const directories = await generateDirectories(categories);

    console.log("Đang tạo người dùng...");
    const users = await generateUsers();

    console.log("Đang tạo sản phẩm...");
    const products = await generateProducts(categories, directories, 55);

    console.log("Đang tạo bảo hành...");
    await generateWarranties(products, categories);

    console.log("Đang tạo đơn hàng...");
    await generateOrders(users, products, 100);

    console.log("Đang tạo tin tức...");
    await generateNews();

    console.log("✅ Tạo dữ liệu giả thành công!");
  } catch (error) {
    console.error("❌ Lỗi khi tạo dữ liệu:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Chạy chương trình
generateAllData();
