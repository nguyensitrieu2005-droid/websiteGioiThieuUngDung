CREATE DATABASE IF NOT EXISTS SoftwareIntroDB;
USE SoftwareIntroDB;

CREATE TABLE IF NOT EXISTS SiteSettings (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    SiteTitle VARCHAR(255) NOT NULL,
    LogoText VARCHAR(255),
    HeroTitle VARCHAR(255),
    HeroHighlight VARCHAR(255),
    HeroDescription TEXT,
    HeroButtonText VARCHAR(100),
    ProcessButtonText VARCHAR(100),
    FooterText TEXT,
    IntroLabel VARCHAR(255) NULL,
    IntroTitle VARCHAR(500) NULL,
    IntroDescription TEXT NULL,
    IntroItem1 VARCHAR(500) NULL,
    IntroItem2 VARCHAR(500) NULL,
    IntroItem3 VARCHAR(500) NULL,
    IntroItem4 VARCHAR(500) NULL,
    ModuleCount VARCHAR(50) NULL,
    ModuleCountText VARCHAR(255) NULL,
    WorkflowCount VARCHAR(50) NULL,
    WorkflowCountText VARCHAR(255) NULL,
    FlowTitle VARCHAR(500) NULL,
    FlowDescription TEXT NULL,
    CtaTitle VARCHAR(500) NULL,
    CtaDescription TEXT NULL,
    CtaButtonText VARCHAR(255) NULL
);

