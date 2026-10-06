import {z as zod} from "zod";

const dateField = (name) => zod.string(`${name} is required`)
    .refine((value) => !Number.isNaN(Date.parse(value)), `${name} must be a valid date`)
    .transform((value) => new Date(value));

const shape = {
    title: zod.string("Title is required").trim().min(3, "Title must be at least 3 characters").max(150, "Title must be at most 150 characters"),
    description: zod.string("Description is required").trim().min(10, "Description must be at least 10 characters").max(2000, "Description must be at most 2000 characters"),
    researchArea: zod.string("Research area is required").trim().min(2, "Research area must be at least 2 characters").max(100, "Research area must be at most 100 characters"),
    facultyName: zod.string("Faculty name is required").trim().min(2, "Faculty name must be at least 2 characters").max(100, "Faculty name must be at most 100 characters"),
    department: zod.string("Department is required").trim().min(2, "Department must be at least 2 characters").max(100, "Department must be at most 100 characters"),
    requiredSkills: zod.string("Required skills are required").trim().min(2, "Required skills must be at least 2 characters").max(300, "Required skills must be at most 300 characters"),
    positions: zod.number("Positions must be a number").int("Positions must be a whole number").min(1, "At least 1 position is required").max(100, "Positions cannot exceed 100"),
    deadline: dateField("Deadline"),
    status: zod.enum(["Open", "Closed"], "Status must be either Open or Closed")
};

const startOfToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
};

export const createOpportunitySchema = zod.object({ ...shape, status: shape.status.default("Open") })
    .refine((data) => data.deadline >= startOfToday(), {
        message: "Deadline cannot be in the past",
        path: ["deadline"]
    });

export const updateOpportunitySchema = zod.object(shape).partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field is required to update"
    });

export const idParamSchema = zod.object({
    id: zod.coerce.number("Id must be a number").int("Id must be a whole number").positive("Id must be a positive number")
});