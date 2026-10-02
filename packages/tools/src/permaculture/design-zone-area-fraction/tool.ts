import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly zoneArea: number;
  readonly designArea: number;
  readonly excludedArea: number;
};
export type Output = {
  readonly eligibleZone: number;
  readonly fraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    zoneArea: { type: "number", minimum: 0 },
    designArea: { type: "number", exclusiveMinimum: 0 },
    excludedArea: { type: "number", minimum: 0 },
  },
  required: ["zoneArea", "designArea", "excludedArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleZone: { type: "number" },
    fraction: { type: "number" },
  },
  required: ["eligibleZone", "fraction"],
} as const;
/** Supplied design-zone area accounting without inferring ecological performance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { zoneArea, designArea, excludedArea } = request;
  const compute = (): Output => {
    H.positive(designArea);
    H.domain(
      zoneArea >= 0 &&
        zoneArea <= designArea &&
        excludedArea >= 0 &&
        excludedArea <= zoneArea,
    );
    return {
      eligibleZone: zoneArea - excludedArea,
      fraction: (zoneArea - excludedArea) / designArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { zoneArea: 30, designArea: 100, excludedArea: 5 },
  output: { eligibleZone: 25, fraction: 0.25 },
} satisfies ToolExample<Input, Output>;
export const designZoneAreaFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "permaculture/design-zone-area-fraction",
    title: "Design Zone Area Fraction Tool",
    description:
      "Supplied design-zone area accounting without inferring ecological performance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        zoneArea: { type: "number", minimum: 0 },
        designArea: { type: "number", exclusiveMinimum: 0 },
        excludedArea: { type: "number", minimum: 0 },
      },
      required: ["zoneArea", "designArea", "excludedArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleZone: { type: "number" },
        fraction: { type: "number" },
      },
      required: ["eligibleZone", "fraction"],
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
          id: "designArea",
          label: "Design Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedArea",
          label: "Excluded Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "eligibleZone",
          label: "Eligible Zone",
          valueType: { type: "number" },
        },
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = designZoneAreaFractionTool.execute;
export default designZoneAreaFractionTool;
