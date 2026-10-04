import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalArea: number;
  readonly housingArea: number;
  readonly commercialArea: number;
};
export type Output = {
  readonly housingShare: number;
  readonly commercialShare: number;
  readonly otherArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalArea: { type: "number", exclusiveMinimum: 0 },
    housingArea: { type: "number", minimum: 0 },
    commercialArea: { type: "number", minimum: 0 },
  },
  required: ["totalArea", "housingArea", "commercialArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    housingShare: { type: "number" },
    commercialShare: { type: "number" },
    otherArea: { type: "number" },
  },
  required: ["housingShare", "commercialShare", "otherArea"],
} as const;
/** Calculate mixed use floor share balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalArea, housingArea, commercialArea } = request;
  const compute = (): Output => {
    H.positive(totalArea);
    H.domain(
      housingArea >= 0 &&
        commercialArea >= 0 &&
        housingArea + commercialArea <= totalArea,
    );
    return {
      housingShare: housingArea / totalArea,
      commercialShare: commercialArea / totalArea,
      otherArea: totalArea - housingArea - commercialArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalArea: 1000, housingArea: 600, commercialArea: 300 },
  output: { housingShare: 0.6, commercialShare: 0.3, otherArea: 100 },
} satisfies ToolExample<Input, Output>;
export const mixedUseFloorShareBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-planning/mixed-use-floor-share-balance",
    title: "Mixed Use Floor Share Balance Tool",
    description:
      "Calculate mixed use floor share balance from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalArea: { type: "number", exclusiveMinimum: 0 },
        housingArea: { type: "number", minimum: 0 },
        commercialArea: { type: "number", minimum: 0 },
      },
      required: ["totalArea", "housingArea", "commercialArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        housingShare: { type: "number" },
        commercialShare: { type: "number" },
        otherArea: { type: "number" },
      },
      required: ["housingShare", "commercialShare", "otherArea"],
    },
    ports: {
      inputs: [
        {
          id: "totalArea",
          label: "Total Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "housingArea",
          label: "Housing Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "commercialArea",
          label: "Commercial Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "housingShare",
          label: "Housing Share",
          valueType: { type: "number" },
        },
        {
          id: "commercialShare",
          label: "Commercial Share",
          valueType: { type: "number" },
        },
        { id: "otherArea", label: "Other Area", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = mixedUseFloorShareBalanceTool.execute;
export default mixedUseFloorShareBalanceTool;
