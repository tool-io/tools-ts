import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DrywallTapeLengthInput = Readonly<{
  readonly seamLengthM: number;
  readonly wastePercent: number;
}>;
export type DrywallTapeLengthOutput = Readonly<{
  readonly tapeLengthM: number;
}>;

export const calculateDrywallTapeLength = (
  x: DrywallTapeLengthInput,
): DrywallTapeLengthOutput => {
  if (!Number.isFinite(x.seamLengthM) || x.seamLengthM < 0)
    simpleError("seamLengthM", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.wastePercent) || x.wastePercent < 0)
    simpleError("wastePercent", "Provide a finite number at least 0.");
  const tapeLengthM = x.seamLengthM * (1 + x.wastePercent / 100);
  if (!Number.isFinite(tapeLengthM))
    simpleError("tapeLengthM", "The inputs produce an invalid result.");
  return { tapeLengthM: Object.is(tapeLengthM, -0) ? 0 : tapeLengthM };
};

export const example = {
  input: { seamLengthM: 40, wastePercent: 10 },
  output: { tapeLengthM: 44 },
} satisfies ToolExample<DrywallTapeLengthInput, DrywallTapeLengthOutput>;

export const tool = createSimpleTool({
  id: "construction/drywall-tape-length",
  title: "Drywall Tape Length",
  description:
    "Estimate drywall joint tape from measured seam length plus an allowance for waste.",
  inputs: [
    {
      id: "seamLengthM",
      kind: "number",
      label: "Measured seams",
      unit: "m",
      minimum: 0,
    },
    {
      id: "wastePercent",
      kind: "number",
      label: "Waste allowance",
      unit: "%",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "tapeLengthM", kind: "number", label: "Tape length", unit: "m" },
  ],
  calculate: (input) =>
    calculateDrywallTapeLength({
      seamLengthM: input.seamLengthM as number,
      wastePercent: input.wastePercent as number,
    }),
});
export const drywallTapeLengthTool = tool;
export const runDrywallTapeLength = tool.execute;
export default tool;
