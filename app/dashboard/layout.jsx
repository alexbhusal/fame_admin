import Link from 'next/link';

const navItems = [
  { href: '/dashboard', label: 'Home' },
  { href: '/dashboard/members', label: 'Members' },
  // { href: '/dashboard/addmembers', label: 'Add Members' },
  { href: '/dashboard/students', label: 'Students' },
  // { href: '/dashboard/addstudents', label: 'Add Students' },
];

const DashboardLayout = ({ children }) => (
  <div className="flex flex-col w-full md:flex-row min-h-screen">
    <aside className="w-full md:w-32 p-2  md:border-r-4 border-black m-0 md:m-10">
      <ul className="flex flex-row md:flex-col space-y-0 md:space-y-2 mt-5 md:mt-10">
        {navItems.map(({ href, label }) => (
          <li key={href}>
            <Link href={href} className="text-xs md:text-2xl font-semibold">
              <span className="block p-2 hover:text-red-500 rounded cursor-pointer">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
    <section className="flex-1 p-4 md:p-8">{children}</section>
  </div>
);

export default DashboardLayout;