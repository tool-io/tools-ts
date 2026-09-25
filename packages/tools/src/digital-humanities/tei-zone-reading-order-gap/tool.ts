import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly zoneIds: readonly string[];
  readonly referencedOrder: readonly string[];
};
export type Output = {
  readonly missingReferences: readonly string[];
  readonly unreferencedZones: readonly string[];
  readonly duplicateReferences: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    zoneIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    referencedOrder: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["zoneIds", "referencedOrder"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    missingReferences: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    unreferencedZones: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    duplicateReferences: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["missingReferences", "unreferencedZones", "duplicateReferences"],
} as const;
/** Audit exact supplied TEI zone references without parsing an XML document or inferring reading order. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { zoneIds, referencedOrder } = request;
  const compute = (): Output => {
    H.domain(new Set(zoneIds).size === zoneIds.length);
    return {
      missingReferences: [
        ...new Set(referencedOrder.filter((x) => !zoneIds.includes(x))),
      ],
      unreferencedZones: zoneIds.filter((x) => !referencedOrder.includes(x)),
      duplicateReferences: [
        ...new Set(
          referencedOrder.filter((x, i) => referencedOrder.indexOf(x) !== i),
        ),
      ],
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { zoneIds: ["z1", "z2"], referencedOrder: ["z1", "z3", "z1"] },
  output: {
    missingReferences: ["z3"],
    unreferencedZones: ["z2"],
    duplicateReferences: ["z1"],
  },
} satisfies ToolExample<Input, Output>;
export const teiZoneReadingOrderGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "digital-humanities/tei-zone-reading-order-gap",
    title: "TEI Zone Reading Order Gap Tool",
    description:
      "Audit exact supplied TEI zone references without parsing an XML document or inferring reading order.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        zoneIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        referencedOrder: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["zoneIds", "referencedOrder"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        missingReferences: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        unreferencedZones: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        duplicateReferences: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: [
        "missingReferences",
        "unreferencedZones",
        "duplicateReferences",
      ],
    },
    ports: {
      inputs: [
        {
          id: "zoneIds",
          label: "Zone Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "referencedOrder",
          label: "Referenced Order",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "missingReferences",
          label: "Missing References",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "unreferencedZones",
          label: "Unreferenced Zones",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "duplicateReferences",
          label: "Duplicate References",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = teiZoneReadingOrderGapTool.execute;
export default teiZoneReadingOrderGapTool;
