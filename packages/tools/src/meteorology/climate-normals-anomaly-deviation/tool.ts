import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, mean } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedMonthlyValues: readonly number[];
  readonly callerMatchedNormals: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedAnomalies: readonly number[];
  readonly meanSignedAnomaly: number;
}>;
const inputFields = [
  {
    id: "observedMonthlyValues",
    label: "Observed monthly values",
    kind: "numberList",
  },
  {
    id: "callerMatchedNormals",
    label: "Caller matched normals",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedMonthlyValues,
    input.callerMatchedNormals,
    "observedMonthlyValues",
  );
  const d = input.observedMonthlyValues.map(
    (v, i) => v - input.callerMatchedNormals[i],
  );
  return { signedAnomalies: d, meanSignedAnomaly: mean(d) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMonthlyValues: [12, 8],
  callerMatchedNormals: [10, 10],
} satisfies Input;
export const exampleOutput = {
  signedAnomalies: [2, -2],
  meanSignedAnomaly: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/climate-normals-anomaly-deviation",
  title: "Climate Normals Anomaly Deviation Calculator",
  description:
    "Actual season/time-matched climate-normal signed deviations, not climate trend or anomaly attribution. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    { id: "signedAnomalies", label: "Signed anomalies", kind: "numberList" },
    { id: "meanSignedAnomaly", label: "Mean signed anomaly", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedMonthlyValues: value.observedMonthlyValues as readonly number[],
      callerMatchedNormals: value.callerMatchedNormals as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
