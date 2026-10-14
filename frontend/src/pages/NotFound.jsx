import { Link } from "react-router-dom";

export default function NotFound(){
    return (
        <section className="panel center">
            <h2 className="page-title">Page not found</h2>
            <p className="muted">The page you opened does not exist.</p>
            <Link className="btn" to="/">Back to opportunities</Link>
        </section>
    );
}