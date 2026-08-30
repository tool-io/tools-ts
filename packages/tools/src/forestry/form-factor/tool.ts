import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FormFactorInput = Readonly<{
  readonly measuredStemCubicMeters: number;
  readonly basalAreaSquareMeters: number;
  readonly treeHeightMeters: number;
}>;
export type FormFactorOutput = Readonly<{
  readonly formFactor: number;
}>;

export const calculateFormFactor = (x: FormFactorInput): FormFactorOutput => {
  if (
    !Number.isFinite(x.measuredStemCubicMeters) ||
    x.measuredStemCubicMeters < 0
  )
    simpleError(
      "measuredStemCubicMeters",
      "Provide a finite nonnegative number.",
    );
  if (!Number.isFinite(x.basalAreaSquareMeters) || x.basalAreaSquareMeters <= 0)
    simpleError("basalAreaSquareMeters", "Provide a finite positive number.");
  if (!Number.isFinite(x.treeHeightMeters) || x.treeHeightMeters <= 0)
    simpleError("treeHeightMeters", "Provide a finite positive number.");
  const formFactor =
    x.measuredStemCubicMeters / (x.basalAreaSquareMeters * x.treeHeightMeters);
  if (!Number.isFinite(formFactor))
    simpleError(
      "formFactor",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { formFactor: Object.is(formFactor, -0) ? 0 : formFactor };
};

export const example = {
  input: {
    measuredStemCubicMeters: 0.5,
    basalAreaSquareMeters: 0.05,
    treeHeightMeters: 20,
  },
  output: { formFactor: 0.5 },
} satisfies ToolExample<FormFactorInput, FormFactorOutput>;

export const tool = createSimpleTool({
  id: "forestry/form-factor",
  title: "Form Factor",
  description:
    "Tree stem form factor: measured stem volume divided by basal area times tree height.",
  inputs: [
    {
      id: "measuredStemCubicMeters",
      kind: "number",
      label: "Measured Stem Cubic Meters",
      unit: "m3",
      minimum: 0,
    },
    {
      id: "basalAreaSquareMeters",
      kind: "number",
      label: "Basal Area Square Meters",
      unit: "m2",
      minimum: 0,
    },
    {
      id: "treeHeightMeters",
      kind: "number",
      label: "Tree Height Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [{ id: "formFactor", kind: "number", label: "Form Factor" }],
  calculate: (input) =>
    calculateFormFactor({
      measuredStemCubicMeters: input.measuredStemCubicMeters as number,
      basalAreaSquareMeters: input.basalAreaSquareMeters as number,
      treeHeightMeters: input.treeHeightMeters as number,
    }),
});
export const formFactorTool = tool;
export const runFormFactor = tool.execute;
export default tool;
