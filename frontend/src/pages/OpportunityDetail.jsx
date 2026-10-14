import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getOpportunity, updateOpportunity, deleteOpportunity } from "../api/opportunities.js";
import { useToast } from "../context/ToastContext.jsx";
import StatusBanner from "../components/StatusBanner.jsx";
import ConfirmDialog from "../components/ConfirmDialoge.jsx";
import { Divider } from "../components/Ornaments.jsx";
import { formatDate, splitSkills } from "../utils/format.js";

export default function OpportunityDetail(){
    const {id} = useParams();
    const navigate = useNavigate();
    const {showToast} = useToast();
    const [opportunity, setOpportunity] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [confirming, setConfirming] = useState(false);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        let active = true;
        setLoading(true);
        setError("");
        getOpportunity(id)
            .then((data) => active && setOpportunity(data))
            .catch((err) => active && setError(err.message))
            .finally(() => active && setLoading(false));
        return () => { active = false; };
    }, [id]);

    const handleClose = async() => {
        setBusy(true);
        try{
            const json = await updateOpportunity(id, {status: "Closed"});
            setOpportunity(json.data);
            showToast("Opportunity closed");
        } catch (err){
            showToast(err.message, "error");
        } finally {
            setBusy(false);
        }
    };

    const handleDelete = async() => {
        setBusy(true);
        try{
            await deleteOpportunity(id);
            showToast("Opportunity deleted");
            navigate("/");
        } catch (err){
            showToast(err.message, "error");
            setConfirming(false);
            setBusy(false);
        }
    };

    if(loading){
        return <p className="state">Loading opportunity...</p>;
    }
    if(error){
        return (
            <div className="state state-error">
                <p>{error}</p>
                <Link className="btn btn-small" to="/">Back to opportunities</Link>
            </div>
        );
    }

    const {title, description, researchArea, facultyName, department, requiredSkills, positions, deadline, status} = opportunity;
    return (
        <section className="panel detail">
            <StatusBanner status={status} />
            <Link className="back" to="/">Back to opportunities</Link>
            <p className="card-area">{researchArea}</p>
            <h2 className="page-title left">{title}</h2>
            <p className="card-meta">{facultyName}, {department}</p>
            <Divider className="divider-tight" />
            <p className="description">{description}</p>
            <h4 className="label">Required skills</h4>
            <ul className="chips">
                {splitSkills(requiredSkills).map((skill) => <li key={skill}>{skill}</li>)}
            </ul>
            <dl className="facts facts-wide">
                <div><dt>Open positions</dt><dd>{positions}</dd></div>
                <div><dt>Application deadline</dt><dd>{formatDate(deadline)}</dd></div>
                <div><dt>Status</dt><dd>{status}</dd></div>
            </dl>
            <div className="actions">
                <Link className="btn" to={`/opportunities/${id}/edit`}>Edit</Link>
                {status === "Open" && <button className="btn" disabled={busy} onClick={handleClose}>Close opportunity</button>}
                <button className="btn btn-danger" disabled={busy} onClick={() => setConfirming(true)}>Delete</button>
            </div>
            <ConfirmDialog
                open={confirming}
                title="Delete this opportunity?"
                message={`"${title}" will be removed permanently.`}
                confirmLabel="Delete"
                busy={busy}
                onConfirm={handleDelete}
                onCancel={() => setConfirming(false)}
            />
        </section>
    );
}