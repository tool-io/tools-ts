import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly oneWayMinutes: number;
  readonly returnMultiplier: number;
  readonly visitCount: number;
};
export type Output = { readonly totalTravelMinutes: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oneWayMinutes: { type: "number", minimum: 0 },
    returnMultiplier: { type: "number", minimum: 0 },
    visitCount: { type: "integer", minimum: 0 },
  },
  required: ["oneWayMinutes", "returnMultiplier", "visitCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { totalTravelMinutes: { type: "number" } },
  required: ["totalTravelMinutes"],
} as const;
/** Calculate explicit travel-time burden using a supplied one-way duration, return factor, and visit count. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { oneWayMinutes, returnMultiplier, visitCount } = request;
  const compute = (): Output => {
    H.domain(oneWayMinutes >= 0 && returnMultiplier >= 0, "oneWayMinutes");
    (H.domain(
      Number.isSafeInteger(visitCount) &&
        visitCount >= 0 &&
        visitCount <= Number.MAX_SAFE_INTEGER,
      "visitCount",
    ),
      visitCount);
    return {
      totalTravelMinutes: oneWayMinutes * returnMultiplier * visitCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { oneWayMinutes: 30, returnMultiplier: 2, visitCount: 4 },
  output: { totalTravelMinutes: 240 },
} satisfies ToolExample<Input, Output>;
export const researchBurdenOneWayTravelTimeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["bioethics", "research and quality management"],
      keywords: ["bioethics", "research and quality management"],
    },
    id: "bioethics/research-burden-one-way-travel-time",
    title: "Research Burden One Way Travel Time",
    description:
      "Calculate explicit travel-time burden using a supplied one-way duration, return factor, and visit count.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oneWayMinutes: { type: "number", minimum: 0 },
        returnMultiplier: { type: "number", minimum: 0 },
        visitCount: { type: "integer", minimum: 0 },
      },
      required: ["oneWayMinutes", "returnMultiplier", "visitCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { totalTravelMinutes: { type: "number" } },
      required: ["totalTravelMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "oneWayMinutes",
          label: "One Way Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "returnMultiplier",
          label: "Return Multiplier",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "visitCount",
          label: "Visit Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "totalTravelMinutes",
          label: "Total Travel Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = researchBurdenOneWayTravelTimeTool.execute;
export default researchBurdenOneWayTravelTimeTool;
