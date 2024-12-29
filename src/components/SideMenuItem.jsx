export default function SideMenuItem({ children, href }) {
  return (
    <li>
      <a
        href={href}
        className="flex items-center p-2 text-gray-900 rounded-lg text-white hover:bg-gray-700 group focus:bg-gray-700"
      >
        {children}
      </a>
    </li>
  );
}
