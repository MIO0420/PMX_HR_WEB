// import React from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';

// // 引入圖片檔案
// import CompanyInformationIcon from './ICON/SidebarICON/CompanyInformation.png';
// import SalaryIcon from './ICON/SidebarICON/salary.png';
// import EmployeeInformationIcon from './ICON/SidebarICON/EmployeeInformation.png';
// import UploadAnnouncement from './ICON/SidebarICON/UploadAnnouncement.png';
// import ShiftSchedule from './ICON/SidebarICON/ShiftSchedule.png';
// import Permissions from './ICON/SidebarICON/Permissions.png';
// import HypothesisSetting from './ICON/SidebarICON/HypothesisSetting.png';

// // 內嵌 CSS 樣式 - 完全匹配第二份檔案的側邊欄樣式
// const sidebarStyles = {
//   sidebar: {
//     width: '250px',
//     height: '100vh',
//     backgroundColor: '#ffffff',
//     borderRight: '1px solid #e0e0e0',
//     display: 'flex',
//     flexDirection: 'column',
//     position: 'fixed',
//     left: 0,
//     top: 0,
//     zIndex: 1000,
//     boxShadow: '2px 0 4px rgba(0, 0, 0, 0.1)',
//     fontFamily: '"Microsoft JhengHei", Arial, sans-serif',
//   },
//   sidebarHeader: {
//     padding: '20px 16px',
//     borderBottom: '1px solid #f0f0f0',
//     backgroundColor: '#fafafa',
//   },
//   sidebarTitle: {
//     fontSize: '18px',
//     fontWeight: '600',
//     color: '#333',
//     margin: 0,
//     textAlign: 'center',
//     fontFamily: '"Microsoft JhengHei", Arial, sans-serif',
//   },
//   sidebarMenu: {
//     flex: 1,
//     padding: '0',
//     overflowY: 'auto',
//   },
//   sidebarButton: {
//     width: '100%',
//     display: 'flex',
//     alignItems: 'center',
//     padding: '15px 20px',
//     border: 'none',
//     background: 'none',
//     cursor: 'pointer',
//     transition: 'all 0.2s ease',
//     textAlign: 'left',
//     gap: '12px',
//     fontSize: '14px',
//     color: '#666',
//     borderRadius: 0,
//     position: 'relative',
//     fontFamily: '"Microsoft JhengHei", Arial, sans-serif',
//     minHeight: '50px',
//   },
//   sidebarButtonHover: {
//     backgroundColor: '#f5f5f5',
//     color: '#333',
//   },
//   sidebarButtonActive: {
//     backgroundColor: '#e3f2fd',
//     color: '#1976d2',
//     borderRight: '3px solid #1976d2',
//   },
//   sidebarIcon: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: '24px',
//     height: '24px',
//     flexShrink: 0,
//   },
//   sidebarText: {
//     fontWeight: '500',
//     transition: 'all 0.2s ease',
//     fontFamily: '"Microsoft JhengHei", Arial, sans-serif',
//     fontSize: '14px',
//   },
//   sidebarTextActive: {
//     fontWeight: '600',
//     color: '#1976d2',
//   },
//   sidebarFooter: {
//     padding: '16px 20px',
//     borderTop: '1px solid #f0f0f0',
//     backgroundColor: '#fafafa',
//   },
//   logoutButton: {
//     width: '100%',
//     padding: '12px 16px',
//     backgroundColor: '#e1d6d6ff',
//     color: 'white',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'pointer',
//     fontSize: '14px',
//     fontWeight: '500',
//     transition: 'background-color 0.2s ease',
//     fontFamily: '"Microsoft JhengHei", Arial, sans-serif',
//     minHeight: '44px',
//   },
//   logoutButtonHover: {
//     backgroundColor: '#d32f2f',
//   },
// };

// // 圖示組件 - 修改為使用 import 的圖片
// const renderIcon = (iconName) => {
//   const iconStyle = {
//     width: '24px',
//     height: '24px',
//     display: 'block',
//     objectFit: 'contain',
//   };

