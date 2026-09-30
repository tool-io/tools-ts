import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly signal: number; readonly blank: number };
export type Output = {
  readonly difference: number;
  readonly negative: boolean;
  readonly zero: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signal: { type: "number" }, blank: { type: "number" } },
  required: ["signal", "blank"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    difference: { type: "number" },
    negative: { type: "boolean" },
    zero: { type: "boolean" },
  },
  required: ["difference", "negative", "zero"],
} as const;
/** Preserve negative and zero blank-subtraction cases without interpreting microbial viability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { signal, blank } = request;
  const compute = (): Output => {
    return {
      difference: signal - blank,
      negative: signal < blank,
      zero: signal === blank,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { signal: 2, blank: 3 },
  output: { difference: -1, negative: true, zero: false },
} satisfies ToolExample<Input, Output>;
export const microbialBlankNegativeCaseTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "microbiology/microbial-blank-negative-case-token",
    title: "Microbial Blank Negative Case Token Tool",
    description:
      "Preserve negative and zero blank-subtraction cases without interpreting microbial viability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signal: { type: "number" }, blank: { type: "number" } },
      required: ["signal", "blank"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        difference: { type: "number" },
        negative: { type: "boolean" },
        zero: { type: "boolean" },
      },
      required: ["difference", "negative", "zero"],
    },
    ports: {
      inputs: [
        {
          id: "signal",
          label: "Signal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "blank",
          label: "Blank",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "difference",
          label: "Difference",
          valueType: { type: "number" },
        },
        { id: "negative", label: "Negative", valueType: { type: "boolean" } },
        { id: "zero", label: "Zero", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = microbialBlankNegativeCaseTokenTool.execute;
export default microbialBlankNegativeCaseTokenTool;
