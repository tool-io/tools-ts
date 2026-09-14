import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualObservedDeltaNitrogen15: number;
  readonly callerIndependentBaselineDeltaNitrogen15: number;
  readonly callerIndependentTrophicEnrichmentPerStep: number;
  readonly callerIndependentNumberOfTrophicSteps: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualObservedDeltaNitrogen15",
    label: "Actual observed delta nitrogen15",
    kind: "number",
  },
  {
    id: "callerIndependentBaselineDeltaNitrogen15",
    label: "Caller independent baseline delta nitrogen15",
    kind: "number",
  },
  {
    id: "callerIndependentTrophicEnrichmentPerStep",
    label: "Caller independent trophic enrichment per step",
    kind: "number",
  },
  {
    id: "callerIndependentNumberOfTrophicSteps",
    label: "Caller independent number of trophic steps",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.callerIndependentNumberOfTrophicSteps,
    "callerIndependentNumberOfTrophicSteps",
  );
  return {
    value:
      input.actualObservedDeltaNitrogen15 -
      input.callerIndependentBaselineDeltaNitrogen15 -
      input.callerIndependentTrophicEnrichmentPerStep *
        input.callerIndependentNumberOfTrophicSteps,
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualObservedDeltaNitrogen15: 8,
    callerIndependentBaselineDeltaNitrogen15: 2,
    callerIndependentTrophicEnrichmentPerStep: 3,
    callerIndependentNumberOfTrophicSteps: 2,
  },
  output: { result: { value: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/trophic-enrichment-step",
  title: "Isotope Trophic Enrichment Step Adjuster",
  description:
    "Signedactual\u03b415Nminusindependentbaseline/minusqualifiedtrophicstepenrichment,not infer diet/agefrom universal 3.4permil. Actual independently identified specimens,matched units/taxon/cohort/source/edition/calibration and model applicability external;not individual identity,causation,diagnosis,absolute age certainty or validated forecast.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
