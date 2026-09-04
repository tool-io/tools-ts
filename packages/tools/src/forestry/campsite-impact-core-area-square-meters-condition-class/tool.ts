import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  catalogIndex,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly callerCampsiteImpactIds: readonly string[];
  readonly callerCampsiteImpactValues: readonly number[];
  readonly queryCampsiteImpactId: string;
  readonly observedCampsiteImpactValue: number;
}>;
export type Output = Readonly<{
  readonly callerMatchedCampsiteImpactValue: number;
  readonly signedObservedMinusCampsiteImpactReference: number;
}>;
const inputFields = [
  {
    id: "callerCampsiteImpactIds",
    label: "Caller campsite impact ids",
    kind: "stringList",
  },
  {
    id: "callerCampsiteImpactValues",
    label: "Caller campsite impact values",
    kind: "numberList",
  },
  {
    id: "queryCampsiteImpactId",
    label: "Query campsite impact id",
    kind: "string",
  },
  {
    id: "observedCampsiteImpactValue",
    label: "Observed campsite impact value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerCampsiteImpactIds,
    input.callerCampsiteImpactValues,
    "callerCampsiteImpactIds",
  );
  input.callerCampsiteImpactValues.forEach((v) => nonnegative(v, "reference"));
  nonnegative(input.observedCampsiteImpactValue, "observation");
  const i = catalogIndex(
    input.callerCampsiteImpactIds,
    input.queryCampsiteImpactId,
  );
  return {
    callerMatchedCampsiteImpactValue: input.callerCampsiteImpactValues[i],
    signedObservedMinusCampsiteImpactReference:
      input.observedCampsiteImpactValue - input.callerCampsiteImpactValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerCampsiteImpactIds: ["a", "b"],
  callerCampsiteImpactValues: [2, 4],
  queryCampsiteImpactId: "b",
  observedCampsiteImpactValue: 5,
} satisfies Input;
export const exampleOutput = {
  callerMatchedCampsiteImpactValue: 4,
  signedObservedMinusCampsiteImpactReference: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/campsite-impact-core-area-square-meters-condition-class",
  title: "Campsite Core Area Impact Condition Class",
  description:
    "Audit caller site/protocol matched campsite condition class reference. Audit caller independently verified matched reference against actual observation, not a fabricated specification. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerMatchedCampsiteImpactValue",
      label: "Caller matched campsite impact value",
      kind: "number",
    },
    {
      id: "signedObservedMinusCampsiteImpactReference",
      label: "Signed observed minus campsite impact reference",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerCampsiteImpactIds:
        value.callerCampsiteImpactIds as readonly string[],
      callerCampsiteImpactValues:
        value.callerCampsiteImpactValues as readonly number[],
      queryCampsiteImpactId: value.queryCampsiteImpactId as string,
      observedCampsiteImpactValue: value.observedCampsiteImpactValue as number,
    }),
});
export const run = tool.execute;
export default tool;
