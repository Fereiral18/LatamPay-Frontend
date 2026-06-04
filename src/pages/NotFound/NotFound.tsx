import { Link } from "react-router-dom";
import { paths } from "../../routes/paths";

export const NotFound = () => {
  return (
    <main>
      <h1>404</h1>
      <p>La página que buscás no existe o fue movida.</p>
      <Link to={paths.home}>Volver al inicio</Link>
    </main>
  );
};

export default NotFound;
