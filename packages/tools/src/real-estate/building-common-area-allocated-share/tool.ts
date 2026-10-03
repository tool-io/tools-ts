import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly commonArea: number;
  readonly tenantUsable: number;
  readonly totalUsable: number;
};
export type Output = {
  readonly fraction: number;
  readonly allocatedCommon: number;
  readonly rentableArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    commonArea: { type: "number", minimum: 0 },
    tenantUsable: { type: "number", minimum: 0 },
    totalUsable: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["commonArea", "tenantUsable", "totalUsable"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fraction: { type: "number" },
    allocatedCommon: { type: "number" },
    rentableArea: { type: "number" },
  },
  required: ["fraction", "allocatedCommon", "rentableArea"],
} as const;
/** Calculate building common area allocated share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { commonArea, tenantUsable, totalUsable } = request;
  const compute = (): Output => {
    H.positive(totalUsable);
    H.domain(
      commonArea >= 0 && tenantUsable >= 0 && tenantUsable <= totalUsable,
    );
    return {
      fraction: tenantUsable / totalUsable,
      allocatedCommon: (commonArea * tenantUsable) / totalUsable,
      rentableArea: tenantUsable + (commonArea * tenantUsable) / totalUsable,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { commonArea: 200, tenantUsable: 100, totalUsable: 1000 },
  output: { fraction: 0.1, allocatedCommon: 20, rentableArea: 120 },
} satisfies ToolExample<Input, Output>;
export const buildingCommonAreaAllocatedShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "real-estate/building-common-area-allocated-share",
    title: "Building Common Area Allocated Share Tool",
    description:
      "Calculate building common area allocated share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        commonArea: { type: "number", minimum: 0 },
        tenantUsable: { type: "number", minimum: 0 },
        totalUsable: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["commonArea", "tenantUsable", "totalUsable"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        allocatedCommon: { type: "number" },
        rentableArea: { type: "number" },
      },
      required: ["fraction", "allocatedCommon", "rentableArea"],
    },
    ports: {
      inputs: [
        {
          id: "commonArea",
          label: "Common Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tenantUsable",
          label: "Tenant Usable",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalUsable",
          label: "Total Usable",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        {
          id: "allocatedCommon",
          label: "Allocated Common",
          valueType: { type: "number" },
        },
        {
          id: "rentableArea",
          label: "Rentable Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = buildingCommonAreaAllocatedShareTool.execute;
export default buildingCommonAreaAllocatedShareTool;
