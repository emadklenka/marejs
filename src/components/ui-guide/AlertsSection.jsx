import { useState } from "react";
import { IoNotifications, IoInformationCircle, IoCheckmarkCircle, IoWarning, IoCloseCircle, IoClose } from 'react-icons/io5';

export default function AlertsSection() {
  const [showAlert, setShowAlert] = useState(true);

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold flex items-center gap-2">
        <IoNotifications className="w-6 h-6" />
        Alerts & Notifications
      </h2>
      <div className="grid gap-4">
        {showAlert && (
          <div className="alert alert-info">
            <IoInformationCircle className="w-4 h-4" />
            <span>This is an info alert with important information.</span>
            <button onClick={() => setShowAlert(false)} className="btn btn-sm btn-ghost">
              <IoClose className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="alert alert-success">
          <IoCheckmarkCircle className="w-4 h-4" />
          <span>Operation completed successfully!</span>
        </div>
        <div className="alert alert-warning">
          <IoWarning className="w-4 h-4" />
          <span>Please review your input before proceeding.</span>
        </div>
        <div className="alert alert-error">
          <IoCloseCircle className="w-4 h-4" />
          <span>Error: Unable to process your request.</span>
        </div>
      </div>
    </section>
  );
}