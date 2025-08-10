import { Schema, model, models, Model, Document } from "mongoose";

const SectionSchema = new Schema(
  {
    type: { type: String, enum: ["title", "paragraph", "image"], required: true },
    value: Schema.Types.Mixed,
  },
  { _id: false }
);

interface SectionDoc {
  type: "title" | "paragraph" | "image";
  value: unknown;
}

interface ContentPageDoc extends Document {
  slug: string;
  sections: SectionDoc[];
  updatedBy?: string;
}

const ContentPageSchema = new Schema<ContentPageDoc>(
  {
    slug: { type: String, required: true, unique: true },
    sections: [SectionSchema],
    updatedBy: String,
  },
  { timestamps: true }
);

export default (models.ContentPage as Model<ContentPageDoc>) || model<ContentPageDoc>("ContentPage", ContentPageSchema);


