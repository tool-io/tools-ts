import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly siteCapacity: number;
  readonly assignedOccupancies: readonly number[];
};
export type Output = {
  readonly assignedTotal: number;
  readonly vacancy: number;
  readonly overfilled: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    siteCapacity: { type: "number", minimum: 0 },
    assignedOccupancies: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["siteCapacity", "assignedOccupancies"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    assignedTotal: { type: "number" },
    vacancy: { type: "number" },
    overfilled: { type: "boolean" },
  },
  required: ["assignedTotal", "vacancy", "overfilled"],
} as const;
/** Compare explicit mineral-site occupancy contributions to a supplied capacity without assigning valences or sites. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { siteCapacity, assignedOccupancies } = request;
  const compute = (): Output => {
    H.domain(siteCapacity >= 0, "siteCapacity");
    H.domain(
      assignedOccupancies.every((x) => x >= 0),
      "assignedOccupancies",
    );
    return (() => {
      const assignedTotal = assignedOccupancies.reduce((a, b) => a + b, 0);
      return {
        assignedTotal,
        vacancy: siteCapacity - assignedTotal,
        overfilled: assignedTotal > siteCapacity,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { siteCapacity: 2, assignedOccupancies: [0.8, 0.9] },
  output: {
    assignedTotal: 1.7000000000000002,
    vacancy: 0.2999999999999998,
    overfilled: false,
  },
} satisfies ToolExample<Input, Output>;
export const mineralFormulaOccupancyResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["geochemistry", "chemistry"],
      keywords: ["geochemistry", "chemistry"],
    },
    id: "geochemistry/mineral-formula-occupancy-residual",
    title: "Mineral Formula Occupancy Residual",
    description:
      "Compare explicit mineral-site occupancy contributions to a supplied capacity without assigning valences or sites.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        siteCapacity: { type: "number", minimum: 0 },
        assignedOccupancies: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["siteCapacity", "assignedOccupancies"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        assignedTotal: { type: "number" },
        vacancy: { type: "number" },
        overfilled: { type: "boolean" },
      },
      required: ["assignedTotal", "vacancy", "overfilled"],
    },
    ports: {
      inputs: [
        {
          id: "siteCapacity",
          label: "Site Capacity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "assignedOccupancies",
          label: "Assigned Occupancies",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "assignedTotal",
          label: "Assigned Total",
          valueType: { type: "number" },
        },
        { id: "vacancy", label: "Vacancy", valueType: { type: "number" } },
        {
          id: "overfilled",
          label: "Overfilled",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = mineralFormulaOccupancyResidualTool.execute;
export default mineralFormulaOccupancyResidualTool;
