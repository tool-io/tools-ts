import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly principalNormalStrainRatesPerYear: readonly number[];
  readonly closureTolerancePerYear: number;
}>;
export type Output = Readonly<{
  readonly tracePerYear: number;
  readonly volumeConservingWithinTolerance: boolean;
  readonly requiredThirdPrincipalStrainPerYear: number;
}>;
const inputFields = [
  {
    id: "principalNormalStrainRatesPerYear",
    label: "Principal normal strain rates per year",
    kind: "numberList",
  },
  {
    id: "closureTolerancePerYear",
    label: "Closure tolerance per year",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.closureTolerancePerYear, "closureTolerancePerYear");
  if (input.principalNormalStrainRatesPerYear.length !== 3)
    simpleError(
      "principalNormalStrainRatesPerYear",
      "Three principal normal strains required.",
    );
  const tracePerYear = input.principalNormalStrainRatesPerYear.reduce(
    (a, b) => a + b,
    0,
  );
  return {
    tracePerYear,
    volumeConservingWithinTolerance:
      Math.abs(tracePerYear) <= input.closureTolerancePerYear,
    requiredThirdPrincipalStrainPerYear:
      -input.principalNormalStrainRatesPerYear[0] -
      input.principalNormalStrainRatesPerYear[1],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  principalNormalStrainRatesPerYear: [0.1, 0.2, -0.31],
  closureTolerancePerYear: 0.005,
} satisfies Input;
export const exampleOutput = {
  tracePerYear: -0.01,
  volumeConservingWithinTolerance: false,
  requiredThirdPrincipalStrainPerYear: -0.3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/incompressibility-principal-strain-checker",
  title: "Incompressibility Principal Strain Checker",
  description:
    "Audit incompressibility through the trace of three principal normal strain rates and report the closure value; no eigenvectors or full tensor are inferred.",
  inputs: inputFields,
  outputs: [
    { id: "tracePerYear", label: "Trace per year", kind: "number" },
    {
      id: "volumeConservingWithinTolerance",
      label: "Volume conserving within tolerance",
      kind: "boolean",
    },
    {
      id: "requiredThirdPrincipalStrainPerYear",
      label: "Required third principal strain per year",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      principalNormalStrainRatesPerYear:
        value.principalNormalStrainRatesPerYear as readonly number[],
      closureTolerancePerYear: value.closureTolerancePerYear as number,
    }),
});
export const run = tool.execute;
export default tool;
