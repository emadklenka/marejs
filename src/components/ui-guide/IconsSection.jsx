import {
  BsStar, BsHouse, BsPerson, BsGear, BsBell, BsSearch, BsFilter, BsPlus, BsPen, BsTrash, BsSave,
  BsDownload, BsUpload, BsEye, BsLock, BsChevronLeft, BsChevronRight, BsCheck, BsX, BsExclamationCircle,
  BsInfoCircle, BsCheckCircle, BsXCircle, BsSun, BsMoon, BsClock, BsActivity, BsFile, BsFileText, BsFolder, BsDatabase,
  BsBarChart, BsPeople, BsHeart, BsAward
} from 'react-icons/bs';
import {
  MdTrendingUp, MdTrendingDown, MdBarChart, MdPeople
} from 'react-icons/md';

export default function IconsSection() {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <BsStar className="w-6 h-6" />
          Essential React Icons
        </h2>
        <p className="text-base-content/70">
          Most commonly used icons throughout the application
        </p>
        
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Core UI Icons</h3>
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {[
                { icon: BsHouse, name: 'Home' },
                { icon: BsPerson, name: 'User' },
                { icon: BsGear, name: 'Settings' },
                { icon: BsBell, name: 'Bell' },
                { icon: BsSearch, name: 'Search' },
                { icon: BsFilter, name: 'Filter' },
                { icon: BsPlus, name: 'Plus' },
                { icon: BsPen, name: 'Edit' },
                { icon: BsTrash, name: 'Trash' },
                { icon: BsSave, name: 'Save' },
                { icon: BsDownload, name: 'Download' },
                { icon: BsUpload, name: 'Upload' },
                { icon: BsEye, name: 'Eye' },
                { icon: BsLock, name: 'Lock' },
                { icon: BsChevronLeft, name: 'ChevronLeft' },
                { icon: BsChevronRight, name: 'ChevronRight' },
              ].map(({ icon: Icon, name }) => (
                <div key={name} className="flex flex-col items-center gap-2 p-2 rounded hover:bg-base-300 transition-colors">
                  <Icon className="w-6 h-6" />
                  <span className="text-xs">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Status & Theme Icons</h3>
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {[
                { icon: BsCheck, name: 'Check' },
                { icon: BsX, name: 'X' },
                { icon: BsExclamationCircle, name: 'AlertCircle' },
                { icon: BsInfoCircle, name: 'Info' },
                { icon: BsCheckCircle, name: 'CheckCircle' },
                { icon: BsXCircle, name: 'XCircle' },
                { icon: MdTrendingUp, name: 'TrendingUp' },
                { icon: MdTrendingDown, name: 'TrendingDown' },
                { icon: BsSun, name: 'Sun' },
                { icon: BsMoon, name: 'Moon' },
                { icon: BsClock, name: 'Clock' },
                { icon: BsActivity, name: 'Activity' },
              ].map(({ icon: Icon, name }) => (
                <div key={name} className="flex flex-col items-center gap-2 p-2 rounded hover:bg-base-300 transition-colors">
                  <Icon className="w-6 h-6" />
                  <span className="text-xs">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Data & File Icons</h3>
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {[
                { icon: BsFile, name: 'File' },
                { icon: BsFileText, name: 'FileText' },
                { icon: BsFolder, name: 'Folder' },
                { icon: BsDatabase, name: 'Database' },
                { icon: MdBarChart, name: 'BarChart3' },
                { icon: MdPeople, name: 'Users' },
                { icon: BsAward, name: 'Award' },
                { icon: BsHeart, name: 'Heart' },
              ].map(({ icon: Icon, name }) => (
                <div key={name} className="flex flex-col items-center gap-2 p-2 rounded hover:bg-base-300 transition-colors">
                  <Icon className="w-6 h-6" />
                  <span className="text-xs">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}