// backend/controllers/technologiesController.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { Technologies } from "@/backend/models/model";
import { dbConnect } from "@/backend/lib/mongoose";
import { getUserFromRequest, unauthorizedResponse } from "@/backend/lib/auth";

// CREATE  -------------------------------------------------
export const createTechnologies = async (
  req: NextRequest
): Promise<NextResponse> => {
  try {
    const user = getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    await dbConnect();

    const data = await req.json();

    const technology = await Technologies.create(data);

    return NextResponse.json(
      {
        ok: true,
        message: "Technology created successfully",
        technology,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating technology:", error);

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
export const getTechnologies = async (
  _req: NextRequest
): Promise<NextResponse> => {
  try {
    await dbConnect();

    const technologies = await Technologies.find()
      .sort({ createdAt: -1 }) // adjust field if your schema differs
      .lean();

    return NextResponse.json(
      {
        ok: true,
        count: technologies.length,
        technologies,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching technologies:", error);
    return NextResponse.json(
      { ok: false, message: "Internal server error" },
      { status: 500 }
    );
  }
};

// GET BY ID  ----------------------------------------------
export const getTechnologiesById = async (
  id: string
): Promise<NextResponse> => {
  try {
    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { ok: false, message: "Invalid technology id" },
        { status: 400 }
      );
    }

    const technology = await Technologies.findById(id).lean();

    if (!technology) {
      return NextResponse.json(
        { ok: false, message: "Technology not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        technology,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching technology by id:", error);
    return NextResponse.json(
      { ok: false, message: "Internal server error" },
      { status: 500 }
    );
  }
};

// UPDATE (PATCH)  -----------------------------------------
export const updateTechnologies = async (
  req: NextRequest,
  id: string
): Promise<NextResponse> => {
  try {
    const user = getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { ok: false, message: "Invalid technology id" },
        { status: 400 }
      );
    }

    const data = await req.json();

    // Prevent overriding _id if it comes in body
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...updateData } = data;

    const technology = await Technologies.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();

    if (!technology) {
      return NextResponse.json(
        { ok: false, message: "Technology not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        message: "Technology updated successfully",
        technology,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating technology:", error);

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
export const deleteTechnologies = async (
  req: NextRequest,
  id: string
): Promise<NextResponse> => {
  try {
    const user = getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { ok: false, message: "Invalid technology id" },
        { status: 400 }
      );
    }

    const deleted = await Technologies.findByIdAndDelete(id).lean();

    if (!deleted) {
      return NextResponse.json(
        { ok: false, message: "Technology not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        message: "Technology deleted successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting technology:", error);
    return NextResponse.json(
      { ok: false, message: "Internal server error" },
      { status: 500 }
    );
  }
};
