import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pageArea: number;
  readonly holeAreas: readonly number[];
  readonly overlappingHoleArea: number;
};
export type Output = {
  readonly usableArea: number;
  readonly holeUnion: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pageArea: { type: "number", minimum: 0 },
    holeAreas: { type: "array", maxItems: 256, items: { type: "number" } },
    overlappingHoleArea: { type: "number", minimum: 0 },
  },
  required: ["pageArea", "holeAreas", "overlappingHoleArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { usableArea: { type: "number" }, holeUnion: { type: "number" } },
  required: ["usableArea", "holeUnion"],
} as const;
/** Calculate palm leaf page hole exclusion from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pageArea, holeAreas, overlappingHoleArea } = request;
  const compute = (): Output => {
    H.domain(
      pageArea >= 0 &&
        holeAreas.every((x) => x >= 0) &&
        overlappingHoleArea >= 0 &&
        overlappingHoleArea <= holeAreas.reduce((a, b) => a + b, 0) &&
        holeAreas.reduce((a, b) => a + b, 0) - overlappingHoleArea <= pageArea,
    );
    return {
      usableArea:
        pageArea - holeAreas.reduce((a, b) => a + b, 0) + overlappingHoleArea,
      holeUnion: holeAreas.reduce((a, b) => a + b, 0) - overlappingHoleArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pageArea: 100, holeAreas: [2, 3], overlappingHoleArea: 0 },
  output: { usableArea: 95, holeUnion: 5 },
} satisfies ToolExample<Input, Output>;
export const palmLeafPageHoleExclusionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "asian-studies/palm-leaf-page-hole-exclusion",
    title: "Palm Leaf Page Hole Exclusion Tool",
    description:
      "Calculate palm leaf page hole exclusion from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pageArea: { type: "number", minimum: 0 },
        holeAreas: { type: "array", maxItems: 256, items: { type: "number" } },
        overlappingHoleArea: { type: "number", minimum: 0 },
      },
      required: ["pageArea", "holeAreas", "overlappingHoleArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        usableArea: { type: "number" },
        holeUnion: { type: "number" },
      },
      required: ["usableArea", "holeUnion"],
    },
    ports: {
      inputs: [
        {
          id: "pageArea",
          label: "Page Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "holeAreas",
          label: "Hole Areas",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "overlappingHoleArea",
          label: "Overlapping Hole Area",
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
        { id: "holeUnion", label: "Hole Union", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = palmLeafPageHoleExclusionTool.execute;
export default palmLeafPageHoleExclusionTool;