//   // 使用 import 的圖片
//   switch(iconName) {
//     case 'person':
//       return (
//         <img 
//           src={EmployeeInformationIcon} 
//           alt="員工資料" 
//           style={iconStyle}
//           onError={(e) => {
//             console.error('員工資料圖片載入失敗');
//             e.target.style.display = 'none';
//           }}
//         />
//       );
//     case 'money':
//       return (
//         <img 
//           src={SalaryIcon} 
//           alt="薪資計算" 
//           style={iconStyle}
//           onError={(e) => {
//             console.error('薪資計算圖片載入失敗');
//             e.target.style.display = 'none';
//           }}
//         />
//       );
//     case 'folder':
//       return (
//         <img 
//           src={CompanyInformationIcon} 
//           alt="公司資料" 
//           style={iconStyle}
//           onError={(e) => {
//             console.error('公司資料圖片載入失敗');
//             e.target.style.display = 'none';
//           }}
//         />
//       );
//     case 'key':
//       return (
//         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={iconStyle}>
//           <path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
//         </svg>
//       );
//     case 'waves':
//       return (
//         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={iconStyle}>
//           <path d="M17 16.99c-1.35 0-2.2.42-2.95.8-.65.33-1.18.6-2.05.6-.9 0-1.4-.25-2.05-.6-.75-.38-1.57-.8-2.95-.8s-2.2.42-2.95.8c-.65.33-1.17.6-2.05.6v1.95c1.35 0 2.2-.42 2.95-.8.65-.33 1.17-.6 2.05-.6s1.4.25 2.05.6c.75.38 1.57.8 2.95.8s2.2-.42 2.95-.8c.65-.33 1.18-.6 2.05-.6.9 0 1.4.25 2.05.6.75.38 1.58.8 2.95.8v-1.95c-.9 0-1.4-.25-2.05-.6-.75-.38-1.6-.8-2.95-.8z"/>
//         </svg>
//       );
//     case 'upload':
//       return (
//         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={iconStyle}>
//           <path d="M5 10h4v6h-4zm0-4h4v2h-4zm10 4h4v6h-4zm0-4h4v2h-4zm-5 4h4v6h-4zm0-4h4v2h-4z"/>
//         </svg>
//       );
//     case 'calendar':
//       return (
//         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={iconStyle}>
//           <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
//         </svg>
//       );
//     case 'chat':
//       return (
//         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={iconStyle}>
//           <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM6 10h2v2H6zm0 4h8v2H6zm10 0h2v2h-2zm-6-4h8v2h-8z"/>
//         </svg>
//       );
//     default:
//       return null;
//   }
// };

// // 預設側邊欄配置 - 保持原有的顏色配置
// const defaultSidebarConfig = {
//   title: '朱老師的桃李園',
//   items: [
//     { 
//       id: 'employee', 
//       name: '員工資料', 
//       icon: 'person', 
//       color: '#F8C07F',
//       route: '/human',
//       action: 'navigate'
//     },
//     { 
//       id: 'salary', 
//       name: '薪資計算', 
//       icon: 'money', 
//       color: '#FFDF7F',
//       route: '/salarycalculate',
//       action: 'navigate'
//     },
//     { 
//       id: 'company', 
//       name: '公司資料', 
//       icon: 'folder', 
//       color: '#A4B8F5',
//       route: '/cmpanyinformation',
//       action: 'navigate'
//     },
//     { 
//       id: 'permission', 
//       name: '設定權限', 
//       icon: 'key', 
//       color: '#FFDF7F',
//       route: '/permissions',
//       action: 'navigate'
//     },
//     { 
//       id: 'leave', 
//       name: '假別設定', 
//       icon: 'waves', 
//       color: '#7DD1A3',
//       route: '/leave-settings',
//       action: 'navigate'
//     },
//     { 
//       id: 'announcement', 
//       name: '上傳公告', 
//       icon: 'upload', 
//       color: '#A4B8F5',
//       route: '/announcements',
//       action: 'navigate'
//     },
//     { 
//       id: 'schedule', 
//       name: '排班表', 
//       icon: 'calendar', 
//       color: '#D5B8F9',
//       route: '/addnewmonth',
//       action: 'navigate'
//     },
//     { 
//       id: 'ads', 
//       name: '廣告推播', 
//       icon: 'chat', 
//       color: '#D9D9D9',
//       route: '/advertisements',
//       action: 'navigate'
//     },
//   ]
// };

// // Sidebar 組件 - 其餘部分保持不變
// const Sidebar = ({ 
//   currentPage, 
//   onItemClick, 
//   customConfig = null,
//   onLogout = null 
// }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [hoveredButton, setHoveredButton] = React.useState(null);
//   const [hoveredLogout, setHoveredLogout] = React.useState(false);
  
