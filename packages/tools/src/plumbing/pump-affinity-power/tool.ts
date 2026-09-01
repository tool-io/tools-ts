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
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedReferencePowerWatts: number;
  readonly observedReferenceSpeedRpm: number;
  readonly callerQuerySpeedRpm: number;
  readonly callerSameImpellerAndFluidVerified: boolean;
}>;
export type Output = Readonly<{
  readonly idealQueryPowerWatts: number;
  readonly idealSpeedRatio: number;
}>;
const inputFields = [
  {
    id: "observedReferencePowerWatts",
    label: "Observed reference power watts",
    kind: "number",
  },
  {
    id: "observedReferenceSpeedRpm",
    label: "Observed reference speed rpm",
    kind: "number",
  },
  {
    id: "callerQuerySpeedRpm",
    label: "Caller query speed rpm",
    kind: "number",
  },
  {
    id: "callerSameImpellerAndFluidVerified",
    label: "Caller same impeller and fluid verified",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedReferenceSpeedRpm, "observedReferenceSpeedRpm");
  positive(input.callerQuerySpeedRpm, "callerQuerySpeedRpm");
  nonnegative(input.observedReferencePowerWatts, "observedReferencePowerWatts");
  if (!input.callerSameImpellerAndFluidVerified)
    simpleError(
      "affinity",
      "Caller same impeller/fluid similarity evidence required.",
    );
  const r = input.callerQuerySpeedRpm / input.observedReferenceSpeedRpm;
  return {
    idealQueryPowerWatts: input.observedReferencePowerWatts * r ** 3,
    idealSpeedRatio: r,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedReferencePowerWatts: 1000,
  observedReferenceSpeedRpm: 1000,
  callerQuerySpeedRpm: 1500,
  callerSameImpellerAndFluidVerified: true,
} satisfies Input;
export const exampleOutput = {
  idealQueryPowerWatts: 3375.0,
  idealSpeedRatio: 1.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/pump-affinity-power",
  title: "Plumbing Pump Affinity Power Calculator",
  description:
    "Calculate actual measured pump power affinity scenario at caller speed under independently verified same-impeller/fluid similarity; exponent 3, not a pump curve intersection, efficiency guarantee or operating instruction.",
  inputs: inputFields,
  outputs: [
    {
      id: "idealQueryPowerWatts",
      label: "Ideal query power watts",
      kind: "number",
    },
    { id: "idealSpeedRatio", label: "Ideal speed ratio", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedReferencePowerWatts: value.observedReferencePowerWatts as number,
      observedReferenceSpeedRpm: value.observedReferenceSpeedRpm as number,
      callerQuerySpeedRpm: value.callerQuerySpeedRpm as number,
      callerSameImpellerAndFluidVerified:
        value.callerSameImpellerAndFluidVerified as boolean,
    }),
});
export const run = tool.execute;
export default tool;
