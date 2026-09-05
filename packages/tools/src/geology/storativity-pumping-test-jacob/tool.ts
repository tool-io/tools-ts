import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly independentTransmissivityM2Second: number;
  readonly radiusM: number;
  readonly extrapolatedZeroDrawdownSeconds: number;
}>;
export type Output = Readonly<{ readonly storativity: number }>;
const inputFields = [
  {
    id: "independentTransmissivityM2Second",
    label: "Independent transmissivity m2 second",
    kind: "number",
  },
  { id: "radiusM", label: "Radius m", kind: "number" },
  {
    id: "extrapolatedZeroDrawdownSeconds",
    label: "Extrapolated zero drawdown seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.independentTransmissivityM2Second,
    "independentTransmissivityM2Second",
  );
  positive(input.radiusM, "radiusM");
  positive(
    input.extrapolatedZeroDrawdownSeconds,
    "extrapolatedZeroDrawdownSeconds",
  );
  return {
    storativity:
      (2.25 *
        input.independentTransmissivityM2Second *
        input.extrapolatedZeroDrawdownSeconds) /
      input.radiusM ** 2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  independentTransmissivityM2Second: 2,
  radiusM: 3,
  extrapolatedZeroDrawdownSeconds: 4,
} satisfies Input;
export const exampleOutput = { storativity: 2 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/storativity-pumping-test-jacob",
  title: "Geology Storativity Pumping Test Jacob Calculator",
  description:
    "Jacob 2.25Tt0/r² from independently fitted late-time intercept, not thickness×specific-storage. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [{ id: "storativity", label: "Storativity", kind: "number" }],
  calculate: (value) =>
    calculate({
      independentTransmissivityM2Second:
        value.independentTransmissivityM2Second as number,
      radiusM: value.radiusM as number,
      extrapolatedZeroDrawdownSeconds:
        value.extrapolatedZeroDrawdownSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
