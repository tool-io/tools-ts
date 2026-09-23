import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstDegree: number;
  readonly secondDegree: number;
};
export type Output = { readonly sign: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstDegree: { type: "integer", minimum: 0 },
    secondDegree: { type: "integer", minimum: 0 },
  },
  required: ["firstDegree", "secondDegree"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sign: { type: "integer" } },
  required: ["sign"],
} as const;
/** Calculate differential form wedge sign from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { firstDegree, secondDegree } = input;
  const compute = (): Output => {
    H.integer(firstDegree, 0);
    H.integer(secondDegree, 0);
    return { sign: firstDegree % 2 && secondDegree % 2 ? -1 : 1 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { firstDegree: 1, secondDegree: 3 },
  output: { sign: -1 },
} satisfies ToolExample<Input, Output>;
export const differentialFormWedgeSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "calculus/differential-form-wedge-sign",
    title: "Differential Form Wedge Sign Tool",
    description:
      "Calculate differential form wedge sign from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstDegree: { type: "integer", minimum: 0 },
        secondDegree: { type: "integer", minimum: 0 },
      },
      required: ["firstDegree", "secondDegree"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { sign: { type: "integer" } },
      required: ["sign"],
    },
    ports: {
      inputs: [
        {
          id: "firstDegree",
          label: "First Degree",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondDegree",
          label: "Second Degree",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "sign", label: "Sign", valueType: { type: "integer" } }],
    },
  },
  calculate,
});
export const run = differentialFormWedgeSignTool.execute;
export default differentialFormWedgeSignTool;
