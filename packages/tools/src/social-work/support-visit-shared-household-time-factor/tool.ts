import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly directMinutes: number;
  readonly sharedMinutes: number;
  readonly households: number;
};
export type Output = { readonly allocatedMinutes: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    directMinutes: { type: "number", minimum: 0 },
    sharedMinutes: { type: "number", minimum: 0 },
    households: { type: "integer", minimum: 1 },
  },
  required: ["directMinutes", "sharedMinutes", "households"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { allocatedMinutes: { type: "number" } },
  required: ["allocatedMinutes"],
} as const;
/** Calculate support visit shared household time factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { directMinutes, sharedMinutes, households } = request;
  const compute = (): Output => {
    H.domain(directMinutes >= 0 && sharedMinutes >= 0);
    H.integer(households, 1);
    return { allocatedMinutes: directMinutes + sharedMinutes / households };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { directMinutes: 30, sharedMinutes: 60, households: 3 },
  output: { allocatedMinutes: 50 },
} satisfies ToolExample<Input, Output>;
export const supportVisitSharedHouseholdTimeFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "social-work/support-visit-shared-household-time-factor",
      title: "Support Visit Shared Household Time Factor Tool",
      description:
        "Calculate support visit shared household time factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          directMinutes: { type: "number", minimum: 0 },
          sharedMinutes: { type: "number", minimum: 0 },
          households: { type: "integer", minimum: 1 },
        },
        required: ["directMinutes", "sharedMinutes", "households"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { allocatedMinutes: { type: "number" } },
        required: ["allocatedMinutes"],
      },
      ports: {
        inputs: [
          {
            id: "directMinutes",
            label: "Direct Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sharedMinutes",
            label: "Shared Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "households",
            label: "Households",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "allocatedMinutes",
            label: "Allocated Minutes",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = supportVisitSharedHouseholdTimeFactorTool.execute;
export default supportVisitSharedHouseholdTimeFactorTool;
