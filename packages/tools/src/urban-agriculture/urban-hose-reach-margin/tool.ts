import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly usableHoseLength: number;
  readonly requiredRouteLength: number;
};
export type Output = {
  readonly reachMargin: number;
  readonly reachesUnderInputs: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    usableHoseLength: { type: "number", minimum: 0 },
    requiredRouteLength: { type: "number", minimum: 0 },
  },
  required: ["usableHoseLength", "requiredRouteLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reachMargin: { type: "number" },
    reachesUnderInputs: { type: "boolean" },
  },
  required: ["reachMargin", "reachesUnderInputs"],
} as const;
/** Compare explicit hose length and required routed length without estimating routing or water pressure. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { usableHoseLength, requiredRouteLength } = request;
  const compute = (): Output => {
    H.domain(
      usableHoseLength >= 0 && requiredRouteLength >= 0,
      "usableHoseLength",
    );
    return {
      reachMargin: usableHoseLength - requiredRouteLength,
      reachesUnderInputs: usableHoseLength >= requiredRouteLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { usableHoseLength: 30, requiredRouteLength: 24 },
  output: { reachMargin: 6, reachesUnderInputs: true },
} satisfies ToolExample<Input, Output>;
export const urbanHoseReachMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["urban-agriculture", "urban agriculture", "agriculture"],
      keywords: ["urban agriculture", "agriculture"],
    },
    id: "urban-agriculture/urban-hose-reach-margin",
    title: "Urban Hose Reach Margin",
    description:
      "Compare explicit hose length and required routed length without estimating routing or water pressure.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        usableHoseLength: { type: "number", minimum: 0 },
        requiredRouteLength: { type: "number", minimum: 0 },
      },
      required: ["usableHoseLength", "requiredRouteLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reachMargin: { type: "number" },
        reachesUnderInputs: { type: "boolean" },
      },
      required: ["reachMargin", "reachesUnderInputs"],
    },
    ports: {
      inputs: [
        {
          id: "usableHoseLength",
          label: "Usable Hose Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "requiredRouteLength",
          label: "Required Route Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "reachMargin",
          label: "Reach Margin",
          valueType: { type: "number" },
        },
        {
          id: "reachesUnderInputs",
          label: "Reaches Under Inputs",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = urbanHoseReachMarginTool.execute;
export default urbanHoseReachMarginTool;
