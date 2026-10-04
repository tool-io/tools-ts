import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossArea: number;
  readonly accessArea: number;
  readonly equipmentArea: number;
  readonly overlap: number;
};
export type Output = {
  readonly usableArea: number;
  readonly excludedArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossArea: { type: "number", minimum: 0 },
    accessArea: { type: "number", minimum: 0 },
    equipmentArea: { type: "number", minimum: 0 },
    overlap: { type: "number", minimum: 0 },
  },
  required: ["grossArea", "accessArea", "equipmentArea", "overlap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    usableArea: { type: "number" },
    excludedArea: { type: "number" },
  },
  required: ["usableArea", "excludedArea"],
} as const;
/** Calculate rooftop area exclusion token from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossArea, accessArea, equipmentArea, overlap } = request;
  const compute = (): Output => {
    H.domain(
      grossArea >= 0 &&
        accessArea >= 0 &&
        equipmentArea >= 0 &&
        overlap >= 0 &&
        overlap <= Math.min(accessArea, equipmentArea) &&
        accessArea + equipmentArea - overlap <= grossArea,
    );
    return {
      usableArea: grossArea - accessArea - equipmentArea + overlap,
      excludedArea: accessArea + equipmentArea - overlap,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { grossArea: 100, accessArea: 20, equipmentArea: 10, overlap: 5 },
  output: { usableArea: 75, excludedArea: 25 },
} satisfies ToolExample<Input, Output>;
export const rooftopAreaExclusionTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-agriculture/rooftop-area-exclusion-token",
    title: "Rooftop Area Exclusion Token Tool",
    description:
      "Calculate rooftop area exclusion token from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossArea: { type: "number", minimum: 0 },
        accessArea: { type: "number", minimum: 0 },
        equipmentArea: { type: "number", minimum: 0 },
        overlap: { type: "number", minimum: 0 },
      },
      required: ["grossArea", "accessArea", "equipmentArea", "overlap"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        usableArea: { type: "number" },
        excludedArea: { type: "number" },
      },
      required: ["usableArea", "excludedArea"],
    },
    ports: {
      inputs: [
        {
          id: "grossArea",
          label: "Gross Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "accessArea",
          label: "Access Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "equipmentArea",
          label: "Equipment Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "overlap",
          label: "Overlap",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "usableArea",
          label: "Usable Area",
          valueType: { type: "number" },
        },
        {
          id: "excludedArea",
          label: "Excluded Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rooftopAreaExclusionTokenTool.execute;
export default rooftopAreaExclusionTokenTool;
