// backend/controllers/experienceController.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { Experience } from "@/backend/models/model";
import { dbConnect } from "@/backend/lib/mongoose";
import { getUserFromRequest, unauthorizedResponse } from "@/backend/lib/auth";

// Small helper to enforce JSON for non-GET requests
function ensureJsonRequest(req: NextRequest): NextResponse | null {
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json(
      {
        ok: false,
        message: "Content-Type must be application/json",
      },
      { status: 400 }
    );
  }
  return null;
}

// CREATE  -------------------------------------------------
export const createExperience = async (
  req: NextRequest
): Promise<NextResponse> => {
  try {
    const user = getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    await dbConnect();

    const data = await req.json();

    const experience = await Experience.create(data);

    return NextResponse.json(
      {
        ok: true,
        message: "Experience created successfully",
        experience,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating experience:", error);

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
export const getExperiences = async (
  _req: NextRequest
): Promise<NextResponse> => {
  try {
    await dbConnect();

    const experiences = await Experience.find()
      .sort({ "company.startDate": -1 })
      .lean();

    return NextResponse.json(
      {
        ok: true,
        count: experiences.length,
        experiences,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching experiences:", error);
    return NextResponse.json(
      { ok: false, message: "Internal server error" },
      { status: 500 }
    );
  }
};

// GET BY ID  ----------------------------------------------
export const getExperienceById = async (id: string): Promise<NextResponse> => {
  try {
    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { ok: false, message: "Invalid experience id" },
        { status: 400 }
      );
    }

    const experience = await Experience.findById(id).lean();

    if (!experience) {
      return NextResponse.json(
        { ok: false, message: "Experience not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        experience,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching experience by id:", error);
    return NextResponse.json(
      { ok: false, message: "Internal server error" },
      { status: 500 }
    );
  }
};

// UPDATE (PATCH)  -----------------------------------------
export const updateExperience = async (
  req: NextRequest,
  id: string
): Promise<NextResponse> => {
  try {
    const user = getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    // console.log(id);

    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { ok: false, message: "Invalid experience id" },
        { status: 400 }
      );
    }

    const data = await req.json();

    const { _id, ...updateData } = data;

    const doc = await Experience.findById(id);
    if (!doc) {
      return NextResponse.json(
        { ok: false, message: "Experience not found" },
        { status: 404 }
      );
    }

    // Merge user payload into the doc
    Object.assign(doc, data);

    // This runs schema validators with proper doc context
    await doc.save();

    return NextResponse.json(
      {
        ok: true,
        message: "Experience updated successfully",
        experience: doc,
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
export const deleteExperience = async (
  req: NextRequest,
  id: string
): Promise<NextResponse> => {
  try {
    const user = getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { ok: false, message: "Invalid experience id" },
        { status: 400 }
      );
    }

    const deleted = await Experience.findByIdAndDelete(id).lean();

    if (!deleted) {
      return NextResponse.json(
        { ok: false, message: "Experience not found" },
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
