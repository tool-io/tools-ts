import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly bubbleFreeViscosityPaSeconds: number;
  readonly bubbleVolumeFraction: number;
  readonly callerReductionExponent: number;
  readonly surfaceTensionNPerM: number;
  readonly bubbleRadiusM: number;
  readonly shearRatePerSecond: number;
  readonly minimumCalibratedCapillaryNumber: number;
}>;
export type Output = Readonly<{
  readonly capillaryNumber: number;
  readonly relativeViscosityMultiplier: number;
  readonly effectiveViscosityPaSeconds: number;
}>;
const inputFields = [
  {
    id: "bubbleFreeViscosityPaSeconds",
    label: "Bubble free viscosity pa seconds",
    kind: "number",
  },
  {
    id: "bubbleVolumeFraction",
    label: "Bubble volume fraction",
    kind: "number",
  },
  {
    id: "callerReductionExponent",
    label: "Caller reduction exponent",
    kind: "number",
  },
  {
    id: "surfaceTensionNPerM",
    label: "Surface tension n per m",
    kind: "number",
  },
  { id: "bubbleRadiusM", label: "Bubble radius m", kind: "number" },
  { id: "shearRatePerSecond", label: "Shear rate per second", kind: "number" },
  {
    id: "minimumCalibratedCapillaryNumber",
    label: "Minimum calibrated capillary number",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.bubbleFreeViscosityPaSeconds, "bubbleFreeViscosityPaSeconds");
  positive(input.surfaceTensionNPerM, "surfaceTensionNPerM");
  positive(input.bubbleRadiusM, "bubbleRadiusM");
  nonnegative(input.shearRatePerSecond, "shearRatePerSecond");
  nonnegative(
    input.minimumCalibratedCapillaryNumber,
    "minimumCalibratedCapillaryNumber",
  );
  fraction(input.bubbleVolumeFraction, "bubbleVolumeFraction");
  positive(input.callerReductionExponent, "callerReductionExponent");
  const capillaryNumber =
    (input.bubbleFreeViscosityPaSeconds *
      input.bubbleRadiusM *
      input.shearRatePerSecond) /
    input.surfaceTensionNPerM;
  if (
    capillaryNumber < input.minimumCalibratedCapillaryNumber ||
    input.bubbleVolumeFraction === 1
  )
    simpleError(
      "capillaryNumber",
      "Deformable-bubble calibration range and bubble fraction below one required.",
    );
  const relativeViscosityMultiplier =
    (1 - input.bubbleVolumeFraction) ** input.callerReductionExponent;
  return {
    capillaryNumber,
    relativeViscosityMultiplier,
    effectiveViscosityPaSeconds:
      input.bubbleFreeViscosityPaSeconds * relativeViscosityMultiplier,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  bubbleFreeViscosityPaSeconds: 100,
  bubbleVolumeFraction: 0.2,
  callerReductionExponent: 2,
  surfaceTensionNPerM: 0.1,
  bubbleRadiusM: 0.001,
  shearRatePerSecond: 10,
  minimumCalibratedCapillaryNumber: 1,
} satisfies Input;
export const exampleOutput = {
  capillaryNumber: 10,
  relativeViscosityMultiplier: 0.64,
  effectiveViscosityPaSeconds: 64,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/bubble-content-viscosity-reduction",
  title: "Bubble Content Viscosity Reduction",
  description:
    "Evaluate a supplied deformable-bubble viscosity-reduction power law only above its caller capillary applicability threshold; low-capillary bubbles can increase viscosity and are not handled by this reduction model.",
  inputs: inputFields,
  outputs: [
    { id: "capillaryNumber", label: "Capillary number", kind: "number" },
    {
      id: "relativeViscosityMultiplier",
      label: "Relative viscosity multiplier",
      kind: "number",
    },
    {
      id: "effectiveViscosityPaSeconds",
      label: "Effective viscosity pa seconds",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      bubbleFreeViscosityPaSeconds:
        value.bubbleFreeViscosityPaSeconds as number,
      bubbleVolumeFraction: value.bubbleVolumeFraction as number,
      callerReductionExponent: value.callerReductionExponent as number,
      surfaceTensionNPerM: value.surfaceTensionNPerM as number,
      bubbleRadiusM: value.bubbleRadiusM as number,
      shearRatePerSecond: value.shearRatePerSecond as number,
      minimumCalibratedCapillaryNumber:
        value.minimumCalibratedCapillaryNumber as number,
    }),
});
export const run = tool.execute;
export default tool;
