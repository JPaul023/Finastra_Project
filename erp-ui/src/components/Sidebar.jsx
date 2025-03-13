import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
    const location = useLocation();
    const [expandedItem, setExpandedItem] = useState(null);
    
    const navItems = [
        {
            path: '/',
            icon: 'fa-chart-simple',
            label: 'Dashboard',
            bsColor: 'primary',
            subItems: []
        },
        {
            path: '/hr',
            icon: 'fa-address-book',
            label: 'Human Resources',
            bsColor: 'info',
            subItems: [  // 
                { path: '/hr/employees', label: 'Employee Records Management', icon: 'fa-user' },
                { path: '/hr/hrpayroll', label: 'Payroll & Salary Slips', icon: 'fa-money-bill-wave' },
                { path: '/hr/attendance', label: 'Attendance & Leave Tracking', icon: 'fa-calendar-check' },
                { path: '/hr/recruitment', label: 'Recruitment & Onboarding', icon: 'fa-users' },
                { path: '/hr/performance', label: 'Performance Evaluation', icon: 'fa-chart-line' }
            ]
        },
        {
            path: '/finance',
            icon: 'fa-receipt',
            label: 'Finance & Accounting',
            bsColor: 'info',
            subItems: [
                { path: '/finance/one', label: 'Lorem ipsum', icon: '' },
                { path: '/finance/two', label: 'Lorem ipsum', icon: '' }
            ]
        },
        {
            path: '/inventory',
            icon: 'fa-list-check',
            label: 'Inventory',
            bsColor: 'info',
            subItems: [
                { path: '/inventory/one', label: 'Lorem ipsum', icon: '' },
                { path: '/inventory/two', label: 'Lorem ipsum', icon: '' }
            ]
        },
        {
            path: '/logistics',
            icon: 'fa-truck-loading',
            label: 'Logistics',
            bsColor: 'info', 
            subItems: [
                { path: '/logistics/orders', label: 'Orders', icon: '' },
                { path: '/logistics/shipments', label: 'Shipments', icon: '' },
                { path: '/logistics/deliveries', label: 'Deliveries', icon: '' },
                { path: '/logistics/warehouses', label: 'Warehouses', icon: '' },
                { path: '/logistics/vehicles', label: 'Vehicles', icon: '' }
            ]
        },
        {
            path: '/crm',
            icon: 'fa-people-arrows',
            label: 'Customer Relationship',
            bsColor: 'info',
            subItems: [
                { path: '/crm/one', label: 'Lorem ipsum', icon: '' },
                { path: '/crm/two', label: 'Lorem ipsum', icon: '' },
                { path: '/crm/three', label: 'Lorem ipsum', icon: '' }
            ]
        }
    ];
    
    const isSubItemActive = (subItems) => {
        return subItems.some(item => location.pathname === item.path);
    };
    
    const handleNavItemClick = (index) => {
        setExpandedItem(expandedItem === index ? null : index);
    };
    
    return (
        <div className="bg-light shadow-sm p-3 d-flex flex-column vh-100 border" style={{ minWidth: '280px' }}>
            <div className="py-3 border-bottom mb-3">
                <h2 className="fs-4 fw-bold m-0 d-flex align-items-center">
                    ERP SYSTEM
                </h2>
            </div>
            <nav className="flex-grow-1">
                <ul className="nav flex-column">
                    {navItems.map((item, index) => {
                        const isActive = location.pathname === item.path || isSubItemActive(item.subItems);
                        const isExpanded = expandedItem === index;
                        const bgColorClass = isActive ? `bg-${item.bsColor} bg-opacity-10` : '';
                        const textColorClass = isActive ? `text-${item.bsColor}` : 'text-secondary';
                        
                        return (
                            <li key={index} className="nav-item mb-2">
                                <div className={`d-flex align-items-center rounded ${bgColorClass}`}>
                                    <Link 
                                        to={item.path}
                                        className={`nav-link px-3 py-2 flex-grow-1 ${textColorClass}`}
                                    >
                                        <div className="d-flex align-items-center">
                                            <span className={`d-inline-flex align-items-center justify-content-center rounded-circle p-2 me-3 ${isActive ? `bg-${item.bsColor} text-white` : 'bg-light'}`} style={{ width: '38px', height: '38px' }}>
                                                <i className={`fas ${item.icon}`}></i>
                                            </span>
                                            <span className="fw-medium">{item.label}</span>
                                        </div>
                                    </Link>
                                    {item.subItems.length > 0 && (
                                        <button 
                                            onClick={() => handleNavItemClick(index)}
                                            className={`btn btn-sm rounded-circle me-2 ${isExpanded ? `text-${item.bsColor}` : 'text-secondary'}`}
                                            aria-expanded={isExpanded}
                                        >
                                            <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
                                        </button>
                                    )}
                                </div>
                                
                                {item.subItems.length > 0 && isExpanded && (
                                    <div className="mt-1 mb-2">
                                        <ul className="nav flex-column ms-4 ps-2 border-start">
                                            {item.subItems.map((subItem, subIndex) => {
                                                const isSubActive = location.pathname === subItem.path;
                                                const subTextClass = isSubActive ? `text-${item.bsColor} fw-medium` : 'text-secondary';
                                                
                                                return (
                                                    <li key={subIndex} className="nav-item">
                                                        <Link 
                                                            to={subItem.path} 
                                                            className={`nav-link py-1 ${subTextClass}`}
                                                        >
                                                            <i className={`fas ${subItem.icon} me-2 ${isSubActive ? `text-${item.bsColor}` : 'text-secondary'}`} style={{ width: '16px' }}></i>
                                                            <span className="small">{subItem.label}</span>
                                                        </Link>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
}

export default Sidebar;
