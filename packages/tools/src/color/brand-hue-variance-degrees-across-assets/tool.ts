import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, hue } from "../batch-shared.js";
export type Input = Readonly<{
  readonly observedHueDegrees: readonly number[];
  readonly referenceHueDegrees: number;
}>;
export type Output = Readonly<{
  readonly signedShortestHueOffsetsDegrees: readonly number[];
  readonly circularMeanHueDegrees: number;
  readonly circularMeanAvailable: boolean;
  readonly maximumAbsoluteHueDeviationDegrees: number;
  readonly resultantLength: number;
}>;
const inputFields = [
  {
    id: "observedHueDegrees",
    label: "Observed hue degrees",
    kind: "numberList",
  },
  { id: "referenceHueDegrees", label: "Reference hue degrees", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (!input.observedHueDegrees.length)
    simpleError("hues", "Observed hue evidence required.");
  const ref = hue(input.referenceHueDegrees),
    angles = input.observedHueDegrees.map(hue),
    offsets = angles.map((v) => ((v - ref + 540) % 360) - 180),
    x =
      angles.reduce((s, v) => s + Math.cos((v * Math.PI) / 180), 0) /
      angles.length,
    y =
      angles.reduce((s, v) => s + Math.sin((v * Math.PI) / 180), 0) /
      angles.length,
    R = Math.hypot(x, y),
    available = R > 1e-12;
  return {
    signedShortestHueOffsetsDegrees: offsets,
    circularMeanHueDegrees: available
      ? hue((Math.atan2(y, x) * 180) / Math.PI)
      : 0,
    circularMeanAvailable: available,
    maximumAbsoluteHueDeviationDegrees: Math.max(...offsets.map(Math.abs)),
    resultantLength: R,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedHueDegrees: [350, 10],
  referenceHueDegrees: 0,
} satisfies Input;
export const exampleOutput = {
  signedShortestHueOffsetsDegrees: [-10, 10],
  circularMeanHueDegrees: 0,
  circularMeanAvailable: true,
  maximumAbsoluteHueDeviationDegrees: 10,
  resultantLength: 0.984807753012208,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/brand-hue-variance-degrees-across-assets",
  title: "Brand Hue Variance Degrees Across Assets",
  description:
    "Audit asset hue offsets against explicit reference with circular mean/resultant and absent-mean flag for antipodal cancellation; hues should represent chromatic assets, no arithmetic mean across 0/360 or automatic brand tolerance.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedShortestHueOffsetsDegrees",
      label: "Signed shortest hue offsets degrees",
      kind: "numberList",
    },
    {
      id: "circularMeanHueDegrees",
      label: "Circular mean hue degrees",
      kind: "number",
    },
    {
      id: "circularMeanAvailable",
      label: "Circular mean available",
      kind: "boolean",
    },
    {
      id: "maximumAbsoluteHueDeviationDegrees",
      label: "Maximum absolute hue deviation degrees",
      kind: "number",
    },
    { id: "resultantLength", label: "Resultant length", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedHueDegrees: value.observedHueDegrees as readonly number[],
      referenceHueDegrees: value.referenceHueDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;
