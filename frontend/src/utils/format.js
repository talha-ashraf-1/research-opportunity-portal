export const formatDate = (value) => new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
});

export const toInputDate = (value) => new Date(value).toISOString().slice(0, 10);

export const splitSkills = (skills) => skills.split(",").map((skill) => skill.trim()).filter(Boolean);

export const isExpired = (deadline) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(deadline) < today;
};