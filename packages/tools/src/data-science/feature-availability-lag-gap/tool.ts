import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventAt: number;
  readonly availableAt: number;
  readonly allowedLag: number;
};
export type Output = { readonly lag: number; readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventAt: { type: "number" },
    availableAt: { type: "number" },
    allowedLag: { type: "number", minimum: 0 },
  },
  required: ["eventAt", "availableAt", "allowedLag"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lag: { type: "number" }, gap: { type: "number" } },
  required: ["lag", "gap"],
} as const;
/** Calculate feature availability lag gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventAt, availableAt, allowedLag } = request;
  const compute = (): Output => {
    H.domain(allowedLag >= 0);
    return {
      lag: availableAt - eventAt,
      gap: allowedLag - (availableAt - eventAt),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eventAt: 10, availableAt: 15, allowedLag: 8 },
  output: { lag: 5, gap: 3 },
} satisfies ToolExample<Input, Output>;
export const featureAvailabilityLagGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "data-science/feature-availability-lag-gap",
    title: "Feature Availability Lag Gap Tool",
    description:
      "Calculate feature availability lag gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventAt: { type: "number" },
        availableAt: { type: "number" },
        allowedLag: { type: "number", minimum: 0 },
      },
      required: ["eventAt", "availableAt", "allowedLag"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { lag: { type: "number" }, gap: { type: "number" } },
      required: ["lag", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "eventAt",
          label: "Event At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "availableAt",
          label: "Available At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "allowedLag",
          label: "Allowed Lag",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "lag", label: "Lag", valueType: { type: "number" } },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = featureAvailabilityLagGapTool.execute;
export default featureAvailabilityLagGapTool;
