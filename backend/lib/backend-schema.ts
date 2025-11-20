import { Schema } from "mongoose";

/* ---- Experience ---- */
export const experienceSchema = new Schema(
  {
    role: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    company: {
      name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 100,
      },
      jobLocation: { type: String, trim: true },
      jobType: { type: String }, // enum if you have LOCATION_TYPES
    },
    projects: [
      {
        title: { type: String, required: true },
        description: { type: String },
        technologies: { type: [String], default: [] },
        features: { type: [String], default: [] },
      },
    ],
    startDate: { type: Date, required: true },
    endDate: {
      type: Date,
      validate: {
        validator: function (this: any, value?: Date) {
          if (!value) return true; // allow empty endDate
          const start =
            this.startDate instanceof Date
              ? this.startDate
              : new Date(this.startDate);
          const end = value instanceof Date ? value : new Date(value);

          if (isNaN(start.getTime())) return true; // or return false if startDate is required
          return end.getTime() >= start.getTime();
        },
        message: "End date cannot be before start date",
      },
    },

    isCurrent: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

/* ---- Technology ---- */
export const technologySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    icon: { type: String, trim: true },
    color: { type: String, trim: true },
  },
  { timestamps: true, versionKey: false }
);

/* ---- Projects ---- */
export const projectsSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: null },
    technologies: { type: [String], default: [] },
    features: { type: [String], default: [] },
    coverImage: {
      type: String,
      required: [true, "Cover image is missing"],
      trim: true,
    },
  },
  { timestamps: true, versionKey: false }
);
2;
export type Bucket = "day" | "week" | "month" | "quarter" | "year";
