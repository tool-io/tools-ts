import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TreppenBequemlichkeitsregelInput = Readonly<{
  readonly goingMillimeters: number;
  readonly riserMillimeters: number;
}>;
export type TreppenBequemlichkeitsregelOutput = Readonly<{
  readonly comfortMillimeters: number;
}>;

export const calculateTreppenBequemlichkeitsregel = (
  x: TreppenBequemlichkeitsregelInput,
): TreppenBequemlichkeitsregelOutput => {
  if (!Number.isFinite(x.goingMillimeters) || x.goingMillimeters < 0)
    simpleError("goingMillimeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.riserMillimeters) || x.riserMillimeters < 0)
    simpleError("riserMillimeters", "Provide a finite number at least 0.");
  const comfortMillimeters = x.goingMillimeters - x.riserMillimeters;
  if (!Number.isFinite(comfortMillimeters))
    simpleError(
      "comfortMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    comfortMillimeters: Object.is(comfortMillimeters, -0)
      ? 0
      : comfortMillimeters,
  };
};

export const example = {
  input: { goingMillimeters: 290, riserMillimeters: 170 },
  output: { comfortMillimeters: 120 },
} satisfies ToolExample<
  TreppenBequemlichkeitsregelInput,
  TreppenBequemlichkeitsregelOutput
>;

export const tool = createSimpleTool({
  id: "carpentry/treppen-bequemlichkeitsregel",
  title: "Treppen Bequemlichkeitsregel",
  description:
    "Compute the German stair comfort-rule dimension as tread going minus riser height; interpret it as a planning metric, not proof of code compliance.",
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
      id: "comfortMillimeters",
      kind: "number",
      label: "Comfort Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateTreppenBequemlichkeitsregel({
      goingMillimeters: input.goingMillimeters as number,
      riserMillimeters: input.riserMillimeters as number,
    }),
});
export const treppenBequemlichkeitsregelTool = tool;
export const runTreppenBequemlichkeitsregel = tool.execute;
export default tool;
