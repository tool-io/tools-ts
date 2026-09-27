import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly longEdge: number;
  readonly shortEdge: number;
  readonly seamLength: number;
};
export type Output = {
  readonly excessLength: number;
  readonly easePerLength: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    longEdge: { type: "number", minimum: 0 },
    shortEdge: { type: "number", minimum: 0 },
    seamLength: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["longEdge", "shortEdge", "seamLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    excessLength: { type: "number" },
    easePerLength: { type: "number" },
  },
  required: ["excessLength", "easePerLength"],
} as const;
/** Compare supplied edge lengths against an explicit seam-length base, retaining signed ease. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { longEdge, shortEdge, seamLength } = request;
  const compute = (): Output => {
    H.positive(seamLength);
    H.domain(longEdge >= 0 && shortEdge >= 0);
    return {
      excessLength: longEdge - shortEdge,
      easePerLength: (longEdge - shortEdge) / seamLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { longEdge: 105, shortEdge: 100, seamLength: 100 },
  output: { excessLength: 5, easePerLength: 0.05 },
} satisfies ToolExample<Input, Output>;
export const seamEasePerLengthTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "fashion/seam-ease-per-length",
    title: "Seam Ease Per Length Tool",
    description:
      "Compare supplied edge lengths against an explicit seam-length base, retaining signed ease.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        longEdge: { type: "number", minimum: 0 },
        shortEdge: { type: "number", minimum: 0 },
        seamLength: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["longEdge", "shortEdge", "seamLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        excessLength: { type: "number" },
        easePerLength: { type: "number" },
      },
      required: ["excessLength", "easePerLength"],
    },
    ports: {
      inputs: [
        {
          id: "longEdge",
          label: "Long Edge",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "shortEdge",
          label: "Short Edge",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "seamLength",
          label: "Seam Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "excessLength",
          label: "Excess Length",
          valueType: { type: "number" },
        },
        {
          id: "easePerLength",
          label: "Ease Per Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = seamEasePerLengthTool.execute;
export default seamEasePerLengthTool;
