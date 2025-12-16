import { useState } from "react";
import { BsActivity, BsGear } from 'react-icons/bs';

export default function ProgressSection() {
  const [toggleStates, setToggleStates] = useState({
    toggle1: false,
    toggle2: true,
    toggle3: false
  });

  const handleToggle = (toggleName) => {
    setToggleStates(prev => ({
      ...prev,
      [toggleName]: !prev[toggleName]
    }));
  };

  return (
    <>
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <BsActivity className="w-6 h-6" />
          Progress Indicators
        </h2>
        <div className="space-y-4">
          <div className="w-full">
            <div className="flex justify-between mb-2">
              <span>Research KPI</span>
              <span>75%</span>
            </div>
            <progress className="progress progress-primary w-full" value="75" max="100"></progress>
          </div>
          <div className="w-full">
            <div className="flex justify-between mb-2">
              <span>Publication Target</span>
              <span>60%</span>
            </div>
            <progress className="progress progress-secondary w-full" value="60" max="100"></progress>
          </div>
          <div className="w-full">
            <div className="flex justify-between mb-2">
              <span>Grant Applications</span>
              <span>90%</span>
            </div>
            <progress className="progress progress-success w-full" value="90" max="100"></progress>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <BsGear className="w-6 h-6" />
          Toggle Switches
        </h2>
        <div className="space-y-4">
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Email Notifications</span>
              <input 
                type="checkbox" 
                className="toggle toggle-primary"
                checked={toggleStates.toggle1}
                onChange={() => handleToggle('toggle1')}
              />
            </label>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Dark Mode</span>
              <input 
                type="checkbox" 
                className="toggle toggle-secondary"
                checked={toggleStates.toggle2}
                onChange={() => handleToggle('toggle2')}
              />
            </label>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Auto-save</span>
              <input 
                type="checkbox" 
                className="toggle toggle-accent"
                checked={toggleStates.toggle3}
                onChange={() => handleToggle('toggle3')}
              />
            </label>
          </div>
        </div>
      </section>
    </>
  );
}