//   const config = customConfig || defaultSidebarConfig;
  
//   const handleItemClick = (item) => {
//     console.log('點擊的項目:', item.id);
    
//     if (onItemClick) {
//       const shouldContinue = onItemClick(item);
//       if (shouldContinue === false) {
//         return;
//       }
//     }
    
//     if (item.action === 'navigate' && item.route) {
//       console.log('導航到頁面:', item.route);
//       window.location.href = item.route;
//     } else if (item.callback) {
//       item.callback(item);
//     }
//   };
  
//   const handleLogoutClick = () => {
//     if (onLogout) {
//       onLogout();
//     } else {
//       console.log('登出，跳轉到登入頁面');
//       window.location.href = '/login';
//     }
//   };
  
//   const isActive = (item) => {
//     if (currentPage) {
//       return currentPage === item.id;
//     }
//     return location.pathname === item.route;
//   };

//   const getButtonStyle = (item, index) => {
//     const isItemActive = isActive(item);
//     const isHovered = hoveredButton === index;
    
//     let style = { ...sidebarStyles.sidebarButton };
    
//     if (isItemActive) {
//       style = { ...style, ...sidebarStyles.sidebarButtonActive };
//     } else if (isHovered) {
//       style = { ...style, ...sidebarStyles.sidebarButtonHover };
//     }
    
//     return style;
//   };

//   const getTextStyle = (item) => {
//     const isItemActive = isActive(item);
//     let style = { ...sidebarStyles.sidebarText };
    
//     if (isItemActive) {
//       style = { ...style, ...sidebarStyles.sidebarTextActive };
//     }
    
//     return style;
//   };

//   const getLogoutButtonStyle = () => {
//     let style = { ...sidebarStyles.logoutButton };
    
//     if (hoveredLogout) {
//       style = { ...style, ...sidebarStyles.logoutButtonHover };
//     }
    
//     return style;
//   };

//   return (
//     <div style={sidebarStyles.sidebar}>
//       <div style={sidebarStyles.sidebarHeader}>
//         <h2 style={sidebarStyles.sidebarTitle}>{config.title}</h2>
//       </div>
      
//       <div style={sidebarStyles.sidebarMenu}>
//         {config.items.map((item, index) => (
//           <button 
//             key={item.id}
//             style={getButtonStyle(item, index)}
//             onClick={() => handleItemClick(item)}
//             onMouseEnter={() => setHoveredButton(index)}
//             onMouseLeave={() => setHoveredButton(null)}
//           >
//             <span 
//               style={{
//                 ...sidebarStyles.sidebarIcon,
//                 color: item.color
//               }}
//             >
//               {renderIcon(item.icon)}
//             </span>
//             <span style={getTextStyle(item)}>
//               {item.name}
//             </span>
//           </button>
//         ))}
//       </div>
      
//       <div style={sidebarStyles.sidebarFooter}>
//         <button 
//           style={getLogoutButtonStyle()}
//           onClick={handleLogoutClick}
//           onMouseEnter={() => setHoveredLogout(true)}
//           onMouseLeave={() => setHoveredLogout(false)}
//         >
//           登出
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
// export { defaultSidebarConfig, renderIcon };
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// 引入圖片檔案
import CompanyInformationIcon from './ICON/SidebarICON/CompanyInformation.png';
import SalaryIcon from './ICON/SidebarICON/salary.png';
import EmployeeInformationIcon from './ICON/SidebarICON/EmployeeInformation.png';
import UploadAnnouncement from './ICON/SidebarICON/UploadAnnouncement.png';
import ShiftSchedule from './ICON/SidebarICON/ShiftSchedule.png';
import Permissions from './ICON/SidebarICON/Permissions.png';
import HypothesisSetting from './ICON/SidebarICON/HypothesisSetting.png';

