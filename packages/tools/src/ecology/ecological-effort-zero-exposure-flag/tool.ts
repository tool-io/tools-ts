import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly events: number; readonly effort: number };
export type Output = {
  readonly rateDefined: boolean;
  readonly rate: number;
  readonly zeroExposure: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    events: { type: "integer", minimum: 0 },
    effort: { type: "number", minimum: 0 },
  },
  required: ["events", "effort"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rateDefined: { type: "boolean" },
    rate: { type: "number" },
    zeroExposure: { type: "boolean" },
  },
  required: ["rateDefined", "rate", "zeroExposure"],
} as const;
/** Preserve an undefined zero-effort rate using an explicit flag and zero placeholder. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { events, effort } = request;
  const compute = (): Output => {
    H.integer(events, 0);
    H.domain(effort >= 0);
    return {
      rateDefined: effort > 0,
      rate: effort > 0 ? events / effort : 0,
      zeroExposure: effort === 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { events: 3, effort: 0 },
  output: { rateDefined: false, rate: 0, zeroExposure: true },
} satisfies ToolExample<Input, Output>;
export const ecologicalEffortZeroExposureFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ecology/ecological-effort-zero-exposure-flag",
    title: "Ecological Effort Zero Exposure Flag Tool",
    description:
      "Preserve an undefined zero-effort rate using an explicit flag and zero placeholder.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        events: { type: "integer", minimum: 0 },
        effort: { type: "number", minimum: 0 },
      },
      required: ["events", "effort"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rateDefined: { type: "boolean" },
        rate: { type: "number" },
        zeroExposure: { type: "boolean" },
      },
      required: ["rateDefined", "rate", "zeroExposure"],
    },
    ports: {
      inputs: [
        {
          id: "events",
          label: "Events",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "effort",
          label: "Effort",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "rateDefined",
          label: "Rate Defined",
          valueType: { type: "boolean" },
        },
        { id: "rate", label: "Rate", valueType: { type: "number" } },
        {
          id: "zeroExposure",
          label: "Zero Exposure",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = ecologicalEffortZeroExposureFlagTool.execute;
export default ecologicalEffortZeroExposureFlagTool;
