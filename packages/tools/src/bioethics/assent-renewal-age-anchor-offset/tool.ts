import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly currentAge: number;
  readonly suppliedRenewalAge: number;
};
export type Output = {
  readonly ageRemaining: number;
  readonly reached: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    currentAge: { type: "number", minimum: 0 },
    suppliedRenewalAge: { type: "number", minimum: 0 },
  },
  required: ["currentAge", "suppliedRenewalAge"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ageRemaining: { type: "number" },
    reached: { type: "boolean" },
  },
  required: ["ageRemaining", "reached"],
} as const;
/** Calculate assent renewal age anchor offset from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { currentAge, suppliedRenewalAge } = request;
  const compute = (): Output => {
    H.domain(currentAge >= 0 && suppliedRenewalAge >= 0);
    return {
      ageRemaining: suppliedRenewalAge - currentAge,
      reached: currentAge >= suppliedRenewalAge,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { currentAge: 12, suppliedRenewalAge: 14 },
  output: { ageRemaining: 2, reached: false },
} satisfies ToolExample<Input, Output>;
export const assentRenewalAgeAnchorOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioethics/assent-renewal-age-anchor-offset",
    title: "Assent Renewal Age Anchor Offset Tool",
    description:
      "Calculate assent renewal age anchor offset from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        currentAge: { type: "number", minimum: 0 },
        suppliedRenewalAge: { type: "number", minimum: 0 },
      },
      required: ["currentAge", "suppliedRenewalAge"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ageRemaining: { type: "number" },
        reached: { type: "boolean" },
      },
      required: ["ageRemaining", "reached"],
    },
    ports: {
      inputs: [
        {
          id: "currentAge",
          label: "Current Age",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedRenewalAge",
          label: "Supplied Renewal Age",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "ageRemaining",
          label: "Age Remaining",
          valueType: { type: "number" },
        },
        { id: "reached", label: "Reached", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = assentRenewalAgeAnchorOffsetTool.execute;
export default assentRenewalAgeAnchorOffsetTool;