// 內嵌 CSS 樣式 - 完全匹配第二份檔案的側邊欄樣式
const sidebarStyles = {
  sidebar: {
    width: '250px',
    height: '100vh',
    backgroundColor: '#ffffff',
    borderRight: '1px solid #e0e0e0',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0,
    top: 0,
    zIndex: 1000,
    boxShadow: '2px 0 4px rgba(0, 0, 0, 0.1)',
    fontFamily: '"Microsoft JhengHei", Arial, sans-serif',
  },
  sidebarHeader: {
    padding: '20px 16px',
    borderBottom: '1px solid #f0f0f0',
    backgroundColor: '#fafafa',
  },
  sidebarTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    margin: 0,
    textAlign: 'center',
    fontFamily: '"Microsoft JhengHei", Arial, sans-serif',
  },
  sidebarMenu: {
    flex: 1,
    padding: '0',
    overflowY: 'auto',
  },
  sidebarButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: '15px 20px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left',
    gap: '12px',
    fontSize: '14px',
    color: '#666',
    borderRadius: 0,
    position: 'relative',
    fontFamily: '"Microsoft JhengHei", Arial, sans-serif',
    minHeight: '50px',
  },
  sidebarButtonHover: {
    backgroundColor: '#f5f5f5',
    color: '#333',
  },
  sidebarButtonActive: {
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    borderRight: '3px solid #1976d2',
  },
  sidebarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    flexShrink: 0,
  },
  sidebarText: {
    fontWeight: '500',
    transition: 'all 0.2s ease',
    fontFamily: '"Microsoft JhengHei", Arial, sans-serif',
    fontSize: '14px',
  },
  sidebarTextActive: {
    fontWeight: '600',
    color: '#1976d2',
  },
  sidebarFooter: {
    padding: '16px 20px',
    borderTop: '1px solid #f0f0f0',
    backgroundColor: '#fafafa',
  },
  logoutButton: {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: '#e1d6d6ff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s ease',
    fontFamily: '"Microsoft JhengHei", Arial, sans-serif',
    minHeight: '44px',
  },
  logoutButtonHover: {
    backgroundColor: '#d32f2f',
  },
};

// 圖示組件 - 修改為使用 import 的圖片
const renderIcon = (iconName) => {
  const iconStyle = {
    width: '24px',
    height: '24px',
    display: 'block',
    objectFit: 'contain',
  };

  // 使用 import 的圖片
  switch(iconName) {
    case 'person':
      return (
        <img 
          src={EmployeeInformationIcon} 
          alt="員工資料" 
          style={iconStyle}
          onError={(e) => {
            console.error('員工資料圖片載入失敗');
            e.target.style.display = 'none';
          }}
        />
      );
    case 'money':
      return (
        <img 
          src={SalaryIcon} 
          alt="薪資計算" 
          style={iconStyle}
          onError={(e) => {
            console.error('薪資計算圖片載入失敗');
            e.target.style.display = 'none';
          }}
        />
      );
    case 'folder':
      return (
        <img 
          src={CompanyInformationIcon} 
          alt="公司資料" 
          style={iconStyle}
          onError={(e) => {
            console.error('公司資料圖片載入失敗');
            e.target.style.display = 'none';
          }}
        />
      );
    case 'key':
      return (
        <img 
          src={Permissions} 
          alt="設定權限" 
          style={iconStyle}
          onError={(e) => {
            console.error('設定權限圖片載入失敗');
            e.target.style.display = 'none';
          }}
        />
      );
    case 'waves':
      return (
        <img 
          src={HypothesisSetting} 
          alt="假別設定" 
          style={iconStyle}
          onError={(e) => {
            console.error('假別設定圖片載入失敗');
            e.target.style.display = 'none';
          }}
        />
      );
    case 'upload':
      return (
        <img 
          src={UploadAnnouncement} 
          alt="上傳公告" 
          style={iconStyle}
          onError={(e) => {
            console.error('上傳公告圖片載入失敗');
            e.target.style.display = 'none';
          }}
        />
      );
    case 'calendar':
      return (
        <img 
          src={ShiftSchedule} 
          alt="排班表" 
          style={iconStyle}
          onError={(e) => {
            console.error('排班表圖片載入失敗');
            e.target.style.display = 'none';
          }}
        />
      );
    case 'chat':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={iconStyle}>
          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM6 10h2v2H6zm0 4h8v2H6zm10 0h2v2h-2zm-6-4h8v2h-8z"/>
        </svg>
      );
    default:
      return null;
  }
};

