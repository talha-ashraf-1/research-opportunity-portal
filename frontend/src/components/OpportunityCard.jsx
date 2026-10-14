import { Link } from "react-router-dom";
import StatusBanner from "./StatusBanner.jsx";
import { formatDate, isExpired, splitSkills } from "../utils/format.js";

export default function OpportunityCard({opportunity, busy, onClose, onDelete}){
    const {id, title, researchArea, facultyName, department, requiredSkills, positions, deadline, status} = opportunity;
    const open = status === "Open";
    return (
        <article className={`card ${open ? "" : "card-closed"}`}>
            <StatusBanner status={status} />
            <p className="card-area">{researchArea}</p>
            <h3 className="card-title"><Link to={`/opportunities/${id}`}>{title}</Link></h3>
            <p className="card-meta">{facultyName}, {department}</p>
            <ul className="chips">
                {splitSkills(requiredSkills).slice(0, 4).map((skill) => <li key={skill}>{skill}</li>)}
            </ul>
            <dl className="facts">
                <div><dt>Positions</dt><dd>{positions}</dd></div>
                <div>
                    <dt>Deadline</dt>
                    <dd className={open && isExpired(deadline) ? "expired" : ""}>{formatDate(deadline)}</dd>
                </div>
            </dl>
            <div className="actions">
                <Link className="btn btn-small" to={`/opportunities/${id}`}>View</Link>
                <Link className="btn btn-small" to={`/opportunities/${id}/edit`}>Edit</Link>
                {open && <button className="btn btn-small" disabled={busy} onClick={() => onClose(opportunity)}>Close</button>}
                <button className="btn btn-small btn-danger" disabled={busy} onClick={() => onDelete(opportunity)}>Delete</button>
            </div>
        </article>
    );
}
