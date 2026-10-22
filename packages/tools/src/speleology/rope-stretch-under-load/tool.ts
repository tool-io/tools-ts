import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualUnloadedRopeLengthMeters: number;
  readonly callerVerifiedElongationFractionAtActualLoad: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualUnloadedRopeLengthMeters",
    label: "Actual unloaded rope length meters",
    kind: "number",
  },
  {
    id: "callerVerifiedElongationFractionAtActualLoad",
    label: "Caller verified elongation fraction at actual load",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  positive(input.actualUnloadedRopeLengthMeters, "length");
  fraction(input.callerVerifiedElongationFractionAtActualLoad, "elongation");
  return {
    conditionalLoadedLengthMeters:
      input.actualUnloadedRopeLengthMeters *
      (1 + input.callerVerifiedElongationFractionAtActualLoad),
    conditionalElongationMeters:
      input.actualUnloadedRopeLengthMeters *
      input.callerVerifiedElongationFractionAtActualLoad,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualUnloadedRopeLengthMeters: 10,
    callerVerifiedElongationFractionAtActualLoad: 0.05,
  },
  output: {
    result: {
      conditionalLoadedLengthMeters: 10.5,
      conditionalElongationMeters: 0.5,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/rope-stretch-under-load",
  title: "Rope Stretch Elongation Under Load Calculator",
  description:
    "Actual matched rope/manufacturer/load/condition elongation fraction applied to unloaded length; not universal elasticity, force prediction or safe load.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          conditionalLoadedLengthMeters: { type: "number" },
          conditionalElongationMeters: { type: "number" },
        },
        required: [
          "conditionalLoadedLengthMeters",
          "conditionalElongationMeters",
        ],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
