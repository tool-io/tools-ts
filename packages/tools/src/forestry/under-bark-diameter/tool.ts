import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualOverBarkDiameter: number;
  readonly actualRadialBarkThickness: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualOverBarkDiameter",
    label: "Actual over bark diameter",
    kind: "number",
  },
  {
    id: "actualRadialBarkThickness",
    label: "Actual radial bark thickness",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  positive(input.actualOverBarkDiameter, "actualOverBarkDiameter");
  nonnegative(input.actualRadialBarkThickness, "actualRadialBarkThickness");
  if (input.actualOverBarkDiameter < 2 * input.actualRadialBarkThickness)
    simpleError("bark", "OD≥2radialthickness.");
  return {
    value: input.actualOverBarkDiameter - 2 * input.actualRadialBarkThickness,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualOverBarkDiameter: 10, actualRadialBarkThickness: 1 },
  output: { result: { value: 8 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/under-bark-diameter",
  title: "Under Bark Diameter Calculator",
  description:
    "ActualunderbarkdiameterOD\u22122radial thickness, not inventory weighted bark factor; actual nonnegative interior.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
