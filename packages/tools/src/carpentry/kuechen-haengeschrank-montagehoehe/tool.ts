import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type KuechenHaengeschrankMontagehoeheInput = Readonly<{
  readonly countertopHeightMillimeters: number;
  readonly worktopClearanceMillimeters: number;
}>;
export type KuechenHaengeschrankMontagehoeheOutput = Readonly<{
  readonly cabinetBottomMillimeters: number;
}>;

export const calculateKuechenHaengeschrankMontagehoehe = (
  x: KuechenHaengeschrankMontagehoeheInput,
): KuechenHaengeschrankMontagehoeheOutput => {
  if (
    !Number.isFinite(x.countertopHeightMillimeters) ||
    x.countertopHeightMillimeters < 0
  )
    simpleError(
      "countertopHeightMillimeters",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.worktopClearanceMillimeters) ||
    x.worktopClearanceMillimeters < 0
  )
    simpleError(
      "worktopClearanceMillimeters",
      "Provide a finite number at least 0.",
    );
  const cabinetBottomMillimeters =
    x.countertopHeightMillimeters + x.worktopClearanceMillimeters;
  if (!Number.isFinite(cabinetBottomMillimeters))
    simpleError(
      "cabinetBottomMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    cabinetBottomMillimeters: Object.is(cabinetBottomMillimeters, -0)
      ? 0
      : cabinetBottomMillimeters,
  };
};

export const example = {
  input: { countertopHeightMillimeters: 900, worktopClearanceMillimeters: 500 },
  output: { cabinetBottomMillimeters: 1400 },
} satisfies ToolExample<
  KuechenHaengeschrankMontagehoeheInput,
  KuechenHaengeschrankMontagehoeheOutput
>;

export const tool = createSimpleTool({
  id: "carpentry/kuechen-haengeschrank-montagehoehe",
  title: "Kuechen Haengeschrank Montagehoehe",
  description:
    "Height of the bottom of a wall cabinet above the finished floor from countertop height and desired worktop-to-cabinet clearance.",
  inputs: [
    {
      id: "countertopHeightMillimeters",
      kind: "number",
      label: "Countertop Height Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "worktopClearanceMillimeters",
      kind: "number",
      label: "Worktop Clearance Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "cabinetBottomMillimeters",
      kind: "number",
      label: "Cabinet Bottom Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateKuechenHaengeschrankMontagehoehe({
      countertopHeightMillimeters: input.countertopHeightMillimeters as number,
      worktopClearanceMillimeters: input.worktopClearanceMillimeters as number,
    }),
});
export const kuechenHaengeschrankMontagehoeheTool = tool;
export const runKuechenHaengeschrankMontagehoehe = tool.execute;
export default tool;
