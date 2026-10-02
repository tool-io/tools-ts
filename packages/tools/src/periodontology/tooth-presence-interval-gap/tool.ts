import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousObservedAt: number;
  readonly currentObservedAt: number;
  readonly previousPresent: boolean;
  readonly currentPresent: boolean;
};
export type Output = { readonly gap: number; readonly changed: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousObservedAt: { type: "number" },
    currentObservedAt: { type: "number" },
    previousPresent: { type: "boolean" },
    currentPresent: { type: "boolean" },
  },
  required: [
    "previousObservedAt",
    "currentObservedAt",
    "previousPresent",
    "currentPresent",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "number" }, changed: { type: "boolean" } },
  required: ["gap", "changed"],
} as const;
/** Compare explicit tooth-presence research annotations without inferring an unobserved loss date. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    previousObservedAt,
    currentObservedAt,
    previousPresent,
    currentPresent,
  } = request;
  const compute = (): Output => {
    H.domain(currentObservedAt >= previousObservedAt);
    return {
      gap: currentObservedAt - previousObservedAt,
      changed: previousPresent !== currentPresent,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    previousObservedAt: 10,
    currentObservedAt: 25,
    previousPresent: true,
    currentPresent: false,
  },
  output: { gap: 15, changed: true },
} satisfies ToolExample<Input, Output>;
export const toothPresenceIntervalGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "periodontology/tooth-presence-interval-gap",
    title: "Tooth Presence Interval Gap Tool",
    description:
      "Compare explicit tooth-presence research annotations without inferring an unobserved loss date.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousObservedAt: { type: "number" },
        currentObservedAt: { type: "number" },
        previousPresent: { type: "boolean" },
        currentPresent: { type: "boolean" },
      },
      required: [
        "previousObservedAt",
        "currentObservedAt",
        "previousPresent",
        "currentPresent",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gap: { type: "number" }, changed: { type: "boolean" } },
      required: ["gap", "changed"],
    },
    ports: {
      inputs: [
        {
          id: "previousObservedAt",
          label: "Previous Observed At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "currentObservedAt",
          label: "Current Observed At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "previousPresent",
          label: "Previous Present",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "currentPresent",
          label: "Current Present",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "gap", label: "Gap", valueType: { type: "number" } },
        { id: "changed", label: "Changed", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = toothPresenceIntervalGapTool.execute;
export default toothPresenceIntervalGapTool;
