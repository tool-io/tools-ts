import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly boxIds: readonly string[];
  readonly locationIds: readonly string[];
  readonly verifiedLocations: readonly string[];
  readonly manifestPresent: readonly boolean[];
};
export type Output = {
  readonly boxes: number;
  readonly supportedBoxes: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    boxIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    locationIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    verifiedLocations: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    manifestPresent: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: ["boxIds", "locationIds", "verifiedLocations", "manifestPresent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    boxes: { type: "integer" },
    supportedBoxes: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["boxes", "supportedBoxes", "share", "defined"],
} as const;
/** Calculate archive location support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { boxIds, locationIds, verifiedLocations, manifestPresent } = request;
  const compute = (): Output => {
    H.sameLength(boxIds, locationIds);
    H.sameLength(boxIds, manifestPresent);
    return (() => {
      const a = new Set(boxIds),
        b = new Set(
          boxIds.filter(
            (x, i) =>
              locationIds[i].length > 0 &&
              verifiedLocations.includes(locationIds[i]) &&
              manifestPresent[i],
          ),
        );
      return {
        boxes: a.size,
        supportedBoxes: b.size,
        share: a.size ? b.size / a.size : 0,
        defined: a.size > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    boxIds: ["b1", "b2"],
    locationIds: ["L1", "L2"],
    verifiedLocations: ["L1"],
    manifestPresent: [true, true],
  },
  output: { boxes: 2, supportedBoxes: 1, share: 0.5, defined: true },
} satisfies ToolExample<Input, Output>;
export const archiveLocationSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "glp/archive-location-support-share",
    title: "Archive Location Support Share Tool",
    description:
      "Calculate archive location support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        boxIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        locationIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        verifiedLocations: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        manifestPresent: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: [
        "boxIds",
        "locationIds",
        "verifiedLocations",
        "manifestPresent",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        boxes: { type: "integer" },
        supportedBoxes: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["boxes", "supportedBoxes", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "boxIds",
          label: "Box Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "locationIds",
          label: "Location Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "verifiedLocations",
          label: "Verified Locations",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "manifestPresent",
          label: "Manifest Present",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        { id: "boxes", label: "Boxes", valueType: { type: "integer" } },
        {
          id: "supportedBoxes",
          label: "Supported Boxes",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = archiveLocationSupportShareTool.execute;
export default archiveLocationSupportShareTool;
