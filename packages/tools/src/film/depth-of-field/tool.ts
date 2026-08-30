import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DepthOfFieldInput = Readonly<{
  readonly focalLengthMillimeters: number;
  readonly fNumber: number;
  readonly circleOfConfusionMillimeters: number;
  readonly focusDistanceMillimeters: number;
}>;
export type DepthOfFieldOutput = Readonly<{
  readonly depthOfFieldMillimeters: number;
}>;

export const calculateDepthOfField = (
  x: DepthOfFieldInput,
): DepthOfFieldOutput => {
  if (
    !Number.isFinite(x.focalLengthMillimeters) ||
    x.focalLengthMillimeters < 0
  )
    simpleError(
      "focalLengthMillimeters",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.fNumber) || x.fNumber < 0)
    simpleError("fNumber", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.circleOfConfusionMillimeters) ||
    x.circleOfConfusionMillimeters < 0
  )
    simpleError(
      "circleOfConfusionMillimeters",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.focusDistanceMillimeters) ||
    x.focusDistanceMillimeters < 0
  )
    simpleError(
      "focusDistanceMillimeters",
      "Provide a finite number at least 0.",
    );
  if (
    x.focusDistanceMillimeters <= x.focalLengthMillimeters ||
    x.focusDistanceMillimeters >=
      x.focalLengthMillimeters ** 2 /
        (x.fNumber * x.circleOfConfusionMillimeters) +
        2 * x.focalLengthMillimeters
  )
    simpleError("input", "Inputs violate the stated model or operating range.");
  const depthOfFieldMillimeters = ((h, s, f) =>
    (h * s) / (h - (s - f)) - (h * s) / (h + (s - f)))(
    x.focalLengthMillimeters ** 2 /
      (x.fNumber * x.circleOfConfusionMillimeters) +
      x.focalLengthMillimeters,
    x.focusDistanceMillimeters,
    x.focalLengthMillimeters,
  );
  if (!Number.isFinite(depthOfFieldMillimeters))
    simpleError(
      "depthOfFieldMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    depthOfFieldMillimeters: Object.is(depthOfFieldMillimeters, -0)
      ? 0
      : depthOfFieldMillimeters,
  };
};

export const example = {
  input: {
    focalLengthMillimeters: 50,
    fNumber: 8,
    circleOfConfusionMillimeters: 0.03,
    focusDistanceMillimeters: 2000,
  },
  output: { depthOfFieldMillimeters: 772.0195957393712 },
} satisfies ToolExample<DepthOfFieldInput, DepthOfFieldOutput>;

export const tool = createSimpleTool({
  id: "film/depth-of-field",
  title: "Depth Of Field",
  description:
    "Finite depth of field from focal length, f-number, circle of confusion and focus distance using thin-lens near/far limits.",
  inputs: [
    {
      id: "focalLengthMillimeters",
      kind: "number",
      label: "Focal Length Millimeters",
      unit: "mm",
      minimum: 0,
    },
    { id: "fNumber", kind: "number", label: "F Number", minimum: 0 },
    {
      id: "circleOfConfusionMillimeters",
      kind: "number",
      label: "Circle Of Confusion Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "focusDistanceMillimeters",
      kind: "number",
      label: "Focus Distance Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "depthOfFieldMillimeters",
      kind: "number",
      label: "Depth Of Field Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateDepthOfField({
      focalLengthMillimeters: input.focalLengthMillimeters as number,
      fNumber: input.fNumber as number,
      circleOfConfusionMillimeters:
        input.circleOfConfusionMillimeters as number,
      focusDistanceMillimeters: input.focusDistanceMillimeters as number,
    }),
});
export const depthOfFieldTool = tool;
export const runDepthOfField = tool.execute;
export default tool;