// 預設側邊欄配置 - 保持原有的顏色配置
const defaultSidebarConfig = {
  title: '朱老師的桃李園',
  items: [
    { 
      id: 'employee', 
      name: '員工資料', 
      icon: 'person', 
      color: '#F8C07F',
      route: '/human',
      action: 'navigate'
    },
    { 
      id: 'salary', 
      name: '薪資計算', 
      icon: 'money', 
      color: '#FFDF7F',
      route: '/salarycalculate',
      action: 'navigate'
    },
    { 
      id: 'company', 
      name: '公司資料', 
      icon: 'folder', 
      color: '#A4B8F5',
      route: '/cmpanyinformation',
      action: 'navigate'
    },
    { 
      id: 'permission', 
      name: '設定權限', 
      icon: 'key', 
      color: '#FFDF7F',
      route: '/permissions',
      action: 'navigate'
    },
    { 
      id: 'leave', 
      name: '假別設定', 
      icon: 'waves', 
      color: '#7DD1A3',
      route: '/hypothesissetting',
      action: 'navigate'
    },
    { 
      id: 'announcement', 
      name: '上傳公告', 
      icon: 'upload', 
      color: '#A4B8F5',
      route: '/uploadannouncement',
      action: 'navigate'
    },
    { 
      id: 'schedule', 
      name: '排班表', 
      icon: 'calendar', 
      color: '#D5B8F9',
      route: '/addnewmonth',
      action: 'navigate'
    },
    { 
      id: 'ads', 
      name: '廣告推播', 
      icon: 'chat', 
      color: '#D9D9D9',
      route: '/advertisements',
      action: 'navigate'
    },
  ]
};

// Sidebar 組件 - 其餘部分保持不變
const Sidebar = ({ 
  currentPage, 
  onItemClick, 
  customConfig = null,
  onLogout = null 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredButton, setHoveredButton] = React.useState(null);
  const [hoveredLogout, setHoveredLogout] = React.useState(false);
  
  const config = customConfig || defaultSidebarConfig;
  
  const handleItemClick = (item) => {
    console.log('點擊的項目:', item.id);
    
    if (onItemClick) {
      const shouldContinue = onItemClick(item);
      if (shouldContinue === false) {
        return;
      }
    }
    
    if (item.action === 'navigate' && item.route) {
      console.log('導航到頁面:', item.route);
      window.location.href = item.route;
    } else if (item.callback) {
      item.callback(item);
    }
  };
  
  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    } else {
      console.log('登出，跳轉到登入頁面');
      window.location.href = '/login';
    }
  };
  
  const isActive = (item) => {
    if (currentPage) {
      return currentPage === item.id;
    }
    return location.pathname === item.route;
  };

  const getButtonStyle = (item, index) => {
    const isItemActive = isActive(item);
    const isHovered = hoveredButton === index;
    
    let style = { ...sidebarStyles.sidebarButton };
    
    if (isItemActive) {
      style = { ...style, ...sidebarStyles.sidebarButtonActive };
    } else if (isHovered) {
      style = { ...style, ...sidebarStyles.sidebarButtonHover };
    }
    
    return style;
  };

  const getTextStyle = (item) => {
    const isItemActive = isActive(item);
    let style = { ...sidebarStyles.sidebarText };
    
    if (isItemActive) {
      style = { ...style, ...sidebarStyles.sidebarTextActive };
    }
    
    return style;
  };

  const getLogoutButtonStyle = () => {
    let style = { ...sidebarStyles.logoutButton };
    
    if (hoveredLogout) {
      style = { ...style, ...sidebarStyles.logoutButtonHover };
    }
    
    return style;
  };

  return (
    <div style={sidebarStyles.sidebar}>
      <div style={sidebarStyles.sidebarHeader}>
        <h2 style={sidebarStyles.sidebarTitle}>{config.title}</h2>
      </div>
      
      <div style={sidebarStyles.sidebarMenu}>
        {config.items.map((item, index) => (
          <button 
            key={item.id}
            style={getButtonStyle(item, index)}
            onClick={() => handleItemClick(item)}
            onMouseEnter={() => setHoveredButton(index)}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <span 
              style={{
                ...sidebarStyles.sidebarIcon,
                color: item.color
              }}
            >
              {renderIcon(item.icon)}
            </span>
            <span style={getTextStyle(item)}>
              {item.name}
            </span>
          </button>
        ))}
      </div>
      
      <div style={sidebarStyles.sidebarFooter}>
        <button 
          style={getLogoutButtonStyle()}
          onClick={handleLogoutClick}
          onMouseEnter={() => setHoveredLogout(true)}
          onMouseLeave={() => setHoveredLogout(false)}
        >
          登出
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
export { defaultSidebarConfig, renderIcon };
