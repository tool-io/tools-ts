import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredWhenActive: readonly boolean[];
  readonly active: readonly boolean[];
  readonly present: readonly boolean[];
};
export type Output = {
  readonly requiredCount: number;
  readonly missingCount: number;
  readonly surplusPresent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredWhenActive: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    active: { type: "array", maxItems: 256, items: { type: "boolean" } },
    present: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["requiredWhenActive", "active", "present"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredCount: { type: "integer" },
    missingCount: { type: "integer" },
    surplusPresent: { type: "integer" },
  },
  required: ["requiredCount", "missingCount", "surplusPresent"],
} as const;
/** Calculate conditional required count gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredWhenActive, active, present } = request;
  const compute = (): Output => {
    H.sameLength(requiredWhenActive, active);
    H.sameLength(active, present);
    return {
      requiredCount: active.filter((x, i) => x && requiredWhenActive[i]).length,
      missingCount: active.filter(
        (x, i) => x && requiredWhenActive[i] && !present[i],
      ).length,
      surplusPresent: present.filter(
        (x, i) => x && !(active[i] && requiredWhenActive[i]),
      ).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    requiredWhenActive: [true, true, false],
    active: [true, false, true],
    present: [false, true, true],
  },
  output: { requiredCount: 1, missingCount: 1, surplusPresent: 2 },
} satisfies ToolExample<Input, Output>;
export const conditionalRequiredCountGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "validate/conditional-required-count-gap",
    title: "Conditional Required Count Gap Tool",
    description:
      "Calculate conditional required count gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredWhenActive: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        active: { type: "array", maxItems: 256, items: { type: "boolean" } },
        present: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["requiredWhenActive", "active", "present"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredCount: { type: "integer" },
        missingCount: { type: "integer" },
        surplusPresent: { type: "integer" },
      },
      required: ["requiredCount", "missingCount", "surplusPresent"],
    },
    ports: {
      inputs: [
        {
          id: "requiredWhenActive",
          label: "Required When Active",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "active",
          label: "Active",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "present",
          label: "Present",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "requiredCount",
          label: "Required Count",
          valueType: { type: "integer" },
        },
        {
          id: "missingCount",
          label: "Missing Count",
          valueType: { type: "integer" },
        },
        {
          id: "surplusPresent",
          label: "Surplus Present",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = conditionalRequiredCountGapTool.execute;
export default conditionalRequiredCountGapTool;
