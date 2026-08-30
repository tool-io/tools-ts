import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TreppenSchrittmassregelInput = Readonly<{
  readonly riserMillimeters: number;
  readonly goingMillimeters: number;
}>;
export type TreppenSchrittmassregelOutput = Readonly<{
  readonly strideMillimeters: number;
}>;

export const calculateTreppenSchrittmassregel = (
  x: TreppenSchrittmassregelInput,
): TreppenSchrittmassregelOutput => {
  if (!Number.isFinite(x.riserMillimeters) || x.riserMillimeters < 0)
    simpleError("riserMillimeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.goingMillimeters) || x.goingMillimeters < 0)
    simpleError("goingMillimeters", "Provide a finite number at least 0.");
  const strideMillimeters = 2 * x.riserMillimeters + x.goingMillimeters;
  if (!Number.isFinite(strideMillimeters))
    simpleError(
      "strideMillimeters",
      "Inputs produce an undefined or non-finite result.",
    );
  return {
    strideMillimeters: Object.is(strideMillimeters, -0) ? 0 : strideMillimeters,
  };
};

export const example = {
  input: { riserMillimeters: 175, goingMillimeters: 280 },
  output: { strideMillimeters: 630 },
} satisfies ToolExample<
  TreppenSchrittmassregelInput,
  TreppenSchrittmassregelOutput
>;

export const tool = createSimpleTool({
  id: "carpentry/treppen-schrittmassregel",
  title: "Treppen Schrittmassregel",
  description:
    "Blondel stair stride dimension 2×riser plus tread going, a planning check rather than a code-compliance determination.",
  inputs: [
    {
      id: "riserMillimeters",
      kind: "number",
      label: "Riser Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "goingMillimeters",
      kind: "number",
      label: "Going Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "strideMillimeters",
      kind: "number",
      label: "Stride Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateTreppenSchrittmassregel({
      riserMillimeters: input.riserMillimeters as number,
      goingMillimeters: input.goingMillimeters as number,
    }),
});
export const treppenSchrittmassregelTool = tool;
export const runTreppenSchrittmassregel = tool.execute;
export default tool;
