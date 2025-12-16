import { BsAward } from 'react-icons/bs';

export default function BadgesSection() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold flex items-center gap-2">
        <BsAward className="w-6 h-6" />
        Badges
      </h2>
      <div className="flex flex-wrap gap-2">
        <div className="badge badge-primary">Primary</div>
        <div className="badge badge-secondary">Secondary</div>
        <div className="badge badge-accent">Accent</div>
        <div className="badge badge-info">Info</div>
        <div className="badge badge-success">Success</div>
        <div className="badge badge-warning">Warning</div>
        <div className="badge badge-error">Error</div>
        <div className="badge badge-neutral">Neutral</div>
        <div className="badge badge-outline">Outline</div>
        <div className="badge badge-lg">Large</div>
      </div>
    </section>
  );
}