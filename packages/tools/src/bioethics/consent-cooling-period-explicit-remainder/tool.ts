import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly elapsedHours: number;
  readonly requiredHours: number;
};
export type Output = {
  readonly remaining: number;
  readonly elapsedEnough: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsedHours: { type: "number", minimum: 0 },
    requiredHours: { type: "number", minimum: 0 },
  },
  required: ["elapsedHours", "requiredHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remaining: { type: "number" },
    elapsedEnough: { type: "boolean" },
  },
  required: ["remaining", "elapsedEnough"],
} as const;
/** Calculate consent cooling period explicit remainder from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { elapsedHours, requiredHours } = request;
  const compute = (): Output => {
    H.domain(elapsedHours >= 0 && requiredHours >= 0);
    return {
      remaining: Math.max(0, requiredHours - elapsedHours),
      elapsedEnough: elapsedHours >= requiredHours,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { elapsedHours: 18, requiredHours: 24 },
  output: { remaining: 6, elapsedEnough: false },
} satisfies ToolExample<Input, Output>;
export const consentCoolingPeriodExplicitRemainderTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "bioethics/consent-cooling-period-explicit-remainder",
      title: "Consent Cooling Period Explicit Remainder Tool",
      description:
        "Calculate consent cooling period explicit remainder from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          elapsedHours: { type: "number", minimum: 0 },
          requiredHours: { type: "number", minimum: 0 },
        },
        required: ["elapsedHours", "requiredHours"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          remaining: { type: "number" },
          elapsedEnough: { type: "boolean" },
        },
        required: ["remaining", "elapsedEnough"],
      },
      ports: {
        inputs: [
          {
            id: "elapsedHours",
            label: "Elapsed Hours",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "requiredHours",
            label: "Required Hours",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "remaining",
            label: "Remaining",
            valueType: { type: "number" },
          },
          {
            id: "elapsedEnough",
            label: "Elapsed Enough",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = consentCoolingPeriodExplicitRemainderTool.execute;
export default consentCoolingPeriodExplicitRemainderTool;
