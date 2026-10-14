import { Star } from "./Ornaments.jsx";

export default function StatusBanner({status}){
    const closed = status === "Closed";
    return (
        <div className={`banner ${closed ? "banner-closed" : "banner-open"}`} title={`Status: ${status}`}>
            <Star />
            <span>{status}</span>
        </div>
    );
}
