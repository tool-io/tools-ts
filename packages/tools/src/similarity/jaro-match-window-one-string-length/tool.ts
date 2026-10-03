import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstLength: number;
  readonly secondLength: number;
};
export type Output = { readonly window: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstLength: { type: "integer", minimum: 0 },
    secondLength: { type: "integer", minimum: 0 },
  },
  required: ["firstLength", "secondLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { window: { type: "integer" } },
  required: ["window"],
} as const;
/** Calculate jaro match window one string length from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstLength, secondLength } = request;
  const compute = (): Output => {
    H.integer(firstLength, 0);
    H.integer(secondLength, 0);
    return {
      window: Math.max(
        0,
        Math.floor(Math.max(firstLength, secondLength) / 2) - 1,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstLength: 6, secondLength: 8 },
  output: { window: 3 },
} satisfies ToolExample<Input, Output>;
export const jaroMatchWindowOneStringLengthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "similarity/jaro-match-window-one-string-length",
    title: "Jaro Match Window One String Length Tool",
    description:
      "Calculate jaro match window one string length from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstLength: { type: "integer", minimum: 0 },
        secondLength: { type: "integer", minimum: 0 },
      },
      required: ["firstLength", "secondLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { window: { type: "integer" } },
      required: ["window"],
    },
    ports: {
      inputs: [
        {
          id: "firstLength",
          label: "First Length",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondLength",
          label: "Second Length",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "window", label: "Window", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = jaroMatchWindowOneStringLengthTool.execute;
export default jaroMatchWindowOneStringLengthTool;
