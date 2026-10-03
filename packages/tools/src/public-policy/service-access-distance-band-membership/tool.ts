import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly distance: number;
  readonly lower: number;
  readonly upper: number;
  readonly includeUpper: boolean;
};
export type Output = { readonly member: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distance: { type: "number", minimum: 0 },
    lower: { type: "number", minimum: 0 },
    upper: { type: "number" },
    includeUpper: { type: "boolean" },
  },
  required: ["distance", "lower", "upper", "includeUpper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { member: { type: "boolean" } },
  required: ["member"],
} as const;
/** Calculate service access distance band membership from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { distance, lower, upper, includeUpper } = request;
  const compute = (): Output => {
    H.domain(distance >= 0 && lower >= 0 && upper >= lower);
    return {
      member:
        distance >= lower &&
        (includeUpper ? distance <= upper : distance < upper),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { distance: 10, lower: 5, upper: 10, includeUpper: true },
  output: { member: true },
} satisfies ToolExample<Input, Output>;
export const serviceAccessDistanceBandMembershipTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "public-policy/service-access-distance-band-membership",
      title: "Service Access Distance Band Membership Tool",
      description:
        "Calculate service access distance band membership from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          distance: { type: "number", minimum: 0 },
          lower: { type: "number", minimum: 0 },
          upper: { type: "number" },
          includeUpper: { type: "boolean" },
        },
        required: ["distance", "lower", "upper", "includeUpper"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { member: { type: "boolean" } },
        required: ["member"],
      },
      ports: {
        inputs: [
          {
            id: "distance",
            label: "Distance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "lower",
            label: "Lower",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "upper",
            label: "Upper",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "includeUpper",
            label: "Include Upper",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "member", label: "Member", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = serviceAccessDistanceBandMembershipTool.execute;
export default serviceAccessDistanceBandMembershipTool;
