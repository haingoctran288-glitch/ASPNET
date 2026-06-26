import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

const PolicyPage = () => {
    const navigate = useNavigate();

    return (
        <MainLayout>
            {/* Banner Section */}
            <div className="bg-dark text-white py-5 mb-5 text-center position-relative" style={{background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(/banner-giay-bong-da.jpg) center/cover'}}>
                <h1 className="brand-font display-4 fw-bold text-uppercase" style={{letterSpacing: '2px'}}>CHÍNH SÁCH BÁN HÀNG</h1>
                <p className="lead" style={{fontFamily: 'Inter', color: '#ccc'}}>Đảm bảo quyền lợi tối đa cho khách hàng tại HAI SPORT</p>
            </div>

            <div className="container py-4 mb-5">
                {/* Back Button */}
                <button className="btn btn-link text-dark text-decoration-none p-0 mb-5 fw-bold" onClick={() => navigate(-1)} style={{fontFamily: 'Oswald'}}>
                    <i className="fas fa-arrow-left me-2"></i> QUAY LẠI
                </button>

                <div className="row g-5">
                    <div className="col-lg-4">
                        <div className="list-group rounded-0 shadow-sm sticky-top" style={{top: '100px', zIndex: '10'}}>
                            <a href="#delivery" className="list-group-item list-group-item-action border-0 py-3 fw-bold" style={{fontFamily: 'Oswald'}}>
                                <i className="fas fa-truck me-2 text-accent"></i> CHÍNH SÁCH VẬN CHUYỂN
                            </a>
                            <a href="#return" className="list-group-item list-group-item-action border-0 py-3 fw-bold" style={{fontFamily: 'Oswald'}}>
                                <i className="fas fa-sync-alt me-2 text-accent"></i> CHÍNH SÁCH ĐỔI TRẢ
                            </a>
                            <a href="#warranty" className="list-group-item list-group-item-action border-0 py-3 fw-bold" style={{fontFamily: 'Oswald'}}>
                                <i className="fas fa-award me-2 text-accent"></i> CHÍNH SÁCH BẢO HÀNH
                            </a>
                            <a href="#privacy" className="list-group-item list-group-item-action border-0 py-3 fw-bold" style={{fontFamily: 'Oswald'}}>
                                <i className="fas fa-user-shield me-2 text-accent"></i> CHÍNH SÁCH BẢO MẬT
                            </a>
                        </div>
                    </div>

                    <div className="col-lg-8">
                        {/* Policy 1 */}
                        <section id="delivery" className="mb-5 pb-5 border-bottom">
                            <h3 className="brand-font mb-4 text-dark"><i className="fas fa-truck me-2 text-accent"></i> 1. CHÍNH SÁCH VẬN CHUYỂN & GIAO NHẬN</h3>
                            <p className="text-secondary" style={{lineHeight: '1.8'}}>
                                HAI SPORT hợp tác với các đơn vị vận chuyển uy tín (GHTK, Viettel Post, GHN) để chuyển hàng tới tay khách hàng trên phạm vi toàn quốc.
                            </p>
                            <ul className="text-secondary" style={{lineHeight: '1.8'}}>
                                <li className="mb-2"><strong>Thời gian giao hàng:</strong> Từ 1 - 3 ngày làm việc đối với các tỉnh/thành lớn và 3 - 5 ngày đối với khu vực huyện xã xa.</li>
                                <li className="mb-2"><strong>Phí vận chuyển:</strong> Miễn phí giao hàng (Free Ship) toàn quốc đối với các đơn hàng mua sản phẩm giày bóng đá.</li>
                                <li className="mb-2"><strong>Đồng kiểm khi nhận:</strong> Quý khách được quyền mở hộp kiểm tra ngoại quan sản phẩm (đúng mẫu mã, màu sắc, size) trước khi thanh toán cho nhân viên giao hàng.</li>
                            </ul>
                        </section>

                        {/* Policy 2 */}
                        <section id="return" className="mb-5 pb-5 border-bottom">
                            <h3 className="brand-font mb-4 text-dark"><i className="fas fa-sync-alt me-2 text-accent"></i> 2. CHÍNH SÁCH ĐỔI HÀNG TRONG 7 NGÀY</h3>
                            <p className="text-secondary" style={{lineHeight: '1.8'}}>
                                Nhằm mang lại sự an tâm tuyệt đối khi mua sắm trực tuyến, chúng tôi cung cấp dịch vụ hỗ trợ đổi size hoặc đổi mẫu nhanh chóng.
                            </p>
                            <ul className="text-secondary" style={{lineHeight: '1.8'}}>
                                <li className="mb-2"><strong>Điều kiện áp dụng:</strong> Sản phẩm còn nguyên tag, hộp, không bị dơ bẩn, chưa có dấu hiệu sử dụng trên sân cỏ.</li>
                                <li className="mb-2"><strong>Thời gian đổi hàng:</strong> Trong vòng 7 ngày kể từ ngày quý khách nhận được sản phẩm thành công.</li>
                                <li className="mb-2"><strong>Chi phí đổi hàng:</strong> Quý khách tự thanh toán phí vận chuyển 2 chiều đối với trường hợp muốn đổi size/mẫu theo nhu cầu cá nhân. Miễn phí 100% nếu phát hiện lỗi từ nhà sản xuất hoặc giao sai mẫu.</li>
                            </ul>
                        </section>

                        {/* Policy 3 */}
                        <section id="warranty" className="mb-5 pb-5 border-bottom">
                            <h3 className="brand-font mb-4 text-dark"><i className="fas fa-award me-2 text-accent"></i> 3. CHÍNH SÁCH BẢO HÀNH KEO & KHÂU ĐẾ</h3>
                            <p className="text-secondary" style={{lineHeight: '1.8'}}>
                                Tất cả sản phẩm mua tại HAI SPORT đều được hưởng chế độ bảo hành sửa chữa miễn phí lỗi phát sinh trong quá trình sử dụng thực tế.
                            </p>
                            <ul className="text-secondary" style={{lineHeight: '1.8'}}>
                                <li className="mb-2"><strong>Thời hạn bảo hành:</strong> Hỗ trợ bảo hành sửa chữa, dán keo, khâu đế trọn đời sản phẩm.</li>
                                <li className="mb-2"><strong>Trường hợp từ chối bảo hành:</strong> Giày bị rách da do va chạm vật sắc nhọn, giày bị ẩm mốc nặng do bảo quản sai cách, hoặc tự ý đem sửa chữa tại các cửa hàng khác bên ngoài.</li>
                            </ul>
                        </section>

                        {/* Policy 4 */}
                        <section id="privacy" className="mb-5">
                            <h3 className="brand-font mb-4 text-dark"><i className="fas fa-user-shield me-2 text-accent"></i> 4. CHÍNH SÁCH BẢO MẬT THÔNG TIN</h3>
                            <p className="text-secondary" style={{lineHeight: '1.8'}}>
                                Chúng tôi cam kết bảo vệ tuyệt đối thông tin cá nhân của khách hàng đăng ký trên hệ thống. Dữ liệu số điện thoại, địa chỉ giao hàng chỉ được sử dụng cho mục đích vận chuyển đơn hàng và chăm sóc hậu mãi.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default PolicyPage;
