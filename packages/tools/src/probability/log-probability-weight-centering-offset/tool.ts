import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly logWeights: readonly number[] };
export type Output = {
  readonly centered: readonly number[];
  readonly offset: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    logWeights: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["logWeights"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    centered: { type: "array", maxItems: 256, items: { type: "number" } },
    offset: { type: "number" },
  },
  required: ["centered", "offset"],
} as const;
/** Calculate log probability weight centering offset from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { logWeights } = input;
  const compute = (): Output => {
    H.domain(logWeights.length > 0);
    const offset = Math.max(...logWeights);
    return { centered: logWeights.map((x) => x - offset), offset };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { logWeights: [1000, 998, 999] },
  output: { centered: [0, -2, -1], offset: 1000 },
} satisfies ToolExample<Input, Output>;
export const logProbabilityWeightCenteringOffsetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "probability/log-probability-weight-centering-offset",
      title: "Log Probability Weight Centering Offset Tool",
      description:
        "Calculate log probability weight centering offset from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          logWeights: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
        },
        required: ["logWeights"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          centered: { type: "array", maxItems: 256, items: { type: "number" } },
          offset: { type: "number" },
        },
        required: ["centered", "offset"],
      },
      ports: {
        inputs: [
          {
            id: "logWeights",
            label: "Log Weights",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
        outputs: [
          {
            id: "centered",
            label: "Centered",
            valueType: { type: "list", items: { type: "number" } },
          },
          { id: "offset", label: "Offset", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = logProbabilityWeightCenteringOffsetTool.execute;
export default logProbabilityWeightCenteringOffsetTool;
