import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bracketCenter: number;
  readonly toothModelCenter: number;
  readonly axisReversed: boolean;
};
export type Output = { readonly decentering: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bracketCenter: { type: "number" },
    toothModelCenter: { type: "number" },
    axisReversed: { type: "boolean" },
  },
  required: ["bracketCenter", "toothModelCenter", "axisReversed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { decentering: { type: "number" } },
  required: ["decentering"],
} as const;
/** Signed one-axis bench-model center displacement without bracket placement advice. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bracketCenter, toothModelCenter, axisReversed } = request;
  const compute = (): Output => {
    return {
      decentering: (bracketCenter - toothModelCenter) * (axisReversed ? -1 : 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bracketCenter: 7, toothModelCenter: 5, axisReversed: false },
  output: { decentering: 2 },
} satisfies ToolExample<Input, Output>;
export const bracketModelDecenteringTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "orthodontics/bracket-model-decentering-token",
    title: "Bracket Model Decentering Token Tool",
    description:
      "Signed one-axis bench-model center displacement without bracket placement advice.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bracketCenter: { type: "number" },
        toothModelCenter: { type: "number" },
        axisReversed: { type: "boolean" },
      },
      required: ["bracketCenter", "toothModelCenter", "axisReversed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { decentering: { type: "number" } },
      required: ["decentering"],
    },
    ports: {
      inputs: [
        {
          id: "bracketCenter",
          label: "Bracket Center",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "toothModelCenter",
          label: "Tooth Model Center",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "axisReversed",
          label: "Axis Reversed",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "decentering",
          label: "Decentering",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = bracketModelDecenteringTokenTool.execute;
export default bracketModelDecenteringTokenTool;
