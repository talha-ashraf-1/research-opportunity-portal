import express from "express";
import { prisma } from "../prisma.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { createOpportunitySchema, updateOpportunitySchema, idParamSchema } from "../schemas/opportunity.schema.js";

const router = express.Router();

router.get("/", asyncHandler(async(req, res) => {
    const {status, search} = req.query;
    const where = {};
    if(status === "Open" || status === "Closed"){
        where.status = status;
    }
    if(typeof search === "string" && search.trim()){
        const term = search.trim();
        where.OR = [
            {title: {contains: term, mode: "insensitive"}},
            {researchArea: {contains: term, mode: "insensitive"}},
            {facultyName: {contains: term, mode: "insensitive"}},
            {requiredSkills: {contains: term, mode: "insensitive"}}
        ];
    }
    const opportunities = await prisma.opportunities.findMany({
        where,
        orderBy: {id: "desc"}
    });
    if(opportunities.length === 0){
        res.status(200).json({
            success: false,
            message: `Opportunities array is Empty`,
            data: []
        });
    } else {
        res.status(200).json({
            success: true,
            message: `Here are all Opportunities`,
            data: opportunities
        });
    }
}));
router.get("/:id", validate(idParamSchema, "params"), asyncHandler(async(req, res) => {
    const Id = req.params.id;
    const opportunity = await prisma.opportunities.findUnique({
        where: {id: Id}
    });
    if(!opportunity){
        return res.status(404).json({
            success: false,
            message: `Opportunity corresponding to given ID Not Found`,
            data: []
        });
    }
    res.status(200).json({
        success: true,
        message: `Here is opportunity corresponding to given ID`,
        data: opportunity
    });
}));
router.post("/", validate(createOpportunitySchema), asyncHandler(async(req, res) => {
    const {title, description, researchArea, facultyName, department, requiredSkills, positions, deadline, status} = req.body;
    const newOpportunity = await prisma.opportunities.create({
        data: {
            title,
            description,
            researchArea,
            facultyName,
            department,
            requiredSkills,
            positions,
            deadline,
            status
        }
    });
    return res.status(201).json({
        success: true,
        message: `Opportunity created with ID ${newOpportunity.id}`,
        data: newOpportunity
    });
}));
router.put("/:id", validate(idParamSchema, "params"), validate(updateOpportunitySchema), asyncHandler(async(req, res) => {
    const target = req.params.id;
    const existing = await prisma.opportunities.findUnique({
        where: {id: target}
    });
    if(!existing){
        return res.status(404).json({
            success: false,
            message: "Opportunity Corresponding To Given Id Not Found",
            data: []
        });
    }
    const {title, description, researchArea, facultyName, department, requiredSkills, positions, deadline, status} = req.body;
    const updated = {}
    if(title){
        updated.title = title;
    }
    if(description){
        updated.description = description;
    }
    if(researchArea){
        updated.researchArea = researchArea;
    }
    if(facultyName){
        updated.facultyName = facultyName;
    }
    if(department){
        updated.department = department;
    }
    if(requiredSkills){
        updated.requiredSkills = requiredSkills;
    }
    if(typeof positions === "number"){
        updated.positions = positions;
    }
    if(deadline){
        updated.deadline = deadline;
    }
    if(status){
        updated.status = status;
    }
    const opportunity = await prisma.opportunities.update({
        where: {id: target},
        data: updated
    });
    return res.status(200).json({
        success: true,
        message: `Opportunity Updated`,
        data: opportunity
    });
}));
router.delete("/:id", validate(idParamSchema, "params"), asyncHandler(async(req, res) => {
    const target = req.params.id;
    const existing = await prisma.opportunities.findUnique({
        where: {id: target}
    });
    if(!existing){
        return res.status(404).json({
            success: false,
            message: "Opportunity Corresponding To Given Id Not Found",
            data: []
        });
    }
    const opportunity = await prisma.opportunities.delete({
        where: {id: target}
    });
    return res.status(200).json({
        success: true,
        message: `Following Opportunity Deleted .... `,
        data: opportunity
    });
}));

export default router;