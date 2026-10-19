import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  coefficients: readonly number[];
  power: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "coefficients", label: "coefficients", kind: "numberList" },
  { id: "power", label: "power", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.check(i.coefficients.length > 0);
  H.int(i.power, 0, 1e6);
  return H.finish({
    coefficient: i.coefficients[i.power] ?? 0,
    explicit: i.power < i.coefficients.length,
  });
};
export const example = {
  input: { coefficients: [1, 2, 0, 0], power: 5 },
  output: { result: { coefficient: 0, explicit: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Polynomial Coefficient Power Selector", "mathematics"],
    collections: ["data", "learn"],
    fields: ["polynomial", "mathematics"],
    keywords: ["mathematics"],
  },
  id: "polynomial/coefficient-power-selector",
  title: "Polynomial Coefficient Power Selector",
  description:
    "Select one ascending polynomial power coefficient, distinguishing implicit zero beyond stored degree from an explicit supplied zero.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          coefficient: { type: "number" },
          explicit: { type: "boolean" },
        },
        required: ["coefficient", "explicit"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
