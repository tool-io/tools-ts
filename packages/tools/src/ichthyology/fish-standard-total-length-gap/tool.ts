import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly standardLength: number;
  readonly totalLength: number;
};
export type Output = {
  readonly difference: number;
  readonly ratio: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    standardLength: { type: "number", minimum: 0 },
    totalLength: { type: "number" },
  },
  required: ["standardLength", "totalLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    difference: { type: "number" },
    ratio: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["difference", "ratio", "defined"],
} as const;
/** Calculate fish standard total length gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { standardLength, totalLength } = request;
  const compute = (): Output => {
    H.domain(standardLength >= 0 && totalLength >= standardLength);
    return {
      difference: totalLength - standardLength,
      ratio: standardLength > 0 ? totalLength / standardLength : 0,
      defined: standardLength > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { standardLength: 20, totalLength: 25 },
  output: { difference: 5, ratio: 1.25, defined: true },
} satisfies ToolExample<Input, Output>;
export const fishStandardTotalLengthGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ichthyology/fish-standard-total-length-gap",
    title: "Fish Standard Total Length Gap Tool",
    description:
      "Calculate fish standard total length gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        standardLength: { type: "number", minimum: 0 },
        totalLength: { type: "number" },
      },
      required: ["standardLength", "totalLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        difference: { type: "number" },
        ratio: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["difference", "ratio", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "standardLength",
          label: "Standard Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalLength",
          label: "Total Length",
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
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = fishStandardTotalLengthGapTool.execute;
export default fishStandardTotalLengthGapTool;
