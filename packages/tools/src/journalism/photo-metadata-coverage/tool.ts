import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description:
    "Compare caller-supplied requirements and observations for photo metadata coverage.",
  expected: { id: "requiredMetadataFields", label: "Required metadata fields" },
  example: {
    expected: ["creator", "capture date", "rights holder", "license"],
    observed: ["creator", "capture date", "rights holder"],
  },
  id: "journalism/photo-metadata-coverage",
  observed: { id: "presentMetadataFields", label: "Present metadata fields" },
  title: "Photo Metadata Coverage",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
