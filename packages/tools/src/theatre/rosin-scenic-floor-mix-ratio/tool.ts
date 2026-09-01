import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  weights,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly callerApprovedRosinParts: number;
  readonly callerApprovedCarrierParts: number;
  readonly targetMixtureMassG: number;
}>;
export type Output = Readonly<{
  readonly rosinMassG: number;
  readonly carrierMassG: number;
}>;
const inputFields = [
  {
    id: "callerApprovedRosinParts",
    label: "Caller approved rosin parts",
    kind: "number",
  },
  {
    id: "callerApprovedCarrierParts",
    label: "Caller approved carrier parts",
    kind: "number",
  },
  { id: "targetMixtureMassG", label: "Target mixture mass g", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.callerApprovedRosinParts, "callerApprovedRosinParts");
  nonnegative(input.callerApprovedCarrierParts, "callerApprovedCarrierParts");
  nonnegative(input.targetMixtureMassG, "targetMixtureMassG");
  const w = weights([
      input.callerApprovedRosinParts,
      input.callerApprovedCarrierParts,
    ]),
    r = input.targetMixtureMassG * w[0];
  return { rosinMassG: r, carrierMassG: input.targetMixtureMassG - r };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerApprovedRosinParts: 1,
  callerApprovedCarrierParts: 3,
  targetMixtureMassG: 100,
} satisfies Input;
export const exampleOutput = {
  rosinMassG: 25,
  carrierMassG: 75,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/rosin-scenic-floor-mix-ratio",
  title: "Rosin Scenic Floor Mix Ratio Calculator",
  description:
    "Scale an independently approved caller rosin/carrier mass-parts recipe; no solvent/product choice, preparation/application instructions, traction, fire or floor-compatibility approval.",
  inputs: inputFields,
  outputs: [
    { id: "rosinMassG", label: "Rosin mass g", kind: "number" },
    { id: "carrierMassG", label: "Carrier mass g", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      callerApprovedRosinParts: value.callerApprovedRosinParts as number,
      callerApprovedCarrierParts: value.callerApprovedCarrierParts as number,
      targetMixtureMassG: value.targetMixtureMassG as number,
    }),
});
export const run = tool.execute;
export default tool;
