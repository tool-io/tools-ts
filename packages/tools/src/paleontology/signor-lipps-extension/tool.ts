import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, fraction, count } from "../shared.js";
export type Input = Readonly<{
  readonly recoveredOccurrences: number;
  readonly observedExposureMyr: number;
  readonly recoveryProbability: number;
  readonly oneSidedConfidence: number;
  readonly lastObservedTimeMyr: number;
}>;
export type Output = Readonly<{
  readonly inferredOccurrenceRatePerMyr: number;
  readonly observedRecoveryRatePerMyr: number;
  readonly modelUnobservedExtensionMyr: number;
  readonly modelExtendedEndpointMyr: number;
}>;
const inputFields = [
  {
    id: "recoveredOccurrences",
    label: "Recovered occurrences",
    kind: "integer",
  },
  { id: "observedExposureMyr", label: "Observed exposure myr", kind: "number" },
  { id: "recoveryProbability", label: "Recovery probability", kind: "number" },
  { id: "oneSidedConfidence", label: "One sided confidence", kind: "number" },
  {
    id: "lastObservedTimeMyr",
    label: "Last observed time myr",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.recoveredOccurrences, "recoveredOccurrences");
  positive(input.observedExposureMyr, "observedExposureMyr");
  positive(input.recoveryProbability, "recoveryProbability");
  fraction(input.recoveryProbability, "recoveryProbability");
  fraction(input.oneSidedConfidence, "oneSidedConfidence");
  count(input.recoveredOccurrences, "recoveredOccurrences");
  if (input.oneSidedConfidence <= 0 || input.oneSidedConfidence >= 1)
    simpleError("oneSidedConfidence", "Confidence in (0,1) required.");
  const observedRecoveryRatePerMyr =
      input.recoveredOccurrences / input.observedExposureMyr,
    inferredOccurrenceRatePerMyr =
      observedRecoveryRatePerMyr / input.recoveryProbability,
    modelUnobservedExtensionMyr =
      -Math.log1p(-input.oneSidedConfidence) / observedRecoveryRatePerMyr;
  return {
    inferredOccurrenceRatePerMyr,
    observedRecoveryRatePerMyr,
    modelUnobservedExtensionMyr,
    modelExtendedEndpointMyr:
      input.lastObservedTimeMyr + modelUnobservedExtensionMyr,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  recoveredOccurrences: 10,
  observedExposureMyr: 2,
  recoveryProbability: 0.5,
  oneSidedConfidence: 0.5,
  lastObservedTimeMyr: 10,
} satisfies Input;
export const exampleOutput = {
  inferredOccurrenceRatePerMyr: 10,
  observedRecoveryRatePerMyr: 5,
  modelUnobservedExtensionMyr: 0.13862943611198905,
  modelExtendedEndpointMyr: 10.138629436111989,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/signor-lipps-extension",
  title: "Signor-Lipps Effect Back-Extension Estimate",
  description:
    "Model a Signor–Lipps unobserved tail under stationary independent Poisson recovery using caller rate exposure/detection; fitted rate uncertainty and correlated sampling are excluded, not a confirmed extinction date.",
  inputs: inputFields,
  outputs: [
    {
      id: "inferredOccurrenceRatePerMyr",
      label: "Inferred occurrence rate per myr",
      kind: "number",
    },
    {
      id: "observedRecoveryRatePerMyr",
      label: "Observed recovery rate per myr",
      kind: "number",
    },
    {
      id: "modelUnobservedExtensionMyr",
      label: "Model unobserved extension myr",
      kind: "number",
    },
    {
      id: "modelExtendedEndpointMyr",
      label: "Model extended endpoint myr",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      recoveredOccurrences: value.recoveredOccurrences as number,
      observedExposureMyr: value.observedExposureMyr as number,
      recoveryProbability: value.recoveryProbability as number,
      oneSidedConfidence: value.oneSidedConfidence as number,
      lastObservedTimeMyr: value.lastObservedTimeMyr as number,
    }),
});
export const run = tool.execute;
export default tool;
