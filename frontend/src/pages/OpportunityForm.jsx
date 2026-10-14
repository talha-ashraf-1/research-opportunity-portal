import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createOpportunity, getOpportunity, updateOpportunity } from "../api/opportunities.js";
import { useToast } from "../context/ToastContext.jsx";
import { toInputDate } from "../utils/format.js";

const EMPTY = {
    title: "",
    description: "",
    researchArea: "",
    facultyName: "",
    department: "",
    requiredSkills: "",
    positions: "",
    deadline: "",
    status: "Open"
};

function validateForm(form){
    const errors = {};
    if(form.title.trim().length < 3){
        errors.title = "Title must be at least 3 characters";
    }
    if(form.description.trim().length < 10){
        errors.description = "Description must be at least 10 characters";
    }
    if(!form.researchArea.trim()){
        errors.researchArea = "Research area is required";
    }
    if(!form.facultyName.trim()){
        errors.facultyName = "Faculty name is required";
    }
    if(!form.department.trim()){
        errors.department = "Department is required";
    }
    if(!form.requiredSkills.trim()){
        errors.requiredSkills = "Add at least one required skill";
    }
    const positions = Number(form.positions);
    if(form.positions === "" || !Number.isInteger(positions) || positions < 1){
        errors.positions = "Enter a whole number of 1 or more";
    }
    if(!form.deadline){
        errors.deadline = "Application deadline is required";
    }
    return errors;
}

export default function OpportunityForm(){
    const {id} = useParams();
    const editing = Boolean(id);
    const navigate = useNavigate();
    const {showToast} = useToast();
    const [form, setForm] = useState(EMPTY);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(editing);
    const [saving, setSaving] = useState(false);
    const [loadError, setLoadError] = useState("");

    useEffect(() => {
        if(!editing){
            return;
        }
        getOpportunity(id)
            .then((data) => setForm({
                title: data.title,
                description: data.description,
                researchArea: data.researchArea,
                facultyName: data.facultyName,
                department: data.department,
                requiredSkills: data.requiredSkills,
                positions: String(data.positions),
                deadline: toInputDate(data.deadline),
                status: data.status
            }))
            .catch((err) => setLoadError(err.message))
            .finally(() => setLoading(false));
    }, [id, editing]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm((current) => ({...current, [name]: value}));
        setErrors((current) => ({...current, [name]: undefined}));
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        const found = validateForm(form);
        if(Object.keys(found).length > 0){
            setErrors(found);
            showToast("Please fix the highlighted fields", "error");
            return;
        }
        const payload = {
            ...form,
            title: form.title.trim(),
            description: form.description.trim(),
            researchArea: form.researchArea.trim(),
            facultyName: form.facultyName.trim(),
            department: form.department.trim(),
            requiredSkills: form.requiredSkills.trim(),
            positions: Number(form.positions)
        };
        setSaving(true);
        try{
            const json = editing ? await updateOpportunity(id, payload) : await createOpportunity(payload);
            showToast(editing ? "Opportunity updated" : "Opportunity posted");
            navigate(`/opportunities/${json.data.id}`);
        } catch (err){
            if(err.status === 400 && Array.isArray(err.data)){
                const fieldErrors = {};
                err.data.forEach((issue) => { fieldErrors[issue.field] = issue.message; });
                setErrors(fieldErrors);
            }
            showToast(err.message, "error");
        } finally {
            setSaving(false);
        }
    };

    const field = (name, label, props = {}) => (
        <div className={`field ${errors[name] ? "field-error" : ""}`}>
            <label htmlFor={name}>{label}</label>
            {props.as === "textarea" ? (
                <textarea id={name} name={name} className="input" rows="5" value={form[name]} onChange={handleChange} />
            ) : (
                <input id={name} name={name} className="input" value={form[name]} onChange={handleChange} {...props} />
            )}
            {errors[name] && <span className="error-text">{errors[name]}</span>}
        </div>
    );

    if(loading){
        return <p className="state">Loading opportunity...</p>;
    }
    if(loadError){
        return (
            <div className="state state-error">
                <p>{loadError}</p>
                <Link className="btn btn-small" to="/">Back to opportunities</Link>
            </div>
        );
    }

    return (
        <section className="panel">
            <h2 className="page-title">{editing ? "Edit opportunity" : "Post a research opportunity"}</h2>
            <form onSubmit={handleSubmit} noValidate>
                {field("title", "Research title", {type: "text", maxLength: 150})}
                {field("description", "Research description", {as: "textarea"})}
                <div className="row">
                    {field("researchArea", "Research area", {type: "text"})}
                    {field("requiredSkills", "Required skills (comma separated)", {type: "text"})}
                </div>
                <div className="row">
                    {field("facultyName", "Faculty member name", {type: "text"})}
                    {field("department", "Department", {type: "text"})}
                </div>
                <div className="row row-3">
                    {field("positions", "Available positions", {type: "number", min: 1})}
                    {field("deadline", "Application deadline", {type: "date"})}
                    <div className="field">
                        <label htmlFor="status">Status</label>
                        <select id="status" name="status" className="input" value={form.status} onChange={handleChange}>
                            <option value="Open">Open</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>
                </div>
                <div className="actions">
                    <Link className="btn btn-ghost" to={editing ? `/opportunities/${id}` : "/"}>Cancel</Link>
                    <button className="btn btn-solid" type="submit" disabled={saving}>
                        {saving ? "Saving..." : editing ? "Save changes" : "Post opportunity"}
                    </button>
                </div>
            </form>
        </section>
    );
}
