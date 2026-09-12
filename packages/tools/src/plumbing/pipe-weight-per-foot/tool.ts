import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualOuterDiameterMeters: number;
  readonly actualInnerDiameterMeters: number;
  readonly callerMaterialDensityKgPerCubicMeter: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualOuterDiameterMeters",
    label: "Actual outer diameter meters",
    kind: "number",
  },
  {
    id: "actualInnerDiameterMeters",
    label: "Actual inner diameter meters",
    kind: "number",
  },
  {
    id: "callerMaterialDensityKgPerCubicMeter",
    label: "Caller material density kg per cubic meter",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualOuterDiameterMeters, "actualOuterDiameterMeters");
  nonnegative(input.actualInnerDiameterMeters, "actualInnerDiameterMeters");
  positive(
    input.callerMaterialDensityKgPerCubicMeter,
    "callerMaterialDensityKgPerCubicMeter",
  );
  if (input.actualOuterDiameterMeters <= input.actualInnerDiameterMeters)
    simpleError("wall", "OD>ID≥0.");
  return {
    value:
      (Math.PI / 4) *
      (input.actualOuterDiameterMeters ** 2 -
        input.actualInnerDiameterMeters ** 2) *
      input.callerMaterialDensityKgPerCubicMeter *
      0.3048,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualOuterDiameterMeters: 2,
    actualInnerDiameterMeters: 1,
    callerMaterialDensityKgPerCubicMeter: 10,
  },
  output: { result: { value: 7.181680806106267 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/pipe-weight-per-foot",
  title: "Plumbing Pipe Weight Per Foot Calculator",
  description:
    "Actual circular pipe annular wall volume perFOOT(.3048m)\u00d7density kg/ft, no fluid contents or nominal pipe table. Actual independently matched units, regime, material/equipment and governing references; not a hydraulic code, safe pressure, water pot ability or operational approval.",
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
