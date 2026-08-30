import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TreppenSicherheitsregelInput = Readonly<{
  readonly goingMillimeters: number;
  readonly riserMillimeters: number;
}>;
export type TreppenSicherheitsregelOutput = Readonly<{
  readonly safetyMillimeters: number;
}>;

export const calculateTreppenSicherheitsregel = (
  x: TreppenSicherheitsregelInput,
): TreppenSicherheitsregelOutput => {
  if (!Number.isFinite(x.goingMillimeters) || x.goingMillimeters < 0)
    simpleError("goingMillimeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.riserMillimeters) || x.riserMillimeters < 0)
    simpleError("riserMillimeters", "Provide a finite number at least 0.");
  const safetyMillimeters = x.goingMillimeters + x.riserMillimeters;
  if (!Number.isFinite(safetyMillimeters))
    simpleError(
      "safetyMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    safetyMillimeters: Object.is(safetyMillimeters, -0) ? 0 : safetyMillimeters,
  };
};

export const example = {
  input: { goingMillimeters: 290, riserMillimeters: 170 },
  output: { safetyMillimeters: 460 },
} satisfies ToolExample<
  TreppenSicherheitsregelInput,
  TreppenSicherheitsregelOutput
>;

export const tool = createSimpleTool({
  id: "carpentry/treppen-sicherheitsregel",
  title: "Treppen Sicherheitsregel",
  description:
    "Compute the German stair safety-rule dimension as tread going plus riser height; this is a planning metric, not a structural or code check.",
  inputs: [
    {
      id: "goingMillimeters",
      kind: "number",
      label: "Going Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "riserMillimeters",
      kind: "number",
      label: "Riser Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "safetyMillimeters",
      kind: "number",
      label: "Safety Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateTreppenSicherheitsregel({
      goingMillimeters: input.goingMillimeters as number,
      riserMillimeters: input.riserMillimeters as number,
    }),
});
export const treppenSicherheitsregelTool = tool;
export const runTreppenSicherheitsregel = tool.execute;
export default tool;
