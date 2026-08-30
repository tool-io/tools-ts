import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WeldThroatAreaInput = Readonly<{
  readonly legMillimeters: number;
  readonly effectiveLengthMillimeters: number;
}>;
export type WeldThroatAreaOutput = Readonly<{
  readonly throatAreaSquareMillimeters: number;
}>;

export const calculateWeldThroatArea = (
  x: WeldThroatAreaInput,
): WeldThroatAreaOutput => {
  if (!Number.isFinite(x.legMillimeters) || x.legMillimeters < 0)
    simpleError("legMillimeters", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.effectiveLengthMillimeters) ||
    x.effectiveLengthMillimeters < 0
  )
    simpleError(
      "effectiveLengthMillimeters",
      "Provide a finite number at least 0.",
    );
  const throatAreaSquareMillimeters =
    (x.legMillimeters / Math.sqrt(2)) * x.effectiveLengthMillimeters;
  if (!Number.isFinite(throatAreaSquareMillimeters))
    simpleError(
      "throatAreaSquareMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    throatAreaSquareMillimeters: Object.is(throatAreaSquareMillimeters, -0)
      ? 0
      : throatAreaSquareMillimeters,
  };
};

export const example = {
  input: { legMillimeters: 5, effectiveLengthMillimeters: 100 },
  output: { throatAreaSquareMillimeters: 353.5533905932737 },
} satisfies ToolExample<WeldThroatAreaInput, WeldThroatAreaOutput>;

export const tool = createSimpleTool({
  id: "engineering/weld-throat-area",
  title: "Weld Throat Area",
  description:
    "Effective throat area for an equal-leg 45° fillet weld: leg/√2 times effective weld length.",
  inputs: [
    {
      id: "legMillimeters",
      kind: "number",
      label: "Leg Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "effectiveLengthMillimeters",
      kind: "number",
      label: "Effective Length Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "throatAreaSquareMillimeters",
      kind: "number",
      label: "Throat Area Square Millimeters",
      unit: "mm²",
    },
  ],
  calculate: (input) =>
    calculateWeldThroatArea({
      legMillimeters: input.legMillimeters as number,
      effectiveLengthMillimeters: input.effectiveLengthMillimeters as number,
    }),
});
export const weldThroatAreaTool = tool;
export const runWeldThroatArea = tool.execute;
export default tool;
