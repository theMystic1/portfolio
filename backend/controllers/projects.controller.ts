// backend/controllers/experienceController.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { Projects } from "@/backend/models/model";
import { dbConnect } from "@/backend/lib/mongoose";
import { getUserFromRequest, unauthorizedResponse } from "@/backend/lib/auth";

// Small helper to enforce JSON for non-GET requests

// CREATE  -------------------------------------------------
export const createProjects = async (
  req: NextRequest
): Promise<NextResponse> => {
  try {
    const user = getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    await dbConnect();

    const data = await req.json();

    const projects = await Projects.create(data);

    return NextResponse.json(
      {
        ok: true,
        message: "Projects created successfully",
        projects,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating Projects:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e: any) => e.message);
      return NextResponse.json(
        { ok: false, message: "Validation failed", errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { ok: false, message: "Internal server error" },
      { status: 500 }
    );
  }
};

// GET ALL  ------------------------------------------------
export const getProjects = async (_req: NextRequest): Promise<NextResponse> => {
  try {
    await dbConnect();

    const projects = await Projects.find()
      .sort({ "company.startDate": -1 })
      .lean();

    return NextResponse.json(
      {
        ok: true,
        count: projects.length,
        projects,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { ok: false, message: "Internal server error" },
      { status: 500 }
    );
  }
};

// GET BY ID  ----------------------------------------------
export const getProjectsById = async (id: string): Promise<NextResponse> => {
  try {
    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { ok: false, message: "Invalid experience id" },
        { status: 400 }
      );
    }

    const project = await Projects.findById(id).lean();

    if (!project) {
      return NextResponse.json(
        { ok: false, message: "project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        project,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching project by id:", error);
    return NextResponse.json(
      { ok: false, message: "Internal server error" },
      { status: 500 }
    );
  }
};

// UPDATE (PATCH)  -----------------------------------------
export const updateProjects = async (
  req: NextRequest,
  id: string
): Promise<NextResponse> => {
  try {
    const user = getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { ok: false, message: "Invalid projects id" },
        { status: 400 }
      );
    }

    const data = await req.json();

    // Prevent overriding _id if it comes in body
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...updateData } = data;

    const project = await Projects.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();

    if (!project) {
      return NextResponse.json(
        { ok: false, message: "projects not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        message: "Experience updated successfully",
        project,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating experience:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e: any) => e.message);
      return NextResponse.json(
        { ok: false, message: "Validation failed", errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { ok: false, message: "Internal server error" },
      { status: 500 }
    );
  }
};

// DELETE  -------------------------------------------------
export const deleteProjects = async (
  req: NextRequest,
  id: string
): Promise<NextResponse> => {
  try {
    const user = getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { ok: false, message: "Invalid project id" },
        { status: 400 }
      );
    }

    const deleted = await Projects.findByIdAndDelete(id).lean();

    if (!deleted) {
      return NextResponse.json(
        { ok: false, message: "project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        message: "Experience deleted successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting experience:", error);
    return NextResponse.json(
      { ok: false, message: "Internal server error" },
      { status: 500 }
    );
  }
};
