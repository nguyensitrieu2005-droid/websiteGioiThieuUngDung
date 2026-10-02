CREATE DATABASE SoftwareIntroDB;
GO

USE SoftwareIntroDB;
GO

CREATE TABLE SiteSettings (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    SiteTitle NVARCHAR(255) NOT NULL,
    LogoText NVARCHAR(255),
    HeroTitle NVARCHAR(255),
    HeroHighlight NVARCHAR(255),
    HeroDescription NVARCHAR(MAX),
    HeroButtonText NVARCHAR(100),
    ProcessButtonText NVARCHAR(100),
    FooterText NVARCHAR(MAX)
);
GO

CREATE TABLE Pages (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Slug NVARCHAR(100) NOT NULL UNIQUE,
    Title NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX),
    Content NVARCHAR(MAX),
    IsPublished BIT NOT NULL DEFAULT 1
);
GO

CREATE TABLE Features (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX),
    Icon NVARCHAR(100),
    DisplayOrder INT NOT NULL DEFAULT 0,
    IsActive BIT NOT NULL DEFAULT 1
);
GO

CREATE TABLE Processes (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX),
    DisplayOrder INT NOT NULL DEFAULT 0,
    IsActive BIT NOT NULL DEFAULT 1
);
GO

CREATE TABLE ProcessSteps (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ProcessId INT NOT NULL,
    StepNumber INT NOT NULL,
    Title NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX),
    FOREIGN KEY (ProcessId) REFERENCES Processes(Id)
);
GO

CREATE TABLE DashboardDemo (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Revenue DECIMAL(18,2) NOT NULL DEFAULT 0,
    InventoryValue DECIMAL(18,2) NOT NULL DEFAULT 0,
    ProductCount INT NOT NULL DEFAULT 0,
    Month NVARCHAR(20)
);
GO
INSERT INTO SiteSettings (
    SiteTitle,
    LogoText,
    HeroTitle,
    HeroHighlight,
    HeroDescription,
    HeroButtonText,
    ProcessButtonText,
    FooterText
)
VALUES (
    N'Phần mềm quản lý nông sản và sản xuất',
    N'Aurasoft',
    N'Quản lý doanh nghiệp',
    N'trên một nền tảng',
    N'Kết nối mua hàng, kho, sản xuất, bán hàng, công nợ và báo cáo trong một hệ thống quản lý tập trung.',
    N'Khám phá chức năng →',
    N'Xem quy trình',
    N'Giải pháp quản lý nông sản và sản xuất'
);
GO
INSERT INTO Processes (Title, Description, DisplayOrder)
VALUES
(
    N'Mua hàng → Nhập kho → Công nợ nhà cung cấp',
    N'Quản lý từ lúc tạo đơn mua đến khi nhập kho và theo dõi công nợ nhà cung cấp.',
    1
),
(
    N'Tạo lô → Chế biến → Phân loại → Chuyển kho thành phẩm',
    N'Quản lý quá trình sản xuất và luân chuyển hàng hóa giữa các kho.',
    2
),
(
    N'Bán hàng → Giao hàng → Thu tiền → Công nợ khách hàng',
    N'Quản lý đơn bán, giao hàng, thu tiền và công nợ khách hàng.',
    3
);
GO
INSERT INTO ProcessSteps
(ProcessId, StepNumber, Title, Description)
VALUES
(1, 1, N'Tạo đơn mua',
 N'Tạo và duyệt đơn mua với nhà cung cấp.'),

(1, 2, N'Tạo phiếu nhập',
 N'Tạo phiếu nhập hàng từ đơn mua.'),

(1, 3, N'Duyệt nhập kho',
 N'Xác định lô nhận hàng và ghi sổ nhập kho.'),

(1, 4, N'Theo dõi công nợ',
 N'Theo dõi số tiền phải trả và lịch sử thanh toán.');
GO
INSERT INTO ProcessSteps
(ProcessId, StepNumber, Title, Description)
VALUES
(2, 1, N'Tạo lô',
 N'Tạo và quản lý lô nguyên liệu.'),

(2, 2, N'Chế biến',
 N'Thực hiện lệnh sản xuất và chế biến.'),

(2, 3, N'Phân loại',
 N'Phân loại sản phẩm sau chế biến.'),

(2, 4, N'Chuyển kho thành phẩm',
 N'Chuyển thành phẩm sang kho thành phẩm.');
