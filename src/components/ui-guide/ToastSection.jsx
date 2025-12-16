import { toast } from 'sonner';
import { BsBell } from 'react-icons/bs';

export default function ToastSection() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold flex items-center gap-2">
        <BsBell className="w-6 h-6" />
        Toast Notifications (Sonner)
      </h2>
      <p className="text-base-content/70">
        Elegant toast notifications with auto-dismiss and stacking support
      </p>
      <div className="flex flex-wrap gap-4">
        <button
          className="btn btn-primary"
          onClick={() => toast.success('Success!', {
            description: 'Your changes have been saved successfully.'
          })}
        >
          Success Toast
        </button>
        <button
          className="btn btn-error"
          onClick={() => toast.error('Error!', {
            description: 'Unable to process your request. Please try again.'
          })}
        >
          Error Toast
        </button>
        <button
          className="btn btn-warning"
          onClick={() => toast.warning('Warning!', {
            description: 'Please review your input before proceeding.'
          })}
        >
          Warning Toast
        </button>
        <button
          className="btn btn-info"
          onClick={() => toast.info('Information', {
            description: 'This is an informational message for you.'
          })}
        >
          Info Toast
        </button>
        <button
          className="btn btn-ghost"
          onClick={() => toast('Default Toast', {
            description: 'This is a default toast notification.'
          })}
        >
          Default Toast
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => {
            const promise = () => new Promise((resolve) => setTimeout(resolve, 2000));
            toast.promise(promise, {
              loading: 'Loading...',
              success: 'Data loaded successfully!',
              error: 'Error loading data'
            });
          }}
        >
          Promise Toast
        </button>
      </div>
    </section>
  );
}