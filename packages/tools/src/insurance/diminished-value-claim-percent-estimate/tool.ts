import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  roundMinor,
  money,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerIndependentlyEstablishedPreLossValueMinor: number;
  readonly callerMatchedSeverityBasisPoints: number;
  readonly callerMatchedMileageBasisPoints: number;
}>;
export type Output = Readonly<{
  readonly callerModeledDiminishedValueMinor: number;
}>;
const inputFields = [
  {
    id: "callerIndependentlyEstablishedPreLossValueMinor",
    label: "Caller independently established pre loss value minor",
    kind: "number",
  },
  {
    id: "callerMatchedSeverityBasisPoints",
    label: "Caller matched severity basis points",
    kind: "number",
  },
  {
    id: "callerMatchedMileageBasisPoints",
    label: "Caller matched mileage basis points",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.callerIndependentlyEstablishedPreLossValueMinor);
  bounded(input.callerMatchedSeverityBasisPoints, "severity", 0, 10000);
  bounded(input.callerMatchedMileageBasisPoints, "mileage", 0, 10000);
  return {
    callerModeledDiminishedValueMinor: roundMinor(
      BigInt(input.callerIndependentlyEstablishedPreLossValueMinor) *
        BigInt(input.callerMatchedSeverityBasisPoints) *
        BigInt(input.callerMatchedMileageBasisPoints),
      100000000n,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerIndependentlyEstablishedPreLossValueMinor: 10000,
  callerMatchedSeverityBasisPoints: 2000,
  callerMatchedMileageBasisPoints: 5000,
} satisfies Input;
export const exampleOutput = {
  callerModeledDiminishedValueMinor: 1000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/diminished-value-claim-percent-estimate",
  title: "Diminished Value Claim Percent Estimate Calculator",
  description:
    "Evaluate caller explicitly calibrated severity×mileage diminished-value scenario in exact minor units, no universal 17c rule, valuation appraisal or claim entitlement.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerModeledDiminishedValueMinor",
      label: "Caller modeled diminished value minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerIndependentlyEstablishedPreLossValueMinor:
        value.callerIndependentlyEstablishedPreLossValueMinor as number,
      callerMatchedSeverityBasisPoints:
        value.callerMatchedSeverityBasisPoints as number,
      callerMatchedMileageBasisPoints:
        value.callerMatchedMileageBasisPoints as number,
    }),
});
export const run = tool.execute;
export default tool;
