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
  readonly callerSchuttDefoliationIds: readonly string[];
  readonly callerSchuttDefoliationValues: readonly number[];
  readonly querySchuttDefoliationId: string;
  readonly observedSchuttDefoliationValue: number;
}>;
export type Output = Readonly<{
  readonly callerMatchedSchuttDefoliationValue: number;
  readonly signedObservedMinusSchuttDefoliationReference: number;
}>;
const inputFields = [
  {
    id: "callerSchuttDefoliationIds",
    label: "Caller schutt defoliation ids",
    kind: "stringList",
  },
  {
    id: "callerSchuttDefoliationValues",
    label: "Caller schutt defoliation values",
    kind: "numberList",
  },
  {
    id: "querySchuttDefoliationId",
    label: "Query schutt defoliation id",
    kind: "string",
  },
  {
    id: "observedSchuttDefoliationValue",
    label: "Observed schutt defoliation value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerSchuttDefoliationIds,
    input.callerSchuttDefoliationValues,
    "callerSchuttDefoliationIds",
  );
  input.callerSchuttDefoliationValues.forEach((v) =>
    nonnegative(v, "reference"),
  );
  nonnegative(input.observedSchuttDefoliationValue, "observation");
  const i = catalogIndex(
    input.callerSchuttDefoliationIds,
    input.querySchuttDefoliationId,
  );
  return {
    callerMatchedSchuttDefoliationValue: input.callerSchuttDefoliationValues[i],
    signedObservedMinusSchuttDefoliationReference:
      input.observedSchuttDefoliationValue -
      input.callerSchuttDefoliationValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerSchuttDefoliationIds: ["a", "b"],
  callerSchuttDefoliationValues: [2, 4],
  querySchuttDefoliationId: "b",
  observedSchuttDefoliationValue: 5,
} satisfies Input;
export const exampleOutput = {
  callerMatchedSchuttDefoliationValue: 4,
  signedObservedMinusSchuttDefoliationReference: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/defoliation-percent-visual-rating-schutt",
  title: "Schütt Visual Defoliation Rating Tool",
  description:
    "Audit caller Schütt visual defoliation-class reference. Audit caller independently verified matched reference against actual observation, not a fabricated specification. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerMatchedSchuttDefoliationValue",
      label: "Caller matched schutt defoliation value",
      kind: "number",
    },
    {
      id: "signedObservedMinusSchuttDefoliationReference",
      label: "Signed observed minus schutt defoliation reference",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerSchuttDefoliationIds:
        value.callerSchuttDefoliationIds as readonly string[],
      callerSchuttDefoliationValues:
        value.callerSchuttDefoliationValues as readonly number[],
      querySchuttDefoliationId: value.querySchuttDefoliationId as string,
      observedSchuttDefoliationValue:
        value.observedSchuttDefoliationValue as number,
    }),
});
export const run = tool.execute;
export default tool;
