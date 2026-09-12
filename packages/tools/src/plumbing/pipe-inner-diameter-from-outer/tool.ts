import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualOuterDiameter: number;
  readonly actualWallThickness: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualOuterDiameter", label: "Actual outer diameter", kind: "number" },
  { id: "actualWallThickness", label: "Actual wall thickness", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualOuterDiameter, "actualOuterDiameter");
  positive(input.actualWallThickness, "actualWallThickness");
  if (input.actualOuterDiameter <= 2 * input.actualWallThickness)
    simpleError("geometry", "OD>2t.");
  return { value: input.actualOuterDiameter - input.actualWallThickness * 2 };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualOuterDiameter: 10, actualWallThickness: 1 },
  output: { result: { value: 8 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/pipe-inner-diameter-from-outer",
  title: "Plumbing Pipe Inner Diameter From Outer Calculator",
  description:
    "Actual circular pipe internaldiameterOD\u22122t, strictly positive bore, not nominalDNor thin wall capacity. Actual independently matched units, regime, material/equipment and governing references; not a hydraulic code, safe pressure, water pot ability or operational approval.",
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
