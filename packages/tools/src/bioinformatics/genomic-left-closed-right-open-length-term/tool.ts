import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly start: number; readonly end: number };
export type Output = {
  readonly length: number;
  readonly lastIncluded: number;
  readonly empty: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    start: { type: "integer", minimum: 0 },
    end: { type: "integer" },
  },
  required: ["start", "end"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "integer" },
    lastIncluded: { type: "integer" },
    empty: { type: "boolean" },
  },
  required: ["length", "lastIncluded", "empty"],
} as const;
/** Zero-based half-open interval length with -1 as the no-last-position sentinel for an empty interval. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { start, end } = request;
  const compute = (): Output => {
    H.integer(start, 0);
    H.integer(end, start);
    return {
      length: end - start,
      lastIncluded: end === start ? -1 : end - 1,
      empty: end === start,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { start: 100, end: 150 },
  output: { length: 50, lastIncluded: 149, empty: false },
} satisfies ToolExample<Input, Output>;
export const genomicLeftClosedRightOpenLengthTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "bioinformatics/genomic-left-closed-right-open-length-term",
      title: "Genomic Left Closed Right Open Length Term Tool",
      description:
        "Zero-based half-open interval length with -1 as the no-last-position sentinel for an empty interval.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          start: { type: "integer", minimum: 0 },
          end: { type: "integer" },
        },
        required: ["start", "end"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          length: { type: "integer" },
          lastIncluded: { type: "integer" },
          empty: { type: "boolean" },
        },
        required: ["length", "lastIncluded", "empty"],
      },
      ports: {
        inputs: [
          {
            id: "start",
            label: "Start",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "end",
            label: "End",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "length", label: "Length", valueType: { type: "integer" } },
          {
            id: "lastIncluded",
            label: "Last Included",
            valueType: { type: "integer" },
          },
          { id: "empty", label: "Empty", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = genomicLeftClosedRightOpenLengthTermTool.execute;
export default genomicLeftClosedRightOpenLengthTermTool;
