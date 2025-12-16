import { useState } from "react";
import DatePicker from 'react-datepicker';
import { BsPerson, BsEnvelope, BsTelephone, BsFileText, BsCalendar } from 'react-icons/bs';
import 'react-datepicker/dist/react-datepicker.css';

export default function FormsSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    message: ''
  });
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold flex items-center gap-2">
        <BsFileText className="w-6 h-6" />
        Form Elements
      </h2>
      
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h3 className="card-title">Researcher Registration Form</h3>
          
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input input-bordered pt-6 pb-2 peer"
                  placeholder=" "
                  id="floating-name"
                />
                <label
                  htmlFor="floating-name"
                  className="absolute text-sm text-base-content/70 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-3 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:start-3"
                >
                  <span className="flex items-center gap-2">
                    <BsPerson className="w-4 h-4" />
                    Full Name
                  </span>
                </label>
              </div>
              
              <div className="form-control relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input input-bordered pt-6 pb-2 peer"
                  placeholder=" "
                  id="floating-email"
                />
                <label
                  htmlFor="floating-email"
                  className="absolute text-sm text-base-content/70 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-3 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:start-3"
                >
                  <span className="flex items-center gap-2">
                    <BsEnvelope className="w-4 h-4" />
                    Email
                  </span>
                </label>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control relative">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input input-bordered pt-6 pb-2 peer"
                  placeholder=" "
                  id="floating-phone"
                />
                <label
                  htmlFor="floating-phone"
                  className="absolute text-sm text-base-content/70 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-3 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:start-3"
                >
                  <span className="flex items-center gap-2">
                    <BsTelephone className="w-4 h-4" />
                    Phone
                  </span>
                </label>
              </div>
              
              <div className="form-control relative">
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="select select-bordered pt-8 pb-2 peer appearance-none h-16"
                  id="floating-department"
                >
                  <option value="" disabled selected></option>
                  <option value="cs">Computer Science</option>
                  <option value="math">Mathematics</option>
                  <option value="physics">Physics</option>
                  <option value="chemistry">Chemistry</option>
                  <option value="biology">Biology</option>
                </select>
                <label
                  htmlFor="floating-department"
                  className="absolute text-sm text-base-content/70 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-3 pointer-events-none peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:start-3 peer-valid:scale-75 peer-valid:-translate-y-4"
                >
                  Department
                </label>
              </div>
            </div>
            
            <div className="form-control relative">
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="textarea textarea-bordered h-24 pt-6 pb-2 peer"
                placeholder=" "
                id="floating-message"
              ></textarea>
              <label
                htmlFor="floating-message"
                className="absolute text-sm text-base-content/70 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-3 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:start-3"
              >
                Message
              </label>
            </div>
            
            <div className="form-control relative">
              <div className="flex items-center gap-2">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  className="input input-bordered w-full pt-6 pb-2 peer"
                  dateFormat="MMMM d, yyyy"
                  placeholderText=" "
                />
                <BsCalendar className="w-4 h-4" />
              </div>
              <label
                className="absolute text-sm text-base-content/70 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-3 pointer-events-none peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:start-3"
              >
                Date of Birth
              </label>
            </div>
            
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">I agree to the terms and conditions</span>
                <input type="checkbox" className="checkbox checkbox-primary" />
              </label>
            </div>
            
            <div className="card-actions justify-end">
              <button type="button" className="btn btn-ghost">Cancel</button>
              <button type="submit" className="btn btn-primary">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}