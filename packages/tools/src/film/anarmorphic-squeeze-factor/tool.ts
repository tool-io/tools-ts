import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AnarmorphicSqueezeFactorInput = Readonly<{
  readonly unsqueezedWidthMillimeters: number;
  readonly squeezedWidthMillimeters: number;
}>;
export type AnarmorphicSqueezeFactorOutput = Readonly<{
  readonly squeezeFactor: number;
}>;

export const calculateAnarmorphicSqueezeFactor = (
  x: AnarmorphicSqueezeFactorInput,
): AnarmorphicSqueezeFactorOutput => {
  if (
    !Number.isFinite(x.unsqueezedWidthMillimeters) ||
    x.unsqueezedWidthMillimeters < 0
  )
    simpleError(
      "unsqueezedWidthMillimeters",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.squeezedWidthMillimeters) ||
    x.squeezedWidthMillimeters < 0
  )
    simpleError(
      "squeezedWidthMillimeters",
      "Provide a finite number at least 0.",
    );
  const squeezeFactor =
    x.unsqueezedWidthMillimeters / x.squeezedWidthMillimeters;
  if (!Number.isFinite(squeezeFactor))
    simpleError(
      "squeezeFactor",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { squeezeFactor: Object.is(squeezeFactor, -0) ? 0 : squeezeFactor };
};

export const example = {
  input: { unsqueezedWidthMillimeters: 36, squeezedWidthMillimeters: 18 },
  output: { squeezeFactor: 2 },
} satisfies ToolExample<
  AnarmorphicSqueezeFactorInput,
  AnarmorphicSqueezeFactorOutput
>;

export const tool = createSimpleTool({
  id: "film/anarmorphic-squeeze-factor",
  title: "Anarmorphic Squeeze Factor",
  description:
    "Horizontal anamorphic squeeze factor from unsqueezed scene width divided by recorded squeezed image width.",
  inputs: [
    {
      id: "unsqueezedWidthMillimeters",
      kind: "number",
      label: "Unsqueezed Width Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "squeezedWidthMillimeters",
      kind: "number",
      label: "Squeezed Width Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [{ id: "squeezeFactor", kind: "number", label: "Squeeze Factor" }],
  calculate: (input) =>
    calculateAnarmorphicSqueezeFactor({
      unsqueezedWidthMillimeters: input.unsqueezedWidthMillimeters as number,
      squeezedWidthMillimeters: input.squeezedWidthMillimeters as number,
    }),
});
export const anarmorphicSqueezeFactorTool = tool;
export const runAnarmorphicSqueezeFactor = tool.execute;
export default tool;
