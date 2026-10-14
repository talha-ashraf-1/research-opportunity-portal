import { Routes, Route, NavLink } from "react-router-dom";
import { Background, EdgeOrnaments, Divider } from "./components/Ornaments.jsx";
import OpportunityList from "./pages/OpportunityList.jsx";
import OpportunityDetail from "./pages/OpportunityDetail.jsx";
import OpportunityForm from "./pages/OpportunityForm.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App(){
    return (
        <>
            <Background />
            <EdgeOrnaments />
            <div className="shell">
                <header className="site-header">
                    <Divider />
                    <h1 className="brand">Research Opportunity Portal</h1>
                    <p className="brand-sub">One place to post, find and manage university research openings</p>
                    <nav className="nav">
                        <NavLink to="/" end>Opportunities</NavLink>
                        <NavLink to="/new">Post Opportunity</NavLink>
                    </nav>
                    <Divider />
                </header>
                <main className="content">
                    <Routes>
                        <Route path="/" element={<OpportunityList />} />
                        <Route path="/opportunities/:id" element={<OpportunityDetail />} />
                        <Route path="/new" element={<OpportunityForm />} />
                        <Route path="/opportunities/:id/edit" element={<OpportunityForm />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
            </div>
        </>
    );
}