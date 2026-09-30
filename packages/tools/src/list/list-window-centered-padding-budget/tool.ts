import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly length: number;
  readonly center: number;
  readonly radius: number;
};
export type Output = {
  readonly leftPadding: number;
  readonly rightPadding: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "integer", minimum: 1 },
    center: { type: "integer", minimum: 0 },
    radius: { type: "integer", minimum: 0 },
  },
  required: ["length", "center", "radius"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftPadding: { type: "integer" },
    rightPadding: { type: "integer" },
  },
  required: ["leftPadding", "rightPadding"],
} as const;
/** Calculate list window centered padding budget from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { length, center, radius } = input;
  const compute = (): Output => {
    H.integer(length, 1);
    H.integer(center, 0, length - 1);
    H.integer(radius, 0);
    return {
      leftPadding: Math.max(0, radius - center),
      rightPadding: Math.max(0, center + radius - length + 1),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { length: 5, center: 0, radius: 2 },
  output: { leftPadding: 2, rightPadding: 0 },
} satisfies ToolExample<Input, Output>;
export const listWindowCenteredPaddingBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "list/list-window-centered-padding-budget",
    title: "List Window Centered Padding Budget Tool",
    description:
      "Calculate list window centered padding budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        length: { type: "integer", minimum: 1 },
        center: { type: "integer", minimum: 0 },
        radius: { type: "integer", minimum: 0 },
      },
      required: ["length", "center", "radius"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leftPadding: { type: "integer" },
        rightPadding: { type: "integer" },
      },
      required: ["leftPadding", "rightPadding"],
    },
    ports: {
      inputs: [
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "center",
          label: "Center",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "radius",
          label: "Radius",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "leftPadding",
          label: "Left Padding",
          valueType: { type: "integer" },
        },
        {
          id: "rightPadding",
          label: "Right Padding",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = listWindowCenteredPaddingBudgetTool.execute;
export default listWindowCenteredPaddingBudgetTool;
