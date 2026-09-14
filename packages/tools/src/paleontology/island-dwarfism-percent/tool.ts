import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualIslandPopulationSizeMetric: number;
  readonly callerMatchedMainlandReferenceSizeMetric: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIslandPopulationSizeMetric",
    label: "Actual island population size metric",
    kind: "number",
  },
  {
    id: "callerMatchedMainlandReferenceSizeMetric",
    label: "Caller matched mainland reference size metric",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualIslandPopulationSizeMetric,
    "actualIslandPopulationSizeMetric",
  );
  positive(
    input.callerMatchedMainlandReferenceSizeMetric,
    "callerMatchedMainlandReferenceSizeMetric",
  );
  return {
    value:
      100 *
      (input.actualIslandPopulationSizeMetric /
        input.callerMatchedMainlandReferenceSizeMetric -
        1),
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
    actualIslandPopulationSizeMetric: 8,
    callerMatchedMainlandReferenceSizeMetric: 10,
  },
  output: { result: { value: -19.999999999999996 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/island-dwarfism-percent",
  title: "Island Dwarfism Size Reduction Percent Calculator",
  description:
    "SIGNEDislandsizeCHANGEpercent100(island/mainland\u22121),negative dwarfismpositivegigantism retained,matchedmetricnot selectancestor/taxon. Actual independently identified specimens,matched units/taxon/cohort/source/edition/calibration and model applicability external;not individual identity,causation,diagnosis,absolute age certainty or validated forecast.",
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
