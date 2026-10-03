import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly firstNorm: number; readonly secondNorm: number };
export type Output = { readonly defined: boolean; readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstNorm: { type: "number", minimum: 0 },
    secondNorm: { type: "number", minimum: 0 },
  },
  required: ["firstNorm", "secondNorm"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    defined: { type: "boolean" },
    label: { type: "string", maxLength: 8192 },
  },
  required: ["defined", "label"],
} as const;
/** Calculate cosine zero support label from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstNorm, secondNorm } = request;
  const compute = (): Output => {
    H.domain(firstNorm >= 0 && secondNorm >= 0);
    return {
      defined: firstNorm > 0 && secondNorm > 0,
      label:
        firstNorm === 0 && secondNorm === 0
          ? "both-zero"
          : firstNorm === 0
            ? "first-zero"
            : secondNorm === 0
              ? "second-zero"
              : "defined",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstNorm: 0, secondNorm: 3 },
  output: { defined: false, label: "first-zero" },
} satisfies ToolExample<Input, Output>;
export const cosineZeroSupportLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "similarity/cosine-zero-support-label",
    title: "Cosine Zero Support Label Tool",
    description:
      "Calculate cosine zero support label from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstNorm: { type: "number", minimum: 0 },
        secondNorm: { type: "number", minimum: 0 },
      },
      required: ["firstNorm", "secondNorm"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        defined: { type: "boolean" },
        label: { type: "string", maxLength: 8192 },
      },
      required: ["defined", "label"],
    },
    ports: {
      inputs: [
        {
          id: "firstNorm",
          label: "First Norm",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondNorm",
          label: "Second Norm",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
        { id: "label", label: "Label", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = cosineZeroSupportLabelTool.execute;
export default cosineZeroSupportLabelTool;
