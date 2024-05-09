import { Link } from "react-router-dom";

export type TaUpdate = {
  version: string;
  is_breaking: boolean;
};

interface Props {
  version: string;
  taUpdate?: TaUpdate;
}

const Footer = ({ version, taUpdate }: Props) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="footer">
      <div className="boxed-content">
        <span>© 2021 - {currentYear} </span>
        <span>TubeArchivist </span>
        <span>{version} </span>
        {taUpdate && (
          <>
            <span className="danger-zone">
              {taUpdate.version} available
              {taUpdate.is_breaking && (
                <span className="danger-zone">Breaking Changes!</span>
              )}
            </span>{" "}
            <span>
              <a
                href={`https://github.com/tubearchivist/tubearchivist/releases/tag/${taUpdate.version}`}
                target="_blank"
              >
                Release Page
              </a>{" "}
              |{" "}
            </span>
          </>
        )}
        <span>
          <Link to={`/about/`}>About</Link> |{" "}
          <a
            href="https://github.com/tubearchivist/tubearchivist"
            target="_blank"
          >
            GitHub
          </a>{" "}
          |{" "}
          <a
            href="https://hub.docker.com/r/bbilly1/tubearchivist"
            target="_blank"
          >
            Docker Hub
          </a>{" "}
          |{" "}
          <a href="https://www.tubearchivist.com/discord" target="_blank">
            Discord
          </a>{" "}
          | <a href="https://www.reddit.com/r/TubeArchivist/">Reddit</a>
        </span>
      </div>
    </div>
  );
};

export default Footer;