CREATE TABLE IF NOT EXISTS Pages (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Slug VARCHAR(100) NOT NULL UNIQUE,
    Title VARCHAR(255) NOT NULL,
    Description TEXT,
    Content TEXT,
    IsPublished TINYINT(1) NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS Features (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Description TEXT,
    Icon VARCHAR(100),
    DisplayOrder INT NOT NULL DEFAULT 0,
    IsActive TINYINT(1) NOT NULL DEFAULT 1,
    DetailContent TEXT NULL
);

CREATE TABLE IF NOT EXISTS Processes (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Description TEXT,
    DisplayOrder INT NOT NULL DEFAULT 0,
    IsActive TINYINT(1) NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS ProcessSteps (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    ProcessId INT NOT NULL,
    StepNumber INT NOT NULL,
    Title VARCHAR(255) NOT NULL,
    Description TEXT,
    FOREIGN KEY (ProcessId) REFERENCES Processes(Id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS DashboardDemo (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Revenue DECIMAL(18,2) NOT NULL DEFAULT 0,
    InventoryValue DECIMAL(18,2) NOT NULL DEFAULT 0,
    ProductCount INT NOT NULL DEFAULT 0,
    Month VARCHAR(20)
);

-- CHÈN DỮ LIỆU
INSERT INTO SiteSettings (
    SiteTitle, LogoText, HeroTitle, HeroHighlight, HeroDescription, 
    HeroButtonText, ProcessButtonText, FooterText,
    IntroLabel, IntroTitle, IntroDescription, IntroItem1, IntroItem2, IntroItem3, IntroItem4,
    ModuleCount, ModuleCountText, WorkflowCount, WorkflowCountText,
    FlowTitle, FlowDescription, CtaTitle, CtaDescription, CtaButtonText
) VALUES (
    'Phần mềm quản lý nông sản và sản xuất', 'Aurasoft', 'Quản lý doanh nghiệp', 'trên một nền tảng',
    'Kết nối mua hàng, kho, sản xuất, bán hàng, công nợ và báo cáo trong một hệ thống quản lý tập trung.',
    'Khám phá chức năng →', 'Xem quy trình', 'Giải pháp quản lý nông sản và sản xuất',
    'Một hệ thống — nhiều nghiệp vụ', 'Số hóa toàn bộ quy trình vận hành doanh nghiệp',
    'Hệ thống giúp doanh nghiệp kết nối các bộ phận và theo dõi xuyên suốt dòng chảy hàng hóa, tiền và công nợ.',
    'Quản lý dữ liệu tập trung', 'Theo dõi hàng hóa xuyên suốt các kho',
    'Liên kết nghiệp vụ mua hàng và bán hàng', 'Theo dõi công nợ và dòng tiền',
    '6+', 'Phân hệ quản lý', '3', 'Luồng nghiệp vụ chính',
    'Mua hàng → Kho → Sản xuất → Bán hàng',
    'Dữ liệu được liên kết giữa các nghiệp vụ giúp doanh nghiệp dễ dàng theo dõi toàn bộ quá trình vận hành.',
    'Quản lý doanh nghiệp hiệu quả hơn', 'Kết nối dữ liệu, quy trình và các bộ phận trên cùng một nền tảng.',
    'Tìm hiểu phần mềm'
);

INSERT INTO Processes (Title, Description, DisplayOrder) VALUES
('Mua hàng → Nhập kho → Công nợ nhà cung cấp', 'Quản lý từ lúc tạo đơn mua đến khi nhập kho và theo dõi công nợ nhà cung cấp.', 1),
('Tạo lô → Chế biến → Phân loại → Chuyển kho thành phẩm', 'Quản lý quá trình sản xuất và luân chuyển hàng hóa giữa các kho.', 2),
('Bán hàng → Giao hàng → Thu tiền → Công nợ khách hàng', 'Quản lý đơn bán, giao hàng, thu tiền và công nợ khách hàng.', 3);

INSERT INTO ProcessSteps (ProcessId, StepNumber, Title, Description) VALUES
(1, 1, 'Tạo đơn mua', 'Tạo và duyệt đơn mua với nhà cung cấp.'),
(1, 2, 'Tạo phiếu nhập', 'Tạo phiếu nhập hàng từ đơn mua.'),
(1, 3, 'Duyệt nhập kho', 'Xác định lô nhận hàng và ghi sổ nhập kho.'),
(1, 4, 'Theo dõi công nợ', 'Theo dõi số tiền phải trả và lịch sử thanh toán.'),
(2, 1, 'Tạo lô', 'Tạo và quản lý lô nguyên liệu.'),
(2, 2, 'Chế biến', 'Thực hiện lệnh sản xuất và chế biến.'),
(2, 3, 'Phân loại', 'Phân loại sản phẩm sau chế biến.'),
(2, 4, 'Chuyển kho thành phẩm', 'Chuyển thành phẩm sang kho thành phẩm.'),
(3, 1, 'Tạo đơn bán', 'Tạo đơn bán cho khách hàng.'),
(3, 2, 'Tạo đợt giao hàng', 'Tạo đợt giao hàng từ đơn bán.'),
(3, 3, 'Xuất kho', 'Xác nhận xuất hàng từ kho.'),
(3, 4, 'Thu tiền', 'Ghi nhận tiền khách hàng thanh toán.'),
(3, 5, 'Theo dõi công nợ', 'Theo dõi số tiền khách hàng còn phải trả.');

INSERT INTO Features (Title, Description, Icon, DisplayOrder) VALUES
('Mua hàng', 'Quản lý đơn mua, nhà cung cấp và quá trình nhập hàng.', 'cart', 1),
('Quản lý kho', 'Theo dõi nhập kho, xuất kho, tồn kho và lô hàng.', 'warehouse', 2),
('Sản xuất', 'Quản lý lô sản xuất, chế biến và phân loại.', 'factory', 3),
('Bán hàng', 'Quản lý đơn bán, giao hàng và thu tiền.', 'sales', 4),
('Công nợ', 'Theo dõi công nợ nhà cung cấp và khách hàng.', 'money', 5),
('Báo cáo', 'Tổng hợp dữ liệu và theo dõi tình hình kinh doanh.', 'chart', 6);

INSERT INTO DashboardDemo (Revenue, InventoryValue, ProductCount, Month) VALUES
(1240000000, 580000000, 24, '09/2026');