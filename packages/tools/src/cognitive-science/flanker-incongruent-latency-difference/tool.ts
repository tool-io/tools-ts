import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly incongruentMeanMilliseconds: number;
  readonly congruentMeanMilliseconds: number;
};
export type Output = { readonly latencyDifferenceMilliseconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    incongruentMeanMilliseconds: { type: "number", minimum: 0 },
    congruentMeanMilliseconds: { type: "number", minimum: 0 },
  },
  required: ["incongruentMeanMilliseconds", "congruentMeanMilliseconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { latencyDifferenceMilliseconds: { type: "number" } },
  required: ["latencyDifferenceMilliseconds"],
} as const;
/** Compute a supplied flanker incongruent-minus-congruent latency contrast without selecting trial exclusions or estimating significance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { incongruentMeanMilliseconds, congruentMeanMilliseconds } = request;
  const compute = (): Output => {
    H.domain(
      incongruentMeanMilliseconds >= 0 && congruentMeanMilliseconds >= 0,
      "incongruentMeanMilliseconds",
    );
    return {
      latencyDifferenceMilliseconds:
        incongruentMeanMilliseconds - congruentMeanMilliseconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { incongruentMeanMilliseconds: 520, congruentMeanMilliseconds: 480 },
  output: { latencyDifferenceMilliseconds: 40 },
} satisfies ToolExample<Input, Output>;
export const flankerIncongruentLatencyDifferenceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["cognitive-science", "cognitive science", "psychology"],
        keywords: ["cognitive science", "psychology"],
      },
      id: "cognitive-science/flanker-incongruent-latency-difference",
      title: "Flanker Incongruent Latency Difference",
      description:
        "Compute a supplied flanker incongruent-minus-congruent latency contrast without selecting trial exclusions or estimating significance.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          incongruentMeanMilliseconds: { type: "number", minimum: 0 },
          congruentMeanMilliseconds: { type: "number", minimum: 0 },
        },
        required: ["incongruentMeanMilliseconds", "congruentMeanMilliseconds"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { latencyDifferenceMilliseconds: { type: "number" } },
        required: ["latencyDifferenceMilliseconds"],
      },
      ports: {
        inputs: [
          {
            id: "incongruentMeanMilliseconds",
            label: "Incongruent Mean Milliseconds",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "congruentMeanMilliseconds",
            label: "Congruent Mean Milliseconds",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "latencyDifferenceMilliseconds",
            label: "Latency Difference Milliseconds",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = flankerIncongruentLatencyDifferenceTool.execute;
export default flankerIncongruentLatencyDifferenceTool;
