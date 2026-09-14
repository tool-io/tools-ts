import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, bounded } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyCountedBioerosionTraceCount: number;
  readonly actualInspectedSurfaceAreaDm2: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyCountedBioerosionTraceCount",
    label: "Actual independently counted bioerosion trace count",
    kind: "number",
  },
  {
    id: "actualInspectedSurfaceAreaDm2",
    label: "Actual inspected surface area dm2",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(
    input.actualIndependentlyCountedBioerosionTraceCount,
    "actualIndependentlyCountedBioerosionTraceCount",
    0,
    1000000,
  );
  positive(
    input.actualInspectedSurfaceAreaDm2,
    "actualInspectedSurfaceAreaDm2",
  );
  return {
    value:
      input.actualIndependentlyCountedBioerosionTraceCount /
      input.actualInspectedSurfaceAreaDm2,
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
    actualIndependentlyCountedBioerosionTraceCount: 4,
    actualInspectedSurfaceAreaDm2: 2,
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/bioerosion-trace-density",
  title: "Bioerosion Trace Density per dm2 Calculator",
  description:
    "Actualindependentlyidentifiedtracecount/inspectedarea dm\u00b2,boundedobservedsurfacedensitynot volumeabundance/behaviorspeciesdiagnosis. Actual independently identified specimens,matched units/taxon/cohort/source/edition/calibration and model applicability external;not individual identity,causation,diagnosis,absolute age certainty or validated forecast.",
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
