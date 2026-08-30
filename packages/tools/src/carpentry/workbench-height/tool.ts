import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WorkbenchHeightInput = Readonly<{
  readonly elbowHeightMillimeters: number;
  readonly clearanceMillimeters: number;
}>;
export type WorkbenchHeightOutput = Readonly<{
  readonly benchHeightMillimeters: number;
}>;

export const calculateWorkbenchHeight = (
  x: WorkbenchHeightInput,
): WorkbenchHeightOutput => {
  if (
    !Number.isFinite(x.elbowHeightMillimeters) ||
    x.elbowHeightMillimeters < 0
  )
    simpleError(
      "elbowHeightMillimeters",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.clearanceMillimeters) || x.clearanceMillimeters < 0)
    simpleError("clearanceMillimeters", "Provide a finite number at least 0.");
  if (x.clearanceMillimeters >= x.elbowHeightMillimeters)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const benchHeightMillimeters =
    x.elbowHeightMillimeters - x.clearanceMillimeters;
  if (!Number.isFinite(benchHeightMillimeters))
    simpleError(
      "benchHeightMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    benchHeightMillimeters: Object.is(benchHeightMillimeters, -0)
      ? 0
      : benchHeightMillimeters,
  };
};

export const example = {
  input: { elbowHeightMillimeters: 1000, clearanceMillimeters: 100 },
  output: { benchHeightMillimeters: 900 },
} satisfies ToolExample<WorkbenchHeightInput, WorkbenchHeightOutput>;

export const tool = createSimpleTool({
  id: "carpentry/workbench-height",
  title: "Workbench Height",
  description:
    "Bench-top height from a worker's measured standing elbow height minus a user-chosen task clearance.",
  inputs: [
    {
      id: "elbowHeightMillimeters",
      kind: "number",
      label: "Elbow Height Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "clearanceMillimeters",
      kind: "number",
      label: "Clearance Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "benchHeightMillimeters",
      kind: "number",
      label: "Bench Height Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateWorkbenchHeight({
      elbowHeightMillimeters: input.elbowHeightMillimeters as number,
      clearanceMillimeters: input.clearanceMillimeters as number,
    }),
});
export const workbenchHeightTool = tool;
export const runWorkbenchHeight = tool.execute;
export default tool;
