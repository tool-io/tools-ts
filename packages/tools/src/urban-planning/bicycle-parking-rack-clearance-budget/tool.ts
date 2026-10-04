import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly racks: number;
  readonly rackWidth: number;
  readonly gap: number;
  readonly endClearance: number;
  readonly availableWidth: number;
};
export type Output = {
  readonly requiredWidth: number;
  readonly margin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    racks: { type: "integer", minimum: 1 },
    rackWidth: { type: "number", minimum: 0 },
    gap: { type: "number", minimum: 0 },
    endClearance: { type: "number", minimum: 0 },
    availableWidth: { type: "number", minimum: 0 },
  },
  required: ["racks", "rackWidth", "gap", "endClearance", "availableWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { requiredWidth: { type: "number" }, margin: { type: "number" } },
  required: ["requiredWidth", "margin"],
} as const;
/** Calculate bicycle parking rack clearance budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { racks, rackWidth, gap, endClearance, availableWidth } = request;
  const compute = (): Output => {
    H.integer(racks, 1);
    H.domain(
      rackWidth >= 0 && gap >= 0 && endClearance >= 0 && availableWidth >= 0,
    );
    return {
      requiredWidth:
        racks * rackWidth + Math.max(0, racks - 1) * gap + 2 * endClearance,
      margin:
        availableWidth -
        racks * rackWidth -
        Math.max(0, racks - 1) * gap -
        2 * endClearance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    racks: 4,
    rackWidth: 0.5,
    gap: 0.5,
    endClearance: 1,
    availableWidth: 6,
  },
  output: { requiredWidth: 5.5, margin: 0.5 },
} satisfies ToolExample<Input, Output>;
export const bicycleParkingRackClearanceBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-planning/bicycle-parking-rack-clearance-budget",
    title: "Bicycle Parking Rack Clearance Budget Tool",
    description:
      "Calculate bicycle parking rack clearance budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        racks: { type: "integer", minimum: 1 },
        rackWidth: { type: "number", minimum: 0 },
        gap: { type: "number", minimum: 0 },
        endClearance: { type: "number", minimum: 0 },
        availableWidth: { type: "number", minimum: 0 },
      },
      required: ["racks", "rackWidth", "gap", "endClearance", "availableWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredWidth: { type: "number" },
        margin: { type: "number" },
      },
      required: ["requiredWidth", "margin"],
    },
    ports: {
      inputs: [
        {
          id: "racks",
          label: "Racks",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "rackWidth",
          label: "Rack Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gap",
          label: "Gap",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endClearance",
          label: "End Clearance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "availableWidth",
          label: "Available Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "requiredWidth",
          label: "Required Width",
          valueType: { type: "number" },
        },
        { id: "margin", label: "Margin", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = bicycleParkingRackClearanceBudgetTool.execute;
export default bicycleParkingRackClearanceBudgetTool;
