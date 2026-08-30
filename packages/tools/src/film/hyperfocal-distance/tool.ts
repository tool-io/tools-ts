import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HyperfocalDistanceInput = Readonly<{
  readonly focalLengthMillimeters: number;
  readonly fNumber: number;
  readonly circleOfConfusionMillimeters: number;
}>;
export type HyperfocalDistanceOutput = Readonly<{
  readonly hyperfocalMillimeters: number;
}>;

export const calculateHyperfocalDistance = (
  x: HyperfocalDistanceInput,
): HyperfocalDistanceOutput => {
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
  const hyperfocalMillimeters =
    x.focalLengthMillimeters ** 2 /
      (x.fNumber * x.circleOfConfusionMillimeters) +
    x.focalLengthMillimeters;
  if (!Number.isFinite(hyperfocalMillimeters))
    simpleError(
      "hyperfocalMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    hyperfocalMillimeters: Object.is(hyperfocalMillimeters, -0)
      ? 0
      : hyperfocalMillimeters,
  };
};

export const example = {
  input: {
    focalLengthMillimeters: 50,
    fNumber: 8,
    circleOfConfusionMillimeters: 0.03,
  },
  output: { hyperfocalMillimeters: 10466.666666666668 },
} satisfies ToolExample<HyperfocalDistanceInput, HyperfocalDistanceOutput>;

export const tool = createSimpleTool({
  id: "film/hyperfocal-distance",
  title: "Hyperfocal Distance",
  description:
    "Thin-lens hyperfocal distance H=f²/(N·c)+f from focal length, f-number and chosen circle of confusion.",
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
  ],
  outputs: [
    {
      id: "hyperfocalMillimeters",
      kind: "number",
      label: "Hyperfocal Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateHyperfocalDistance({
      focalLengthMillimeters: input.focalLengthMillimeters as number,
      fNumber: input.fNumber as number,
      circleOfConfusionMillimeters:
        input.circleOfConfusionMillimeters as number,
    }),
});
export const hyperfocalDistanceTool = tool;
export const runHyperfocalDistance = tool.execute;
export default tool;
