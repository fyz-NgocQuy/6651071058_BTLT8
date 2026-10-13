/* =========================================================
   app.js - Suna Tech Gear: giỏ hàng động với Vue 3 (CDN)
   So sánh: nếu dùng Vanilla JS, mỗi lần thêm/xoá giỏ hàng phải tự querySelector + cập nhật
   DOM thủ công - Vue tự động làm điều này nhờ reactivity.
   ========================================================= */
const { createApp } = Vue;

createApp({
  /* DỮ LIỆU GỐC (reactive): giao diện luôn là hàm của dữ liệu này */
  data() {
    return {
      tuKhoa: "",       // liên kết 2 chiều với ô tìm kiếm (v-model)
      cart: [],         // giỏ hàng: [{...sanPham, soLuong}]
      toast: "",        // thông báo nhỏ khi thêm/xoá
      bump: false,      // hiệu ứng nảy ở nút giỏ hàng
      products: [
        { id: 1, ten: "Ốp lưng xanh điện", anh: "../images/op-lung-xanh.jpg", anhSvg: "../images/op-lung-xanh.svg", anhDuPhong: "https://loremflickr.com/640/640/phone,case?lock=31", gia: 250000, moTa: "Silicon mềm, viền chống sốc." },
        { id: 2, ten: "Ốp lưng trong suốt", anh: "../images/op-lung-trong.jpg", anhSvg: "../images/op-lung-trong.svg", anhDuPhong: "https://loremflickr.com/640/640/smartphone?lock=32", gia: 180000, moTa: "Trong veo, không ố vàng." },
        { id: 3, ten: "Đế sạc không dây", anh: "../images/sac-khong-day.jpg", anhSvg: "../images/sac-khong-day.svg", anhDuPhong: "https://loremflickr.com/640/640/charger?lock=33", gia: 320000, moTa: "Sạc nhanh 15W, tự ngắt khi đầy." },
        { id: 4, ten: "Tai nghe TWS Active", anh: "../images/tai-nghe-tws.jpg", anhSvg: "../images/tai-nghe-tws.svg", anhDuPhong: "https://loremflickr.com/640/640/earbuds?lock=34", gia: 490000, moTa: "Bluetooth 5.3, pin 24 giờ." },
        { id: 5, ten: "Cáp sạc USB-C bện dù", anh: "../images/cap-sac-usb-c.jpg", anhSvg: "../images/cap-sac-usb-c.svg", anhDuPhong: "https://loremflickr.com/640/640/cable?lock=35", gia: 120000, moTa: "Dài 1m, sạc nhanh 60W." },
        { id: 6, ten: "Pin dự phòng 10.000mAh", anh: "../images/pin-du-phong.jpg", anhSvg: "../images/pin-du-phong.svg", anhDuPhong: "https://loremflickr.com/640/640/powerbank?lock=36", gia: 450000, moTa: "Hai cổng sạc nhanh, gọn nhẹ." },
        { id: 7, ten: "Giá đỡ điện thoại", anh: "../images/gia-do-dien-thoai.jpg", anhSvg: "../images/gia-do-dien-thoai.svg", anhDuPhong: "https://loremflickr.com/640/640/phone,stand?lock=37", gia: 99000, moTa: "Gập gọn, chỉnh nhiều góc." },
        { id: 8, ten: "Tai nghe chụp tai", anh: "../images/tai-nghe-chup-tai.jpg", anhSvg: "../images/tai-nghe-chup-tai.svg", anhDuPhong: "https://loremflickr.com/640/640/headphones?lock=38", gia: 690000, moTa: "Chống ồn nhẹ, đệm tai êm." }
      ]
    };
  },

  /* COMPUTED: tự tính lại khi dữ liệu liên quan thay đổi */
  computed: {
    // Lọc sản phẩm theo từ khoá (không phân biệt hoa thường); giao diện render danh sách đã lọc này.
    danhSachLoc() {
      const k = this.tuKhoa.trim().toLowerCase();
      if (!k) return this.products;
      return this.products.filter(p => p.ten.toLowerCase().includes(k) || p.moTa.toLowerCase().includes(k));
    },
    // Tổng số sản phẩm trong giỏ (cộng số lượng): hiển thị ở header "Giỏ hàng ({{ cartCount }})".
    cartCount() {
      return this.cart.reduce((tong, sp) => tong + sp.soLuong, 0);
    },
    // Tổng tiền giỏ hàng, hiển thị ở ASIDE.
    tongTien() {
      return this.cart.reduce((tong, sp) => tong + sp.gia * sp.soLuong, 0);
    }
  },

  /* METHODS */
  methods: {
    // Định dạng số thành tiền VND, ví dụ 250000 -> 250.000đ
    dinhDangGia(so) { return so.toLocaleString("vi-VN") + "đ"; },

    // Thêm sản phẩm vào giỏ: có rồi thì tăng số lượng, chưa có thì push vào mảng cart.
    // Chỉ cần đổi mảng cart, Vue tự cập nhật header và aside (không cần querySelector).
    themVaoGio(sanPham) {
      const co = this.cart.find(sp => sp.id === sanPham.id);
      if (co) co.soLuong++;
      else this.cart.push({ ...sanPham, soLuong: 1 });
      this.thongBao("Đã thêm " + sanPham.ten);
      this.bump = true; setTimeout(() => (this.bump = false), 400);
    },

    // Xoá một dòng khỏi giỏ theo vị trí index.
    xoaKhoiGio(index) {
      const ten = this.cart[index].ten;
      this.cart.splice(index, 1);
      this.thongBao("Đã xoá " + ten);
    },

    // Tăng/giảm số lượng; giảm về 0 thì xoá dòng đó.
    doiSoLuong(index, delta) {
      const sp = this.cart[index];
      sp.soLuong += delta;
      if (sp.soLuong <= 0) this.xoaKhoiGio(index);
    },

    // Thanh toán mô phỏng: báo tổng tiền rồi làm trống giỏ.
    thanhToan() {
      if (!this.cart.length) return;
      this.thongBao("Cảm ơn bạn! Tổng thanh toán " + this.dinhDangGia(this.tongTien));
      this.cart = [];
    },

    // Chuỗi dự phòng khi ảnh lỗi: ảnh .jpg trong images/ -> ảnh thật từ Internet -> ảnh .svg trong images/
    loiAnh(ev, sp) {
      const img = ev.target, buoc = Number(img.dataset.buoc || 0);
      img.dataset.buoc = buoc + 1;
      if (buoc === 0) img.src = sp.anhDuPhong;
      else if (buoc === 1) img.src = sp.anhSvg;
    },

    // Hiện thông báo trong 2 giây.
    thongBao(noiDung) {
      this.toast = noiDung;
      clearTimeout(this._t);
      this._t = setTimeout(() => (this.toast = ""), 2000);
    },

    cuonLenDau() { window.scrollTo({ top: 0, behavior: "smooth" }); }
  }
}).mount("#app");
