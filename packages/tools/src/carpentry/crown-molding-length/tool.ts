import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CrownMoldingLengthInput = Readonly<{
  readonly wallRunsM: readonly number[];
  readonly wastePercent: number;
}>;
export type CrownMoldingLengthOutput = Readonly<{
  readonly materialLengthM: number;
}>;

export const calculateCrownMoldingLength = (
  x: CrownMoldingLengthInput,
): CrownMoldingLengthOutput => {
  if (
    !Array.isArray(x.wallRunsM) ||
    !x.wallRunsM.every((v) => typeof v === "number" && Number.isFinite(v))
  )
    simpleError("wallRunsM", "Provide a finite number list.");
  if (!Number.isFinite(x.wastePercent) || x.wastePercent < 0)
    simpleError("wastePercent", "Provide a finite number at least 0.");
  if (!x.wallRunsM.every((v) => v >= 0))
    simpleError("wallRunsM", "Runs cannot be negative.");
  const materialLengthM =
    x.wallRunsM.reduce((a, b) => a + b, 0) * (1 + x.wastePercent / 100);
  if (!Number.isFinite(materialLengthM))
    simpleError("materialLengthM", "The inputs produce an invalid result.");
  return {
    materialLengthM: Object.is(materialLengthM, -0) ? 0 : materialLengthM,
  };
};

export const example = {
  input: { wallRunsM: [3, 4], wastePercent: 10 },
  output: { materialLengthM: 7.700000000000001 },
} satisfies ToolExample<CrownMoldingLengthInput, CrownMoldingLengthOutput>;

export const tool = createSimpleTool({
  id: "carpentry/crown-molding-length",
  title: "Crown Molding Length",
  description:
    "Total measured crown-molding runs and add a project-specific cut-and-waste allowance.",
  inputs: [
    {
      id: "wallRunsM",
      kind: "numberList",
      label: "Measured crown runs",
      unit: "m",
    },
    {
      id: "wastePercent",
      kind: "number",
      label: "Cut allowance",
      unit: "%",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "materialLengthM",
      kind: "number",
      label: "Crown-molding material length",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateCrownMoldingLength({
      wallRunsM: input.wallRunsM as readonly number[],
      wastePercent: input.wastePercent as number,
    }),
});
export const crownMoldingLengthTool = tool;
export const runCrownMoldingLength = tool.execute;
export default tool;
