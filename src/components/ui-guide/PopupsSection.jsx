import { useState } from "react";
import { toast } from 'sonner';
import {
  BsSquare, BsCheckCircle, BsGear, BsFileText, BsInfoCircle, BsTrash, BsSave, BsCheck,
  BsLayoutSidebarReverse, BsMenuButtonWide, BsCart, BsPerson, BsBell, BsFilter
} from 'react-icons/bs';
import { FiSettings, FiFileText, FiInfo, FiTrash2, FiSave, FiCheck, FiMenu, FiShoppingCart, FiUser, FiBell, FiFilter } from 'react-icons/fi';
import { HiMenu, HiShoppingCart, HiUser, HiBell, HiFilter } from 'react-icons/hi';
import { MdOutlineMenu, MdShoppingCart, MdPerson, MdNotifications, MdFilterList } from 'react-icons/md';
import { openPopup, openConfirm } from '../KPopup.jsx';

export default function PopupsSection() {

  return (
    <div className="space-y-8">
      {/* Basic Popups Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <BsSquare className="w-6 h-6" />
          Basic Popups
        </h2>
        <p className="text-base-content/70">
          Standard popup dialogs with modal support, resizable, and movable features
        </p>

        <div className="flex flex-wrap gap-4">
          <button
            className="btn btn-primary"
            onClick={() => {
              openPopup(
                () => (
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-4">Simple Popup</h3>
                    <p className="mb-4">This is a basic popup with default settings.</p>
                    <p className="text-sm text-base-content/70">
                      Features: Modal, resizable, movable, close button
                    </p>
                  </div>
                ),
                {},
                {
                  header: "Simple Popup",
                  size: "medium"
                }
              );
            }}
          >
            <BsSquare className="w-4 h-4" />
            Simple Popup
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => {
              openPopup(
                ({ popup }) => {
                  const [formData, setFormData] = useState({
                    name: '',
                    email: '',
                    message: ''
                  });

                  popup.footerButtonOnClick = (buttonName) => {
                    if (buttonName === 'submit') {
                      toast.success(`Form submitted: ${formData.name}`);
                      popup.close();
                    } else if (buttonName === 'clear') {
                      setFormData({ name: '', email: '', message: '' });
                    }
                  };

                  return (
                    <div className="p-6 space-y-4">
                      <h3 className="text-xl font-bold mb-4">Contact Form</h3>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Name</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter your name"
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Email</span>
                        </label>
                        <input
                          type="email"
                          className="input input-bordered"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="Enter your email"
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Message</span>
                        </label>
                        <textarea
                          className="textarea textarea-bordered"
                          value={formData.message}
                          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                          placeholder="Enter your message"
                          rows="3"
                        />
                      </div>
                    </div>
                  );
                },
                {},
                {
                  header: "Contact Form",
                  size: "medium",
                  footer: [
                    { name: "submit", text: "Submit", variant: "primary" },
                    { name: "clear", text: "Clear", variant: "secondary" }
                  ]
                }
              );
            }}
          >
            <BsFileText className="w-4 h-4" />
            Form Popup
          </button>

          <button
            className="btn btn-success"
            onClick={() => {
              // Open multiple window-like popups
              ['Window 1', 'Window 2', 'Window 3'].forEach((title, idx) => {
                const positions = ['left', 'center', 'right'];
                openPopup(
                  () => (
                    <div className="p-4">
                      <h4 className="font-bold mb-2">{title}</h4>
                      <p>This is a window-like popup.</p>
                      <p className="text-sm mt-2">You can minimize, maximize, and move this window.</p>
                    </div>
                  ),
                  {},
                  {
                    header: title,
                    size: "small",
                    modal: false,
                    minButton: true,
                    maxButton: true,
                    movable: true,
                    resizable: true,
                    position: positions[idx]
                  }
                );
              });
            }}
          >
            <BsSquare className="w-4 h-4" />
            Multiple Windows
          </button>
        </div>
      </section>

      {/* Drawer Popups Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <BsLayoutSidebarReverse className="w-6 h-6" />
          Drawer Popups
        </h2>
        <p className="text-base-content/70">
          Side panel drawers that slide in from any direction. Supports both <strong>modal</strong> (with backdrop) and <strong>non-modal</strong> (no backdrop) modes - perfect for navigation menus, filters, and shopping carts
        </p>

        <div className="alert alert-info">
          <BsInfoCircle className="w-5 h-5" />
          <div>
            <strong>Modal Control:</strong> Drawers support both modal and non-modal modes. Use <code className="bg-base-300 px-2 py-1 rounded">modal: true</code> for backdrop overlay or <code className="bg-base-300 px-2 py-1 rounded">modal: false</code> to allow interaction with the page.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Right Drawer Examples */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Right Drawers</h3>
              <div className="space-y-2">
                <button
                  className="btn btn-outline btn-sm w-full"
                  onClick={() => {
                    openPopup(
                      () => (
                        <div className="p-6">
                          <h3 className="text-xl font-bold mb-4">Shopping Cart</h3>
                          <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-base-300 rounded-lg">
                              <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center">
                                <BsCart className="w-8 h-8" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold">Product Name</h4>
                                <p className="text-sm text-base-content/70">$99.99</p>
                              </div>
                            </div>
                            <div className="divider"></div>
                            <div className="flex justify-between font-bold">
                              <span>Total:</span>
                              <span>$99.99</span>
                            </div>
                          </div>
                        </div>
                      ),
                      {},
                      {
                        header: "Shopping Cart",
                        drawer: true,
                        drawerPosition: "right",
                        modal: true,
                        footer: [
                          { name: "checkout", text: "Checkout", variant: "primary" },
                          { name: "close", text: "Continue Shopping", variant: "secondary" }
                        ]
                      },
                      (response) => {
                        if (response === "checkout") {
                          toast.success("Proceeding to checkout!");
                        }
                      }
                    );
                  }}
                >
                  <BsCart className="w-4 h-4" />
                  Shopping Cart (Modal)
                </button>

                <button
                  className="btn btn-outline btn-sm w-full"
                  onClick={() => {
                    openPopup(
                      () => (
                        <div className="p-6">
                          <h3 className="text-xl font-bold mb-4">User Profile</h3>
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <div className="avatar placeholder">
                                <div className="bg-primary text-primary-content rounded-full w-16">
                                  <BsPerson className="w-8 h-8" />
                                </div>
                              </div>
                              <div>
                                <h4 className="font-bold">John Doe</h4>
                                <p className="text-sm text-base-content/70">john@example.com</p>
                              </div>
                            </div>
                            <div className="divider"></div>
                            <div className="space-y-2">
                              <button className="btn btn-sm btn-block btn-outline">Edit Profile</button>
                              <button className="btn btn-sm btn-block btn-outline">Settings</button>
                              <button className="btn btn-sm btn-block btn-outline btn-error">Logout</button>
                            </div>
                          </div>
                        </div>
                      ),
                      {},
                      {
                        header: "Profile",
                        drawer: true,
                        drawerPosition: "right",
                        modal: false,
                        width: 350
                      }
                    );
                  }}
                >
                  <BsPerson className="w-4 h-4" />
                  User Profile (Non-Modal)
                </button>
              </div>
            </div>
          </div>

          {/* Left Drawer Examples */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Left Drawers</h3>
              <div className="space-y-2">
                <button
                  className="btn btn-outline btn-sm w-full"
                  onClick={() => {
                    openPopup(
                      () => (
                        <div className="p-6">
                          <h3 className="text-xl font-bold mb-4">Navigation Menu</h3>
                          <div className="space-y-2">
                            <button className="btn btn-ghost w-full justify-start">
                              <BsSquare className="w-4 h-4" />
                              Dashboard
                            </button>
                            <button className="btn btn-ghost w-full justify-start">
                              <BsPerson className="w-4 h-4" />
                              Users
                            </button>
                            <button className="btn btn-ghost w-full justify-start">
                              <BsGear className="w-4 h-4" />
                              Settings
                            </button>
                            <button className="btn btn-ghost w-full justify-start">
                              <BsFileText className="w-4 h-4" />
                              Documents
                            </button>
                          </div>
                        </div>
                      ),
                      {},
                      {
                        header: "Menu",
                        drawer: true,
                        drawerPosition: "left",
                        modal: true,
                        width: 300
                      }
                    );
                  }}
                >
                  <BsMenuButtonWide className="w-4 h-4" />
                  Navigation Menu
                </button>

                <button
                  className="btn btn-outline btn-sm w-full"
                  onClick={() => {
                    openPopup(
                      () => (
                        <div className="p-6">
                          <h3 className="text-xl font-bold mb-4">Notifications</h3>
                          <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="alert alert-info">
                                <BsBell className="w-5 h-5" />
                                <span>Notification {i}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ),
                      {},
                      {
                        header: "Notifications",
                        drawer: true,
                        drawerPosition: "left",
                        modal: false,
                        width: 400
                      }
                    );
                  }}
                >
                  <BsBell className="w-4 h-4" />
                  Notifications
                </button>
              </div>
            </div>
          </div>

          {/* Top/Bottom Drawer Examples */}
          <div className="card bg-base-200 shadow-xl md:col-span-2">
            <div className="card-body">
              <h3 className="card-title">Top & Bottom Drawers</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    openPopup(
                      () => (
                        <div className="p-6">
                          <h3 className="text-xl font-bold mb-4">Filters</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="form-control">
                              <label className="label">Category</label>
                              <select className="select select-bordered select-sm">
                                <option>All</option>
                                <option>Electronics</option>
                                <option>Clothing</option>
                              </select>
                            </div>
                            <div className="form-control">
                              <label className="label">Price Range</label>
                              <select className="select select-bordered select-sm">
                                <option>All</option>
                                <option>$0 - $50</option>
                                <option>$50 - $100</option>
                              </select>
                            </div>
                            <div className="form-control">
                              <label className="label">Sort By</label>
                              <select className="select select-bordered select-sm">
                                <option>Newest</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ),
                      {},
                      {
                        header: "Filters",
                        drawer: true,
                        drawerPosition: "top",
                        modal: false,
                        footer: [
                          { name: "apply", text: "Apply Filters", variant: "primary" },
                          { name: "reset", text: "Reset", variant: "secondary" }
                        ]
                      }
                    );
                  }}
                >
                  <BsFilter className="w-4 h-4" />
                  Top Drawer (Filters)
                </button>

                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    openPopup(
                      () => (
                        <div className="p-6">
                          <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <button className="btn btn-outline">
                              <BsSave className="w-4 h-4" />
                              Save
                            </button>
                            <button className="btn btn-outline">
                              <BsFileText className="w-4 h-4" />
                              Export
                            </button>
                            <button className="btn btn-outline">
                              <BsGear className="w-4 h-4" />
                              Settings
                            </button>
                            <button className="btn btn-outline">
                              <BsInfoCircle className="w-4 h-4" />
                              Help
                            </button>
                          </div>
                        </div>
                      ),
                      {},
                      {
                        header: "Quick Actions",
                        drawer: true,
                        drawerPosition: "bottom",
                        modal: true
                      }
                    );
                  }}
                >
                  <BsMenuButtonWide className="w-4 h-4" />
                  Bottom Drawer (Actions)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal vs Non-Modal Comparison */}
        <div className="card bg-gradient-to-br from-primary/10 to-secondary/10 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Modal vs Non-Modal Comparison</h3>
            <p className="text-sm text-base-content/70 mb-4">
              Try both to see the difference! Modal drawers block interaction with the page, while non-modal drawers allow it.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                className="btn btn-primary"
                onClick={() => {
                  openPopup(
                    () => (
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-4">Modal Drawer</h3>
                        <p className="mb-4">This drawer has a backdrop overlay that blocks interaction with the page.</p>
                        <div className="alert alert-info">
                          <BsInfoCircle className="w-5 h-5" />
                          <span>Try clicking outside - it won't close unless you click the X button</span>
                        </div>
                      </div>
                    ),
                    {},
                    {
                      header: "Modal Drawer",
                      drawer: true,
                      drawerPosition: "right",
                      modal: true,
                      width: 400
                    }
                  );
                }}
              >
                Open Modal Drawer
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => {
                  openPopup(
                    () => (
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-4">Non-Modal Drawer</h3>
                        <p className="mb-4">This drawer has no backdrop - you can still interact with the page!</p>
                        <div className="alert alert-success">
                          <BsCheckCircle className="w-5 h-5" />
                          <span>Try clicking buttons on the page while this is open</span>
                        </div>
                      </div>
                    ),
                    {},
                    {
                      header: "Non-Modal Drawer",
                      drawer: true,
                      drawerPosition: "right",
                      modal: false,
                      width: 400
                    }
                  );
                }}
              >
                Open Non-Modal Drawer
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Popup Options */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <BsGear className="w-6 h-6" />
          Popup Options & Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Size Options</h3>
              <div className="flex flex-wrap gap-2">
                {['tiny', 'small', 'small+', 'medium', 'large', 'full'].map(size => (
                  <button
                    key={size}
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      openPopup(
                        () => (
                          <div className="p-4">
                            <h4 className="font-bold mb-2">Size: {size}</h4>
                            <p>This popup demonstrates the "{size}" size option.</p>
                          </div>
                        ),
                        {},
                        {
                          header: `${size.charAt(0).toUpperCase() + size.slice(1)} Popup`,
                          size: size
                        }
                      );
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Position Options</h3>
              <div className="flex flex-wrap gap-2">
                {['center', 'top', 'bottom', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right'].map(position => (
                  <button
                    key={position}
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      openPopup(
                        () => (
                          <div className="p-4">
                            <h4 className="font-bold mb-2">Position: {position}</h4>
                            <p>This popup is positioned at the {position}.</p>
                          </div>
                        ),
                        {},
                        {
                          header: `${position.charAt(0).toUpperCase() + position.slice(1)}`,
                          size: "small",
                          position: position
                        }
                      );
                    }}
                  >
                    {position}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Animation Options</h3>
              <div className="flex flex-wrap gap-2">
                {['PopEase', 'PopScaleUp', 'PopSlideDown'].map(animation => (
                  <button
                    key={animation}
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      openPopup(
                        () => (
                          <div className="p-4">
                            <h4 className="font-bold mb-2">Animation: {animation}</h4>
                            <p>This popup uses the {animation} animation.</p>
                          </div>
                        ),
                        {},
                        {
                          header: animation,
                          size: "small",
                          animation: animation
                        }
                      );
                    }}
                  >
                    {animation.replace('Pop', '')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Special Features</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    openPopup(
                      () => (
                        <div className="p-4">
                          <h4 className="font-bold mb-2">Non-Modal Popup</h4>
                          <p>You can interact with the page while this is open.</p>
                        </div>
                      ),
                      {},
                      {
                        header: "Non-Modal",
                        size: "small",
                        modal: false
                      }
                    );
                  }}
                >
                  Non-Modal
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    openPopup(
                      () => (
                        <div className="p-4">
                          <h4 className="font-bold mb-2">Auto-Hide</h4>
                          <p>This will close in 3 seconds.</p>
                        </div>
                      ),
                      {},
                      {
                        header: "Auto-Hide",
                        size: "small",
                        hideAfter: 3000
                      }
                    );
                  }}
                >
                  Auto-Hide
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    openPopup(
                      () => (
                        <div className="p-4">
                          <h4 className="font-bold mb-2">Window-like</h4>
                          <p>Minimize, maximize, move, and resize!</p>
                        </div>
                      ),
                      {},
                      {
                        header: "Window",
                        size: "medium",
                        modal: false,
                        minButton: true,
                        maxButton: true
                      }
                    );
                  }}
                >
                  Window-like
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Confirmation Dialogs */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <BsCheckCircle className="w-6 h-6" />
          Confirmation Dialogs
        </h2>

        <div className="flex flex-wrap gap-4">
          <button
            className="btn btn-warning"
            onClick={async () => {
              const result = await openConfirm(
                "Delete Confirmation",
                "Are you sure you want to delete this item? This action cannot be undone.",
                { confirmButtonText: "Delete", cancelButtonText: "Cancel" }
              );
              if (result) {
                toast.success("Item deleted successfully!");
              } else {
                toast.info("Delete action cancelled");
              }
            }}
          >
            <BsTrash className="w-4 h-4" />
            Delete Confirmation
          </button>

          <button
            className="btn btn-info"
            onClick={async () => {
              const result = await openConfirm(
                "Save Changes",
                "Do you want to save your changes before leaving?",
                { confirmButtonText: "Save", cancelButtonText: "Don't Save" }
              );
              if (result) {
                toast.success("Changes saved!");
              } else {
                toast.info("Changes not saved");
              }
            }}
          >
            <BsSave className="w-4 h-4" />
            Save Confirmation
          </button>

          <button
            className="btn btn-success"
            onClick={async () => {
              const result = await openConfirm(
                "Submit Form",
                "Are you ready to submit this form?",
                { confirmButtonText: "Submit", cancelButtonText: "Review" }
              );
              if (result) {
                toast.success("Form submitted!");
              } else {
                toast.info("Please review your form");
              }
            }}
          >
            <BsCheck className="w-4 h-4" />
            Submit Confirmation
          </button>
        </div>
      </section>

      {/* Configuration Reference */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <BsInfoCircle className="w-6 h-6" />
          Configuration Reference
        </h2>

        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Common Options</h3>
            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Option</th>
                    <th>Type</th>
                    <th>Default</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>modal</code></td>
                    <td>boolean</td>
                    <td>true</td>
                    <td><strong>Works with both popups and drawers</strong> - Shows backdrop overlay and blocks page interaction</td>
                  </tr>
                  <tr>
                    <td><code>drawer</code></td>
                    <td>boolean</td>
                    <td>false</td>
                    <td>Enable drawer mode (slides in from edge)</td>
                  </tr>
                  <tr>
                    <td><code>drawerPosition</code></td>
                    <td>string</td>
                    <td>"right"</td>
                    <td>Drawer position: "left", "right", "top", "bottom"</td>
                  </tr>
                  <tr>
                    <td><code>size</code></td>
                    <td>string</td>
                    <td>"big"</td>
                    <td>Popup size: "tiny", "small", "medium", "large", "full"</td>
                  </tr>
                  <tr>
                    <td><code>width</code></td>
                    <td>number</td>
                    <td>auto</td>
                    <td>Custom width in pixels</td>
                  </tr>
                  <tr>
                    <td><code>header</code></td>
                    <td>string</td>
                    <td>""</td>
                    <td>Header title text</td>
                  </tr>
                  <tr>
                    <td><code>footer</code></td>
                    <td>array</td>
                    <td>null</td>
                    <td>Array of footer buttons</td>
                  </tr>
                  <tr>
                    <td><code>closeButton</code></td>
                    <td>boolean</td>
                    <td>true</td>
                    <td>Show X close button in header</td>
                  </tr>
                  <tr>
                    <td><code>movable</code></td>
                    <td>boolean</td>
                    <td>true</td>
                    <td>Allow dragging (disabled for drawers)</td>
                  </tr>
                  <tr>
                    <td><code>resizable</code></td>
                    <td>boolean</td>
                    <td>true</td>
                    <td>Allow resizing (disabled for drawers)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Code Examples */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <BsFileText className="w-6 h-6" />
          Code Examples
        </h2>

        <div className="space-y-4">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Basic Popup</h3>
              <pre className="bg-base-300 p-4 rounded-lg text-sm overflow-x-auto">
{`import { openPopup } from './components/KPopup.jsx';

openPopup(
  YourComponent,
  { prop1: 'value1' },
  {
    header: 'Popup Title',
    size: 'medium',
    modal: true,
    resizable: true
  },
  (response) => {
    console.log('Response:', response);
  }
);`}
              </pre>
            </div>
          </div>

          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Modal Drawer</h3>
              <pre className="bg-base-300 p-4 rounded-lg text-sm overflow-x-auto">
{`import { openPopup } from './components/KPopup.jsx';

// Modal drawer - blocks page interaction
openPopup(
  YourComponent,
  {},
  {
    header: 'Shopping Cart',
    drawer: true,
    drawerPosition: 'right', // 'left', 'right', 'top', 'bottom'
    modal: true,             // Backdrop blocks interaction
    width: 400,
    footer: [
      { name: 'checkout', text: 'Checkout', variant: 'primary' },
      { name: 'close', text: 'Close', variant: 'secondary' }
    ]
  }
);`}
              </pre>
            </div>
          </div>

          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Non-Modal Drawer</h3>
              <pre className="bg-base-300 p-4 rounded-lg text-sm overflow-x-auto">
{`import { openPopup } from './components/KPopup.jsx';

// Non-modal drawer - allows page interaction
openPopup(
  YourComponent,
  {},
  {
    header: 'Notifications',
    drawer: true,
    drawerPosition: 'left',
    modal: false,            // No backdrop, page is interactive
    width: 350
  }
);`}
              </pre>
            </div>
          </div>

          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Confirmation Dialog</h3>
              <pre className="bg-base-300 p-4 rounded-lg text-sm overflow-x-auto">
{`import { openConfirm } from './components/KPopup.jsx';

const result = await openConfirm(
  'Confirm Action',
  'Are you sure?',
  {
    confirmButtonText: 'Yes',
    cancelButtonText: 'No'
  }
);

if (result) {
  // User confirmed
} else {
  // User cancelled
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}