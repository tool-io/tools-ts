import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly horizontal: number;
  readonly vertical: number;
  readonly positiveBaseOut: boolean;
  readonly positiveBaseUp: boolean;
};
export type Output = {
  readonly baseOutComponent: number;
  readonly baseUpComponent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    horizontal: { type: "number" },
    vertical: { type: "number" },
    positiveBaseOut: { type: "boolean" },
    positiveBaseUp: { type: "boolean" },
  },
  required: ["horizontal", "vertical", "positiveBaseOut", "positiveBaseUp"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseOutComponent: { type: "number" },
    baseUpComponent: { type: "number" },
  },
  required: ["baseOutComponent", "baseUpComponent"],
} as const;
/** Relabel supplied prism components under explicit signs without deriving a lens prescription. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { horizontal, vertical, positiveBaseOut, positiveBaseUp } = request;
  const compute = (): Output => {
    return {
      baseOutComponent: horizontal * (positiveBaseOut ? 1 : -1),
      baseUpComponent: vertical * (positiveBaseUp ? 1 : -1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    horizontal: 2,
    vertical: 3,
    positiveBaseOut: false,
    positiveBaseUp: true,
  },
  output: { baseOutComponent: -2, baseUpComponent: 3 },
} satisfies ToolExample<Input, Output>;
export const prismBaseAxisSignTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "optometry/prism-base-axis-sign-token",
    title: "Prism Base Axis Sign Token Tool",
    description:
      "Relabel supplied prism components under explicit signs without deriving a lens prescription.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        horizontal: { type: "number" },
        vertical: { type: "number" },
        positiveBaseOut: { type: "boolean" },
        positiveBaseUp: { type: "boolean" },
      },
      required: ["horizontal", "vertical", "positiveBaseOut", "positiveBaseUp"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseOutComponent: { type: "number" },
        baseUpComponent: { type: "number" },
      },
      required: ["baseOutComponent", "baseUpComponent"],
    },
    ports: {
      inputs: [
        {
          id: "horizontal",
          label: "Horizontal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "vertical",
          label: "Vertical",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "positiveBaseOut",
          label: "Positive Base Out",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "positiveBaseUp",
          label: "Positive Base Up",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "baseOutComponent",
          label: "Base Out Component",
          valueType: { type: "number" },
        },
        {
          id: "baseUpComponent",
          label: "Base Up Component",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = prismBaseAxisSignTokenTool.execute;
export default prismBaseAxisSignTokenTool;
