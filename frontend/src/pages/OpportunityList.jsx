import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllOpportunities, updateOpportunity, deleteOpportunity } from "../api/opportunities.js";
import { useToast } from "../context/ToastContext.jsx";
import OpportunityCard from "../components/OpportunityCard.jsx";
import ConfirmDialog from "../components/ConfirmDialoge.jsx";

const FILTERS = ["All", "Open", "Closed"];

export default function OpportunityList(){
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [status, setStatus] = useState("All");
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [toDelete, setToDelete] = useState(null);
    const [busy, setBusy] = useState(false);
    const {showToast} = useToast();

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search.trim()), 350);
        return () => clearTimeout(timer);
    }, [search]);

    const load = useCallback(async() => {
        setLoading(true);
        setError("");
        try{
            setOpportunities(await getAllOpportunities({status, search: debouncedSearch}));
        } catch (err){
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [status, debouncedSearch]);

    useEffect(() => {
        load();
    }, [load]);

    const handleClose = async(opportunity) => {
        setBusy(true);
        try{
            await updateOpportunity(opportunity.id, {status: "Closed"});
            showToast(`"${opportunity.title}" is now closed`);
            await load();
        } catch (err){
            showToast(err.message, "error");
        } finally {
            setBusy(false);
        }
    };

    const handleDelete = async() => {
        setBusy(true);
        try{
            await deleteOpportunity(toDelete.id);
            showToast(`"${toDelete.title}" was deleted`);
            setToDelete(null);
            await load();
        } catch (err){
            showToast(err.message, "error");
            setToDelete(null);
        } finally {
            setBusy(false);
        }
    };

    return (
        <section>
            <div className="toolbar">
                <input
                    className="input search"
                    type="search"
                    placeholder="Search by title, area, faculty or skill"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className="segmented" role="group" aria-label="Filter by status">
                    {FILTERS.map((filter) => (
                        <button key={filter} className={status === filter ? "active" : ""} onClick={() => setStatus(filter)}>
                            {filter}
                        </button>
                    ))}
                </div>
                <Link className="btn btn-solid" to="/new">Post opportunity</Link>
            </div>

            {loading && <p className="state">Loading opportunities...</p>}
            {!loading && error && (
                <div className="state state-error">
                    <p>{error}</p>
                    <button className="btn btn-small" onClick={load}>Try again</button>
                </div>
            )}
            {!loading && !error && opportunities.length === 0 && (
                <div className="state">
                    <p>No opportunities match your search yet.</p>
                    <Link className="btn btn-small" to="/new">Post the first one</Link>
                </div>
            )}
            {!loading && !error && opportunities.length > 0 && (
                <div className="grid">
                    {opportunities.map((opportunity) => (
                        <OpportunityCard
                            key={opportunity.id}
                            opportunity={opportunity}
                            busy={busy}
                            onClose={handleClose}
                            onDelete={setToDelete}
                        />
                    ))}
                </div>
            )}

            <ConfirmDialog
                open={Boolean(toDelete)}
                title="Delete this opportunity?"
                message={toDelete ? `"${toDelete.title}" will be removed permanently.` : ""}
                confirmLabel="Delete"
                busy={busy}
                onConfirm={handleDelete}
                onCancel={() => setToDelete(null)}
            />
        </section>
    );
}