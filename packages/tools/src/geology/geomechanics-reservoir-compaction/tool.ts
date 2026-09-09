import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualOriginalReservoirThicknessMeters: number;
  readonly callerIndependentlyCalibratedUniaxialCompactionPerPascal: number;
  readonly actualPressureDepletionPascals: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualOriginalReservoirThicknessMeters",
    label: "Actual original reservoir thickness meters",
    kind: "number",
  },
  {
    id: "callerIndependentlyCalibratedUniaxialCompactionPerPascal",
    label: "Caller independently calibrated uniaxial compaction per pascal",
    kind: "number",
  },
  {
    id: "actualPressureDepletionPascals",
    label: "Actual pressure depletion pascals",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualOriginalReservoirThicknessMeters, "thickness");
  positive(
    input.callerIndependentlyCalibratedUniaxialCompactionPerPascal,
    "compressibility",
  );
  if (
    Math.abs(
      input.callerIndependentlyCalibratedUniaxialCompactionPerPascal *
        input.actualPressureDepletionPascals,
    ) > 0.1
  )
    simpleError("strain", "Declared small-strain branch≤0.1magnitude.");
  return {
    conditionalSmallStrainCompactionMeters:
      input.actualOriginalReservoirThicknessMeters *
      input.callerIndependentlyCalibratedUniaxialCompactionPerPascal *
      input.actualPressureDepletionPascals,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualOriginalReservoirThicknessMeters: 10,
    callerIndependentlyCalibratedUniaxialCompactionPerPascal: 0.01,
    actualPressureDepletionPascals: 2,
  },
  output: { result: { conditionalSmallStrainCompactionMeters: 0.2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/geomechanics-reservoir-compaction",
  title: "Geology Geomechanics Reservoir Compaction Calculator",
  description:
    "Declared small-strain reservoir thickness\u00d7uniaxial compaction coefficient\u00d7actual depletion; actual stress path and effective-pressure applicability independently established. Signed expansion retained, not subsidence geometry or geomechanical safety.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
