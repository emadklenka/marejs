import { BsDatabase, BsPerson, BsFileText, BsAward } from 'react-icons/bs';
import { MdTrendingUp, MdPeople } from 'react-icons/md';

export default function CardsSection() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold flex items-center gap-2">
        <BsDatabase className="w-6 h-6" />
        Cards
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Research Performance</h3>
            <div className="flex items-center gap-2">
              <MdTrendingUp className="w-5 h-5 text-success" />
              <span className="text-2xl font-bold">92%</span>
            </div>
            <p className="text-base-content/70">Excellent performance this quarter</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary btn-sm">View Details</button>
            </div>
          </div>
        </div>
        
        <div className="card bg-base-200 shadow-xl">
          <figure className="px-4 pt-4">
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content rounded-full w-16 h-16">
                <BsPerson className="w-8 h-8" />
              </div>
            </div>
          </figure>
          <div className="card-body">
            <h3 className="card-title">Dr. Ahmed Mohamed</h3>
            <p className="text-base-content/70">Computer Science Department</p>
            <div className="flex gap-2">
              <div className="badge badge-primary">Active</div>
              <div className="badge badge-secondary">Senior</div>
            </div>
          </div>
        </div>
        
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Quick Stats</h3>
            <div className="stats stats-vertical shadow">
              <div className="stat">
                <div className="stat-title">Publications</div>
                <div className="stat-value text-primary">25</div>
              </div>
              <div className="stat">
                <div className="stat-title">Citations</div>
                <div className="stat-value text-secondary">342</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}