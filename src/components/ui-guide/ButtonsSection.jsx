import { BsStar, BsPlus, BsPen, BsSave, BsTrash, BsDownload, BsUpload } from 'react-icons/bs';

export default function ButtonsSection() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold flex items-center gap-2">
        <BsStar className="w-6 h-6" />
        Buttons
      </h2>
      <div className="flex flex-wrap gap-4">
        <button className="btn btn-primary">Primary</button>
        <button className="btn btn-secondary">Secondary</button>
        <button className="btn btn-accent">Accent</button>
        <button className="btn btn-ghost">Ghost</button>
        <button className="btn btn-link">Link</button>
        <button className="btn btn-outline btn-primary">Outline</button>
        <button className="btn btn-disabled">Disabled</button>
        <button className="btn btn-primary btn-sm">Small</button>
        <button className="btn btn-primary btn-lg">Large</button>
        <button className="btn btn-primary loading">Loading</button>
      </div>
      
      <div className="flex flex-wrap gap-4">
        <button className="btn btn-primary">
          <BsPlus className="w-4 h-4" />
          Add New
        </button>
        <button className="btn btn-info">
          <BsPen className="w-4 h-4" />
          Edit
        </button>
        <button className="btn btn-success">
          <BsSave className="w-4 h-4" />
          Save
        </button>
        <button className="btn btn-error">
          <BsTrash className="w-4 h-4" />
          Delete
        </button>
        <button className="btn btn-warning">
          <BsDownload className="w-4 h-4" />
          Download
        </button>
        <button className="btn btn-info">
          <BsUpload className="w-4 h-4" />
          Upload
        </button>
      </div>
    </section>
  );
}