import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly headingRadians: number;
  readonly angularSpeed: number;
};
export type Output = { readonly eastAngularSpeed: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    headingRadians: { type: "number" },
    angularSpeed: { type: "number" },
  },
  required: ["headingRadians", "angularSpeed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { eastAngularSpeed: { type: "number" } },
  required: ["eastAngularSpeed"],
} as const;
/** Calculate great circle heading east component from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { headingRadians, angularSpeed } = request;
  const compute = (): Output => {
    return { eastAngularSpeed: angularSpeed * Math.sin(headingRadians) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { headingRadians: 1.5707963267948966, angularSpeed: 2 },
  output: { eastAngularSpeed: 2 },
} satisfies ToolExample<Input, Output>;
export const greatCircleHeadingEastComponentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geography/great-circle-heading-east-component",
    title: "Great Circle Heading East Component Tool",
    description:
      "Calculate great circle heading east component from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        headingRadians: { type: "number" },
        angularSpeed: { type: "number" },
      },
      required: ["headingRadians", "angularSpeed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { eastAngularSpeed: { type: "number" } },
      required: ["eastAngularSpeed"],
    },
    ports: {
      inputs: [
        {
          id: "headingRadians",
          label: "Heading Radians",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "angularSpeed",
          label: "Angular Speed",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "eastAngularSpeed",
          label: "East Angular Speed",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = greatCircleHeadingEastComponentTool.execute;
export default greatCircleHeadingEastComponentTool;
