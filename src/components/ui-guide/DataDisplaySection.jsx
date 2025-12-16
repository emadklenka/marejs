import { useRef, useEffect, useState } from "react";
import { AgGridReact } from 'ag-grid-react';
import { BsDatabase, BsFileText, BsEye, BsPen, BsTrash, BsAward } from 'react-icons/bs';
import { MdBarChart, MdPeople, MdTrendingUp } from 'react-icons/md';
import { getAgGridTheme } from '../../config/agGridTheme.js';

// Sample data for AG Grid
const sampleGridData = [
  { id: 1, name: 'John Smith', department: 'Engineering', score: 95, status: 'Excellent', lastUpdated: '2024-01-15' },
  { id: 2, name: 'Jane Doe', department: 'Marketing', score: 88, status: 'Good', lastUpdated: '2024-01-14' },
  { id: 3, name: 'Bob Johnson', department: 'Sales', score: 92, status: 'Excellent', lastUpdated: '2024-01-13' },
  { id: 4, name: 'Alice Brown', department: 'HR', score: 78, status: 'Average', lastUpdated: '2024-01-12' },
  { id: 5, name: 'Charlie Wilson', department: 'Finance', score: 85, status: 'Good', lastUpdated: '2024-01-11' },
];

// AG Grid column definitions
const columnDefs = [
  { field: 'id', headerName: 'ID', width: 80 },
  { field: 'name', headerName: 'Name', flex: 1, sortable: true, filter: true },
  { field: 'department', headerName: 'Department', flex: 1, sortable: true, filter: true },
  { field: 'score', headerName: 'Score', width: 120, sortable: true },
  { field: 'status', headerName: 'Status', width: 120, sortable: true },
  { field: 'lastUpdated', headerName: 'Last Updated', width: 150, sortable: true },
];

export default function DataDisplaySection() {
  const [currentTheme, setCurrentTheme] = useState(getAgGridTheme());
  const gridRef = useRef(null);

  // Listen for theme changes
  useEffect(() => {
    const handleThemeChange = () => {
      const newTheme = getAgGridTheme();
      setCurrentTheme(newTheme);
      
      // Force grid to refresh with new theme
      if (gridRef.current && gridRef.current.api) {
        gridRef.current.api.refreshCells();
      }
    };

    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          handleThemeChange();
        }
      });
    });

    // Start observing the document element for theme changes
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <BsDatabase className="w-6 h-6" />
          Data Tables
        </h2>
        
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Sample Performance Data</h3>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>KPI Score</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>1</th>
                    <td>John Smith</td>
                    <td>Engineering</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="radial-progress text-primary" style={{ "--value": "95" }} role="progressbar">95%</div>
                      </div>
                    </td>
                    <td><div className="badge badge-success">Excellent</div></td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-ghost btn-xs">
                          <BsEye className="w-3 h-3" />
                        </button>
                        <button className="btn btn-ghost btn-xs">
                          <BsPen className="w-3 h-3" />
                        </button>
                        <button className="btn btn-ghost btn-xs">
                          <BsTrash className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>2</th>
                    <td>Jane Doe</td>
                    <td>Marketing</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="radial-progress text-warning" style={{ "--value": "88" }} role="progressbar">88%</div>
                      </div>
                    </td>
                    <td><div className="badge badge-primary">Good</div></td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-ghost btn-xs">
                          <BsEye className="w-3 h-3" />
                        </button>
                        <button className="btn btn-ghost btn-xs">
                          <BsPen className="w-3 h-3" />
                        </button>
                        <button className="btn btn-ghost btn-xs">
                          <BsTrash className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <MdBarChart className="w-6 h-6" />
          AG Grid Integration
        </h2>
        
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Advanced Data Grid</h3>
            <p className="text-base-content/70 mb-4">
              Fully themed AG Grid with Cascade design system - supports dark/light mode with purple gradient accents
            </p>
            <div style={{ height: '500px', width: '100%' }}>
              <AgGridReact
                ref={gridRef}
                rowData={sampleGridData}
                columnDefs={columnDefs}
                theme={currentTheme}
                pagination={true}
                paginationPageSize={20}
                paginationPageSizeSelector={[20, 50, 100]}
                domLayout='normal'
               
                enableCellTextSelection={true}
                rowSelection={{
                  mode: 'multiRow',
                  enableClickSelection: true,
                  enableRangeSelection: false
                }}
                animateRows={true}
                defaultColDef={{
                  sortable: true,
                  filter: true,
                  resizable: true,
                  floatingFilter: false,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <MdBarChart className="w-6 h-6" />
          Statistics
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat bg-base-200 rounded-lg shadow">
            <div className="stat-figure text-primary">
              <MdPeople className="w-8 h-8" />
            </div>
            <div className="stat-title">Total Users</div>
            <div className="stat-value text-primary">156</div>
            <div className="stat-desc">+12% from last month</div>
          </div>
          
          <div className="stat bg-base-200 rounded-lg shadow">
            <div className="stat-figure text-secondary">
              <BsFileText className="w-8 h-8" />
            </div>
            <div className="stat-title">Documents</div>
            <div className="stat-value text-secondary">428</div>
            <div className="stat-desc">+21 documents</div>
          </div>
          
          <div className="stat bg-base-200 rounded-lg shadow">
            <div className="stat-figure text-accent">
              <MdTrendingUp className="w-8 h-8" />
            </div>
            <div className="stat-title">Average Score</div>
            <div className="stat-value text-accent">87%</div>
            <div className="stat-desc">↑ 5% from last quarter</div>
          </div>
          
          <div className="stat bg-base-200 rounded-lg shadow">
            <div className="stat-figure text-info">
              <BsAward className="w-8 h-8" />
            </div>
            <div className="stat-title">Awards</div>
            <div className="stat-value text-info">23</div>
            <div className="stat-desc">3 new this month</div>
          </div>
        </div>
      </section>
    </div>
  );
}