import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ decimalPlaces: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "decimalPlaces", label: "Decimal places", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.decimalPlaces, 0, 15);
  return H.finish({
    angularStepDegrees: 10 ** -i.decimalPlaces,
    angularStepArcseconds: 3600 * 10 ** -i.decimalPlaces,
  });
};
export const example = {
  input: { decimalPlaces: 3 },
  output: { result: { angularStepDegrees: 0.001, angularStepArcseconds: 3.6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geography/coordinate-decimal-place-angular-step",
  title: "Geography: Coordinate Decimal Place Angular Step Tool",
  description:
    "Report angular quantization step of a fixed-decimal degree coordinate; not a claim of positional accuracy or latitude-independent linear resolution.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          angularStepArcseconds: { type: "number" },
          angularStepDegrees: { type: "number" },
        },
        required: ["angularStepArcseconds", "angularStepDegrees"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
