import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly current: number;
  readonly requested: number;
  readonly riseRate: number;
  readonly fallRate: number;
  readonly step: number;
};
export type Output = { readonly next: number; readonly unmet: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    current: { type: "number" },
    requested: { type: "number" },
    riseRate: { type: "number", minimum: 0 },
    fallRate: { type: "number", minimum: 0 },
    step: { type: "number", minimum: 0 },
  },
  required: ["current", "requested", "riseRate", "fallRate", "step"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { next: { type: "number" }, unmet: { type: "number" } },
  required: ["next", "unmet"],
} as const;
/** Calculate actuator rate limit one step gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { current, requested, riseRate, fallRate, step } = request;
  const compute = (): Output => {
    H.domain(riseRate >= 0 && fallRate >= 0 && step >= 0);
    return {
      next: Math.max(
        current - fallRate * step,
        Math.min(current + riseRate * step, requested),
      ),
      unmet:
        requested -
        Math.max(
          current - fallRate * step,
          Math.min(current + riseRate * step, requested),
        ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { current: 10, requested: 20, riseRate: 2, fallRate: 3, step: 2 },
  output: { next: 14, unmet: 6 },
} satisfies ToolExample<Input, Output>;
export const actuatorRateLimitOneStepGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cybernetics/actuator-rate-limit-one-step-gap",
    title: "Actuator Rate Limit One Step Gap Tool",
    description:
      "Calculate actuator rate limit one step gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        current: { type: "number" },
        requested: { type: "number" },
        riseRate: { type: "number", minimum: 0 },
        fallRate: { type: "number", minimum: 0 },
        step: { type: "number", minimum: 0 },
      },
      required: ["current", "requested", "riseRate", "fallRate", "step"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { next: { type: "number" }, unmet: { type: "number" } },
      required: ["next", "unmet"],
    },
    ports: {
      inputs: [
        {
          id: "current",
          label: "Current",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "requested",
          label: "Requested",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "riseRate",
          label: "Rise Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fallRate",
          label: "Fall Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "step",
          label: "Step",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "next", label: "Next", valueType: { type: "number" } },
        { id: "unmet", label: "Unmet", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = actuatorRateLimitOneStepGapTool.execute;
export default actuatorRateLimitOneStepGapTool;
