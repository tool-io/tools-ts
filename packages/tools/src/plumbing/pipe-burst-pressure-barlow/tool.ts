import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerIndependentActualWallFailureStressPascals: number;
  readonly actualWallThicknessMeters: number;
  readonly actualOuterDiameterMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerIndependentActualWallFailureStressPascals",
    label: "Caller independent actual wall failure stress pascals",
    kind: "number",
  },
  {
    id: "actualWallThicknessMeters",
    label: "Actual wall thickness meters",
    kind: "number",
  },
  {
    id: "actualOuterDiameterMeters",
    label: "Actual outer diameter meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(
    input.callerIndependentActualWallFailureStressPascals,
    "callerIndependentActualWallFailureStressPascals",
  );
  positive(input.actualWallThicknessMeters, "actualWallThicknessMeters");
  positive(input.actualOuterDiameterMeters, "actualOuterDiameterMeters");
  if (input.actualWallThicknessMeters / input.actualOuterDiameterMeters > 0.1)
    simpleError("wall", "Restricted thinwallt/OD≤.1.");
  return {
    value:
      (2 *
        input.callerIndependentActualWallFailureStressPascals *
        input.actualWallThicknessMeters) /
      input.actualOuterDiameterMeters,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerIndependentActualWallFailureStressPascals: 10,
    actualWallThicknessMeters: 0.1,
    actualOuterDiameterMeters: 1,
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/pipe-burst-pressure-barlow",
  title: "Plumbing Pipe Burst Pressure Barlow Calculator",
  description:
    "Nominal Barlow2Sfailuret/OD burst estimate only, independently established actual failures tress not allowable code stress. Defects, corrosion, seam, plasticity and approval excluded. Actual independently matched units, regime, material/equipment and governing references; not a hydraulic code, safe pressure, water pot ability or operational approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
