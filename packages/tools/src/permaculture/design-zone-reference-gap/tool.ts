import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly elementIds: readonly string[];
  readonly assignedZones: readonly number[];
  readonly suppliedReferenceZones: readonly number[];
};
export type Output = {
  readonly zoneGaps: readonly number[];
  readonly mismatches: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elementIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    assignedZones: { type: "array", maxItems: 256, items: { type: "integer" } },
    suppliedReferenceZones: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["elementIds", "assignedZones", "suppliedReferenceZones"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    zoneGaps: { type: "array", maxItems: 256, items: { type: "integer" } },
    mismatches: { type: "integer" },
  },
  required: ["zoneGaps", "mismatches"],
} as const;
/** Calculate design zone reference gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { elementIds, assignedZones, suppliedReferenceZones } = request;
  const compute = (): Output => {
    H.sameLength(elementIds, assignedZones);
    H.sameLength(elementIds, suppliedReferenceZones);
    H.domain(
      [...assignedZones, ...suppliedReferenceZones].every((x) => x >= 0),
    );
    return (() => {
      const zoneGaps = assignedZones.map(
        (x, i) => x - suppliedReferenceZones[i],
      );
      return { zoneGaps, mismatches: zoneGaps.filter((x) => x !== 0).length };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    elementIds: ["a", "b"],
    assignedZones: [1, 3],
    suppliedReferenceZones: [1, 2],
  },
  output: { zoneGaps: [0, 1], mismatches: 1 },
} satisfies ToolExample<Input, Output>;
export const designZoneReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "permaculture/design-zone-reference-gap",
    title: "Design Zone Reference Gap Tool",
    description:
      "Calculate design zone reference gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elementIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        assignedZones: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        suppliedReferenceZones: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["elementIds", "assignedZones", "suppliedReferenceZones"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        zoneGaps: { type: "array", maxItems: 256, items: { type: "integer" } },
        mismatches: { type: "integer" },
      },
      required: ["zoneGaps", "mismatches"],
    },
    ports: {
      inputs: [
        {
          id: "elementIds",
          label: "Element Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "assignedZones",
          label: "Assigned Zones",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "suppliedReferenceZones",
          label: "Supplied Reference Zones",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "zoneGaps",
          label: "Zone Gaps",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "mismatches",
          label: "Mismatches",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = designZoneReferenceGapTool.execute;
export default designZoneReferenceGapTool;
