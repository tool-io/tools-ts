import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly sunTeeth: number;
  readonly ringTeeth: number;
  readonly sunSpeedRpm: number;
  readonly ringSpeedRpm: number;
}>;
export type Output = Readonly<{
  readonly carrierSpeedRpm: number;
  readonly signedSunRelativeCarrierRatio: number;
}>;
const inputFields = [
  { id: "sunTeeth", label: "Sun teeth", kind: "number" },
  { id: "ringTeeth", label: "Ring teeth", kind: "number" },
  { id: "sunSpeedRpm", label: "Sun speed rpm", kind: "number" },
  { id: "ringSpeedRpm", label: "Ring speed rpm", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.sunTeeth, "sun", 1, 100000);
  bounded(input.ringTeeth, "ring", 1, 100000);
  if (input.ringTeeth <= input.sunTeeth)
    simpleError("teeth", "Ring>sun for ideal coaxial internal ring planetary.");
  return {
    carrierSpeedRpm:
      (input.sunTeeth * input.sunSpeedRpm +
        input.ringTeeth * input.ringSpeedRpm) /
      (input.sunTeeth + input.ringTeeth),
    signedSunRelativeCarrierRatio: input.ringTeeth / input.sunTeeth,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sunTeeth: 20,
  ringTeeth: 60,
  sunSpeedRpm: 100,
  ringSpeedRpm: 0,
} satisfies Input;
export const exampleOutput = {
  carrierSpeedRpm: 25,
  signedSunRelativeCarrierRatio: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/epicyclic-gear-train-ratio",
  title: "Epicyclic Gear Train Ratio Calculator",
  description:
    "Willis sun/ring/carrier speed balance; ratio is−(sun−carrier)/(ring−carrier), finite tooth ratio reported even at co-rotation. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    { id: "carrierSpeedRpm", label: "Carrier speed rpm", kind: "number" },
    {
      id: "signedSunRelativeCarrierRatio",
      label: "Signed sun relative carrier ratio",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      sunTeeth: value.sunTeeth as number,
      ringTeeth: value.ringTeeth as number,
      sunSpeedRpm: value.sunSpeedRpm as number,
      ringSpeedRpm: value.ringSpeedRpm as number,
    }),
});
export const run = tool.execute;
export default tool;