GO
INSERT INTO ProcessSteps
(ProcessId, StepNumber, Title, Description)
VALUES
(3, 1, N'Tạo đơn bán',
 N'Tạo đơn bán cho khách hàng.'),

(3, 2, N'Tạo đợt giao hàng',
 N'Tạo đợt giao hàng từ đơn bán.'),

(3, 3, N'Xuất kho',
 N'Xác nhận xuất hàng từ kho.'),

(3, 4, N'Thu tiền',
 N'Ghi nhận tiền khách hàng thanh toán.'),

(3, 5, N'Theo dõi công nợ',
 N'Theo dõi số tiền khách hàng còn phải trả.');
GO
INSERT INTO Features
(Title, Description, Icon, DisplayOrder)
VALUES
(
    N'Mua hàng',
    N'Quản lý đơn mua, nhà cung cấp và quá trình nhập hàng.',
    N'cart',
    1
),
(
    N'Quản lý kho',
    N'Theo dõi nhập kho, xuất kho, tồn kho và lô hàng.',
    N'warehouse',
    2
),
(
    N'Sản xuất',
    N'Quản lý lô sản xuất, chế biến và phân loại.',
    N'factory',
    3
),
(
    N'Bán hàng',
    N'Quản lý đơn bán, giao hàng và thu tiền.',
    N'sales',
    4
),
(
    N'Công nợ',
    N'Theo dõi công nợ nhà cung cấp và khách hàng.',
    N'money',
    5
),
(
    N'Báo cáo',
    N'Tổng hợp dữ liệu và theo dõi tình hình kinh doanh.',
    N'chart',
    6
);
GO
INSERT INTO DashboardDemo
(Revenue, InventoryValue, ProductCount, Month)
VALUES
(
    1240000000,
    580000000,
    24,
    N'09/2026'
);
GO
SELECT * FROM SiteSettings;
ALTER TABLE SiteSettings
ADD
    IntroLabel NVARCHAR(255) NULL,
    IntroTitle NVARCHAR(500) NULL,
    IntroDescription NVARCHAR(MAX) NULL,

    IntroItem1 NVARCHAR(500) NULL,
    IntroItem2 NVARCHAR(500) NULL,
    IntroItem3 NVARCHAR(500) NULL,
    IntroItem4 NVARCHAR(500) NULL,

    ModuleCount NVARCHAR(50) NULL,
    ModuleCountText NVARCHAR(255) NULL,

    WorkflowCount NVARCHAR(50) NULL,
    WorkflowCountText NVARCHAR(255) NULL,

    FlowTitle NVARCHAR(500) NULL,
    FlowDescription NVARCHAR(MAX) NULL,

    CtaTitle NVARCHAR(500) NULL,
    CtaDescription NVARCHAR(MAX) NULL,
    CtaButtonText NVARCHAR(255) NULL;
GO
UPDATE SiteSettings
SET
    IntroLabel = N'Một hệ thống — nhiều nghiệp vụ',

    IntroTitle = N'Số hóa toàn bộ quy trình vận hành doanh nghiệp',

    IntroDescription = N'Hệ thống giúp doanh nghiệp kết nối các bộ phận và theo dõi xuyên suốt dòng chảy hàng hóa, tiền và công nợ.',

    IntroItem1 = N'Quản lý dữ liệu tập trung',
    IntroItem2 = N'Theo dõi hàng hóa xuyên suốt các kho',
    IntroItem3 = N'Liên kết nghiệp vụ mua hàng và bán hàng',
    IntroItem4 = N'Theo dõi công nợ và dòng tiền',

    ModuleCount = N'6+',
    ModuleCountText = N'Phân hệ quản lý',

    WorkflowCount = N'3',
    WorkflowCountText = N'Luồng nghiệp vụ chính',

    FlowTitle = N'Mua hàng → Kho → Sản xuất → Bán hàng',

    FlowDescription = N'Dữ liệu được liên kết giữa các nghiệp vụ giúp doanh nghiệp dễ dàng theo dõi toàn bộ quá trình vận hành.',

    CtaTitle = N'Quản lý doanh nghiệp hiệu quả hơn',

    CtaDescription = N'Kết nối dữ liệu, quy trình và các bộ phận trên cùng một nền tảng.',

    CtaButtonText = N'Tìm hiểu phần mềm'

WHERE Id = 1;
GO
ALTER TABLE Features
ADD DetailContent NVARCHAR(MAX) NULL;
GO
select * from Features