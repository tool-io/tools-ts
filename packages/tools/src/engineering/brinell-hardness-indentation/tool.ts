import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly forceNewton: number;
  readonly ballDiameterMm: number;
  readonly observedIndentDiameterMm: number;
  readonly callerNewtonPerKgf: number;
}>;
export type Output = Readonly<{ readonly brinellHbw: number }>;
const inputFields = [
  { id: "forceNewton", label: "Force newton", kind: "number" },
  { id: "ballDiameterMm", label: "Ball diameter mm", kind: "number" },
  {
    id: "observedIndentDiameterMm",
    label: "Observed indent diameter mm",
    kind: "number",
  },
  { id: "callerNewtonPerKgf", label: "Caller newton per kgf", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.forceNewton, "forceNewton");
  positive(input.ballDiameterMm, "ballDiameterMm");
  positive(input.observedIndentDiameterMm, "observedIndentDiameterMm");
  positive(input.callerNewtonPerKgf, "callerNewtonPerKgf");
  if (input.observedIndentDiameterMm >= input.ballDiameterMm)
    simpleError("indent", "Indent diameter strictly less than ball diameter.");
  const D = input.ballDiameterMm,
    d = input.observedIndentDiameterMm,
    h = (d * d) / (D + Math.sqrt(D * D - d * d));
  return {
    brinellHbw:
      (2 * input.forceNewton) / (input.callerNewtonPerKgf * Math.PI * D * h),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  forceNewton: 1000,
  ballDiameterMm: 10,
  observedIndentDiameterMm: 5,
  callerNewtonPerKgf: 9.80665,
} satisfies Input;
export const exampleOutput = { brinellHbw: 4.845482066921424 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/brinell-hardness-indentation",
  title: "Brinell Hardness Indentation Calculator",
  description:
    "Brinell HBW with forceN converted using caller N/kgf, mm geometry and cancellation-safe spherical-cap depth, not contact stressPa. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [{ id: "brinellHbw", label: "Brinell hbw", kind: "number" }],
  calculate: (value) =>
    calculate({
      forceNewton: value.forceNewton as number,
      ballDiameterMm: value.ballDiameterMm as number,
      observedIndentDiameterMm: value.observedIndentDiameterMm as number,
      callerNewtonPerKgf: value.callerNewtonPerKgf as number,
    }),
});
export const run = tool.execute;
export default tool;
