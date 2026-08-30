import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly upperLayerDepthM: number;
  readonly lowerLayerDepthM: number;
  readonly reducedGravityMPerSecondSquared: number;
  readonly signedCoriolisPerSecond: number;
}>;
export type Output = Readonly<{
  readonly internalWaveSpeedMPerSecond: number;
  readonly rossbyDeformationRadiusM: number;
}>;
const inputFields = [
  { id: "upperLayerDepthM", label: "Upper layer depth m", kind: "number" },
  { id: "lowerLayerDepthM", label: "Lower layer depth m", kind: "number" },
  {
    id: "reducedGravityMPerSecondSquared",
    label: "Reduced gravity m per second squared",
    kind: "number",
  },
  {
    id: "signedCoriolisPerSecond",
    label: "Signed coriolis per second",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.upperLayerDepthM, "upperLayerDepthM");
  positive(input.lowerLayerDepthM, "lowerLayerDepthM");
  positive(
    input.reducedGravityMPerSecondSquared,
    "reducedGravityMPerSecondSquared",
  );
  if (input.signedCoriolisPerSecond === 0)
    simpleError(
      "signedCoriolisPerSecond",
      "Nonzero supplied Coriolis parameter required; equatorial radius is unbounded.",
    );
  const internalWaveSpeedMPerSecond = Math.sqrt(
    (input.reducedGravityMPerSecondSquared *
      input.upperLayerDepthM *
      input.lowerLayerDepthM) /
      (input.upperLayerDepthM + input.lowerLayerDepthM),
  );
  return {
    internalWaveSpeedMPerSecond,
    rossbyDeformationRadiusM:
      internalWaveSpeedMPerSecond / Math.abs(input.signedCoriolisPerSecond),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  upperLayerDepthM: 10,
  lowerLayerDepthM: 10,
  reducedGravityMPerSecondSquared: 0.02,
  signedCoriolisPerSecond: -0.0001,
} satisfies Input;
export const exampleOutput = {
  internalWaveSpeedMPerSecond: 0.31622776601683794,
  rossbyDeformationRadiusM: 3162.277660168379,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/internal-rossby-radius-deformation",
  title: "Internal Rossby Radius Deformation",
  description:
    "Calculate two-layer internal Rossby radius c/|f| using supplied reduced gravity and signed Coriolis parameter; no latitude or coordinate transformation.",
  inputs: inputFields,
  outputs: [
    {
      id: "internalWaveSpeedMPerSecond",
      label: "Internal wave speed m per second",
      kind: "number",
    },
    {
      id: "rossbyDeformationRadiusM",
      label: "Rossby deformation radius m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      upperLayerDepthM: value.upperLayerDepthM as number,
      lowerLayerDepthM: value.lowerLayerDepthM as number,
      reducedGravityMPerSecondSquared:
        value.reducedGravityMPerSecondSquared as number,
      signedCoriolisPerSecond: value.signedCoriolisPerSecond as number,
    }),
});
export const run = tool.execute;
export default tool;
