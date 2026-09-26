import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  referenceResistance: number;
  temperatureCoefficient: number;
  temperatureChange: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "referenceResistance", label: "Reference resistance", kind: "number" },
  {
    id: "temperatureCoefficient",
    label: "Temperature coefficient",
    kind: "number",
  },
  { id: "temperatureChange", label: "Temperature change", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.positive(i.referenceResistance);
  const factor = 1 + i.temperatureCoefficient * i.temperatureChange;
  H.positive(factor);
  return H.finish({
    resistance: i.referenceResistance * factor,
    relativeChange: factor - 1,
  });
};
export const example = {
  input: {
    referenceResistance: 100,
    temperatureCoefficient: 0.004,
    temperatureChange: 25,
  },
  output: { result: { resistance: 110, relativeChange: 0.1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electricity/resistor-delta-temperature-coefficient-step",
  title: "Electricity: Resistor Delta Temperature Coefficient Step Tool",
  description:
    "Apply the local linear resistance temperature-coefficient approximation about a caller-established reference state, rejecting nonpositive predicted resistance; not a wide-range material model.",
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
          relativeChange: { type: "number" },
          resistance: { type: "number" },
        },
        required: ["relativeChange", "resistance"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
