import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ExtrusionRatio2Input = Readonly<{
  readonly initialAreaSquareMillimeters: number;
  readonly finalAreaSquareMillimeters: number;
}>;
export type ExtrusionRatio2Output = Readonly<{
  readonly extrusionRatio: number;
}>;

export const calculateExtrusionRatio2 = (
  x: ExtrusionRatio2Input,
): ExtrusionRatio2Output => {
  if (
    !Number.isFinite(x.initialAreaSquareMillimeters) ||
    x.initialAreaSquareMillimeters < 0
  )
    simpleError(
      "initialAreaSquareMillimeters",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.finalAreaSquareMillimeters) ||
    x.finalAreaSquareMillimeters < 0
  )
    simpleError(
      "finalAreaSquareMillimeters",
      "Provide a finite number at least 0.",
    );
  if (x.finalAreaSquareMillimeters > x.initialAreaSquareMillimeters)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const extrusionRatio =
    x.initialAreaSquareMillimeters / x.finalAreaSquareMillimeters;
  if (!Number.isFinite(extrusionRatio))
    simpleError(
      "extrusionRatio",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { extrusionRatio: Object.is(extrusionRatio, -0) ? 0 : extrusionRatio };
};

export const example = {
  input: { initialAreaSquareMillimeters: 100, finalAreaSquareMillimeters: 25 },
  output: { extrusionRatio: 4 },
} satisfies ToolExample<ExtrusionRatio2Input, ExtrusionRatio2Output>;

export const tool = createSimpleTool({
  id: "engineering/extrusion-ratio-2",
  title: "Extrusion Ratio 2",
  description:
    "Extrusion area ratio of starting billet cross section to final extrudate cross section.",
  inputs: [
    {
      id: "initialAreaSquareMillimeters",
      kind: "number",
      label: "Initial Area Square Millimeters",
      unit: "mm²",
      minimum: 0,
    },
    {
      id: "finalAreaSquareMillimeters",
      kind: "number",
      label: "Final Area Square Millimeters",
      unit: "mm²",
      minimum: 0,
    },
  ],
  outputs: [{ id: "extrusionRatio", kind: "number", label: "Extrusion Ratio" }],
  calculate: (input) =>
    calculateExtrusionRatio2({
      initialAreaSquareMillimeters:
        input.initialAreaSquareMillimeters as number,
      finalAreaSquareMillimeters: input.finalAreaSquareMillimeters as number,
    }),
});
export const extrusionRatio2Tool = tool;
export const runExtrusionRatio2 = tool.execute;
export default tool;
