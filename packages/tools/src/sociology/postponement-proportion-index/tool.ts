import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PostponementProportionIndexInput = {
  readonly birthsAtOrAboveReferenceAge: number;
  readonly totalBirths: number;
};

export type PostponementProportionIndexOutput = {
  readonly postponementProportion: number;
};

export const postponementProportionIndexExample = {
  input: {
    birthsAtOrAboveReferenceAge: 30,
    totalBirths: 200,
  },
  output: {
    postponementProportion: 0.15,
  },
} satisfies ToolExample<
  PostponementProportionIndexInput,
  PostponementProportionIndexOutput
>;

export const calculatePostponementProportion = (
  input: PostponementProportionIndexInput,
): PostponementProportionIndexOutput => {
  if (!Number.isFinite(input.totalBirths) || input.totalBirths <= 0)
    simpleError(
      "totalBirths",
      "The birth total must be positive.",
      "invalid_value",
    );
  if (
    !Number.isFinite(input.birthsAtOrAboveReferenceAge) ||
    input.birthsAtOrAboveReferenceAge < 0 ||
    input.birthsAtOrAboveReferenceAge > input.totalBirths
  )
    simpleError(
      "birthsAtOrAboveReferenceAge",
      "Late births cannot exceed the total number of births.",
      "invalid_value",
    );
  return {
    postponementProportion:
      input.birthsAtOrAboveReferenceAge / input.totalBirths,
  };
};

export const postponementProportionIndexTool = createSimpleTool({
  calculate: (input) =>
    calculatePostponementProportion({
      birthsAtOrAboveReferenceAge: input.birthsAtOrAboveReferenceAge as number,
      totalBirths: input.totalBirths as number,
    }),
  description:
    "Measure the share of births born to mothers at or above a chosen postponement reference age.",
  id: "sociology/postponement-proportion-index",
  inputs: [
    {
      description:
        "Births to mothers at or above the reference age in the year.",
      id: "birthsAtOrAboveReferenceAge",
      kind: "number",
      label: "Later births",
      minimum: 0,
    },
    {
      description: "All births in the population that year.",
      id: "totalBirths",
      kind: "number",
      label: "Total births",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      description: "Share of births occurring at the later ages.",
      id: "postponementProportion",
      kind: "number",
      label: "Postponement proportion",
    },
  ],
  title: "Postponement Proportion Index Calculator",
});
export const runPostponementProportionIndex =
  postponementProportionIndexTool.execute;
export default postponementProportionIndexTool;
