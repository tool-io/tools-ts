import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly sampleTimes: readonly number[] };
export type Output = { readonly maximumGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleTimes: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["sampleTimes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { maximumGap: { type: "number" } },
  required: ["maximumGap"],
} as const;
/** Find the largest adjacent time gap in a supplied nondecreasing cooldown log without assessing cooling safety. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleTimes } = request;
  const compute = (): Output => {
    return (() => {
      H.domain(sampleTimes.length >= 2, "sampleTimes");
      let maximumGap = 0;
      for (let i = 1; i < sampleTimes.length; i++) {
        H.domain(sampleTimes[i] >= sampleTimes[i - 1], "sampleTimes");
        maximumGap = Math.max(maximumGap, sampleTimes[i] - sampleTimes[i - 1]);
      }
      return { maximumGap };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleTimes: [0, 2, 7, 8] },
  output: { maximumGap: 5 },
} satisfies ToolExample<Input, Output>;
export const cooldownLogMaximumSampleGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["cryogenics", "physics"],
      keywords: ["cryogenics", "physics"],
    },
    id: "cryogenics/cooldown-log-maximum-sample-gap",
    title: "Cooldown Log Maximum Sample Gap",
    description:
      "Find the largest adjacent time gap in a supplied nondecreasing cooldown log without assessing cooling safety.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleTimes: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["sampleTimes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { maximumGap: { type: "number" } },
      required: ["maximumGap"],
    },
    ports: {
      inputs: [
        {
          id: "sampleTimes",
          label: "Sample Times",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "maximumGap",
          label: "Maximum Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cooldownLogMaximumSampleGapTool.execute;
export default cooldownLogMaximumSampleGapTool;
