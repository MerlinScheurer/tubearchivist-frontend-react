import { Link } from "react-router-dom";

interface NavigaitonItemProps {
  navigateTo: string;
  label: string;
}

const NavigationItem = ({ label, navigateTo }: NavigaitonItemProps) => {
  return (
    <Link to={navigateTo}>
      <div className="nav-item">{label}</div>
    </Link>
  );
};

export default NavigationItem;
