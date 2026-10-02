import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly zoneArea: number;
  readonly fieldArea: number;
  readonly excludedZoneArea: number;
};
export type Output = {
  readonly eligibleZoneArea: number;
  readonly weight: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    zoneArea: { type: "number", minimum: 0 },
    fieldArea: { type: "number", exclusiveMinimum: 0 },
    excludedZoneArea: { type: "number", minimum: 0 },
  },
  required: ["zoneArea", "fieldArea", "excludedZoneArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleZoneArea: { type: "number" },
    weight: { type: "number" },
  },
  required: ["eligibleZoneArea", "weight"],
} as const;
/** Calculate management zone area weight from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { zoneArea, fieldArea, excludedZoneArea } = request;
  const compute = (): Output => {
    H.positive(fieldArea);
    H.domain(
      zoneArea >= 0 &&
        zoneArea <= fieldArea &&
        excludedZoneArea >= 0 &&
        excludedZoneArea <= zoneArea,
    );
    return {
      eligibleZoneArea: zoneArea - excludedZoneArea,
      weight: (zoneArea - excludedZoneArea) / fieldArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { zoneArea: 20, fieldArea: 100, excludedZoneArea: 5 },
  output: { eligibleZoneArea: 15, weight: 0.15 },
} satisfies ToolExample<Input, Output>;
export const managementZoneAreaWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "precision-agriculture/management-zone-area-weight",
    title: "Management Zone Area Weight Tool",
    description:
      "Calculate management zone area weight from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        zoneArea: { type: "number", minimum: 0 },
        fieldArea: { type: "number", exclusiveMinimum: 0 },
        excludedZoneArea: { type: "number", minimum: 0 },
      },
      required: ["zoneArea", "fieldArea", "excludedZoneArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleZoneArea: { type: "number" },
        weight: { type: "number" },
      },
      required: ["eligibleZoneArea", "weight"],
    },
    ports: {
      inputs: [
        {
          id: "zoneArea",
          label: "Zone Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fieldArea",
          label: "Field Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedZoneArea",
          label: "Excluded Zone Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "eligibleZoneArea",
          label: "Eligible Zone Area",
          valueType: { type: "number" },
        },
        { id: "weight", label: "Weight", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = managementZoneAreaWeightTool.execute;
export default managementZoneAreaWeightTool;
