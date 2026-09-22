import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly signal: number;
  readonly blank: number;
  readonly suppliedReference: number;
};
export type Output = {
  readonly difference: number;
  readonly normalizedDifference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signal: { type: "number" },
    blank: { type: "number" },
    suppliedReference: { type: "number" },
  },
  required: ["signal", "blank", "suppliedReference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    difference: { type: "number" },
    normalizedDifference: { type: "number" },
  },
  required: ["difference", "normalizedDifference"],
} as const;
/** Signed supplied blank subtraction divided by an explicit reference signal. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { signal, blank, suppliedReference } = request;
  const compute = (): Output => {
    H.domain(suppliedReference !== 0);
    return {
      difference: signal - blank,
      normalizedDifference: (signal - blank) / suppliedReference,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { signal: 10, blank: 2, suppliedReference: 4 },
  output: { difference: 8, normalizedDifference: 2 },
} satisfies ToolExample<Input, Output>;
export const blankSignalNormalizedDifferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-chemistry/blank-signal-normalized-difference",
    title: "Blank Signal Normalized Difference Tool",
    description:
      "Signed supplied blank subtraction divided by an explicit reference signal.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signal: { type: "number" },
        blank: { type: "number" },
        suppliedReference: { type: "number" },
      },
      required: ["signal", "blank", "suppliedReference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        difference: { type: "number" },
        normalizedDifference: { type: "number" },
      },
      required: ["difference", "normalizedDifference"],
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
        {
          id: "suppliedReference",
          label: "Supplied Reference",
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
        {
          id: "normalizedDifference",
          label: "Normalized Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = blankSignalNormalizedDifferenceTool.execute;
export default blankSignalNormalizedDifferenceTool;
