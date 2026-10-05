import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredLiters: number;
  readonly litersPerContainer: number;
};
export type Output = {
  readonly containerCount: number;
  readonly unusedCapacityLiters: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredLiters: { type: "number", minimum: 0 },
    litersPerContainer: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["requiredLiters", "litersPerContainer"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    containerCount: { type: "integer" },
    unusedCapacityLiters: { type: "number" },
  },
  required: ["containerCount", "unusedCapacityLiters"],
} as const;
/** Count whole containers needed for an explicit humanitarian water quantity, without selecting a consumption requirement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredLiters, litersPerContainer } = request;
  const compute = (): Output => {
    H.domain(requiredLiters >= 0, "requiredLiters");
    (H.domain(litersPerContainer > 0, "litersPerContainer"),
      litersPerContainer);
    return (() => {
      const containerCount = Math.ceil(requiredLiters / litersPerContainer);
      return {
        containerCount,
        unusedCapacityLiters:
          containerCount * litersPerContainer - requiredLiters,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requiredLiters: 103, litersPerContainer: 20 },
  output: { containerCount: 6, unusedCapacityLiters: 17 },
} satisfies ToolExample<Input, Output>;
export const reliefWaterContainerCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "military-science/relief-water-container-count",
    title: "Relief Water Container Count Tool",
    description:
      "Count whole containers needed for an explicit humanitarian water quantity, without selecting a consumption requirement.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredLiters: { type: "number", minimum: 0 },
        litersPerContainer: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["requiredLiters", "litersPerContainer"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        containerCount: { type: "integer" },
        unusedCapacityLiters: { type: "number" },
      },
      required: ["containerCount", "unusedCapacityLiters"],
    },
    ports: {
      inputs: [
        {
          id: "requiredLiters",
          label: "Required Liters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "litersPerContainer",
          label: "Liters Per Container",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "containerCount",
          label: "Container Count",
          valueType: { type: "integer" },
        },
        {
          id: "unusedCapacityLiters",
          label: "Unused Capacity Liters",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = reliefWaterContainerCountTool.execute;
export default reliefWaterContainerCountTool;
