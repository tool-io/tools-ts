import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly runLengths: readonly number[] };
export type Output = {
  readonly boundaries: number;
  readonly parity: number;
  readonly lastMatchesFirst: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    runLengths: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["runLengths"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    boundaries: { type: "integer" },
    parity: { type: "integer" },
    lastMatchesFirst: { type: "boolean" },
  },
  required: ["boundaries", "parity", "lastMatchesFirst"],
} as const;
/** Count alternations in an explicitly supplied two-label run-length encoding, preserving empty-stream status. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { runLengths } = request;
  const compute = (): Output => {
    H.domain(runLengths.every((x) => x > 0));
    return {
      boundaries: Math.max(0, runLengths.length - 1),
      parity: Math.max(0, runLengths.length - 1) % 2,
      lastMatchesFirst: runLengths.length > 0 && runLengths.length % 2 === 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { runLengths: [2, 3, 1] },
  output: { boundaries: 2, parity: 0, lastMatchesFirst: true },
} satisfies ToolExample<Input, Output>;
export const runBoundaryAlternationParityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sequence/run-boundary-alternation-parity",
    title: "Run Boundary Alternation Parity Tool",
    description:
      "Count alternations in an explicitly supplied two-label run-length encoding, preserving empty-stream status.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        runLengths: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["runLengths"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        boundaries: { type: "integer" },
        parity: { type: "integer" },
        lastMatchesFirst: { type: "boolean" },
      },
      required: ["boundaries", "parity", "lastMatchesFirst"],
    },
    ports: {
      inputs: [
        {
          id: "runLengths",
          label: "Run Lengths",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "boundaries",
          label: "Boundaries",
          valueType: { type: "integer" },
        },
        { id: "parity", label: "Parity", valueType: { type: "integer" } },
        {
          id: "lastMatchesFirst",
          label: "Last Matches First",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = runBoundaryAlternationParityTool.execute;
export default runBoundaryAlternationParityTool;
