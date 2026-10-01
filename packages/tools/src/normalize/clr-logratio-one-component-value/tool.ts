import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly component: number;
  readonly geometricMean: number;
};
export type Output = { readonly value: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    component: { type: "number", exclusiveMinimum: 0 },
    geometricMean: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["component", "geometricMean"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "number" } },
  required: ["value"],
} as const;
/** Calculate clr logratio one component value from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { component, geometricMean } = input;
  const compute = (): Output => {
    H.positive(component);
    H.positive(geometricMean);
    return { value: Math.log(component / geometricMean) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { component: 4, geometricMean: 2 },
  output: { value: 0.6931471805599453 },
} satisfies ToolExample<Input, Output>;
export const clrLogratioOneComponentValueTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "normalize/clr-logratio-one-component-value",
    title: "CLR Logratio One Component Value Tool",
    description:
      "Calculate clr logratio one component value from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        component: { type: "number", exclusiveMinimum: 0 },
        geometricMean: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["component", "geometricMean"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { value: { type: "number" } },
      required: ["value"],
    },
    ports: {
      inputs: [
        {
          id: "component",
          label: "Component",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "geometricMean",
          label: "Geometric Mean",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "value", label: "Value", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = clrLogratioOneComponentValueTool.execute;
export default clrLogratioOneComponentValueTool;
