import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleIds: readonly string[];
  readonly locationIds: readonly string[];
  readonly verifiedLocations: readonly string[];
  readonly inventoryCurrent: readonly boolean[];
};
export type Output = {
  readonly samples: number;
  readonly supportedSamples: number;
  readonly unlocatedSamples: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleIds: {
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
    inventoryCurrent: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: [
    "sampleIds",
    "locationIds",
    "verifiedLocations",
    "inventoryCurrent",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    samples: { type: "integer" },
    supportedSamples: { type: "integer" },
    unlocatedSamples: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: [
    "samples",
    "supportedSamples",
    "unlocatedSamples",
    "share",
    "defined",
  ],
} as const;
/** Calculate storage location support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleIds, locationIds, verifiedLocations, inventoryCurrent } =
    request;
  const compute = (): Output => {
    H.sameLength(sampleIds, locationIds);
    H.sameLength(sampleIds, inventoryCurrent);
    return (() => {
      const all = new Set(sampleIds),
        yes = new Set(
          sampleIds.filter(
            (x, i) =>
              locationIds[i].length > 0 &&
              verifiedLocations.includes(locationIds[i]) &&
              inventoryCurrent[i],
          ),
        ),
        located = new Set(
          sampleIds.filter((x, i) => locationIds[i].length > 0),
        );
      return {
        samples: all.size,
        supportedSamples: yes.size,
        unlocatedSamples: all.size - located.size,
        share: all.size ? yes.size / all.size : 0,
        defined: all.size > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampleIds: ["a", "b"],
    locationIds: ["L1", ""],
    verifiedLocations: ["L1"],
    inventoryCurrent: [true, true],
  },
  output: {
    samples: 2,
    supportedSamples: 1,
    unlocatedSamples: 1,
    share: 0.5,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const storageLocationSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biobanking/storage-location-support-share",
    title: "Storage Location Support Share Tool",
    description:
      "Calculate storage location support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleIds: {
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
        inventoryCurrent: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: [
        "sampleIds",
        "locationIds",
        "verifiedLocations",
        "inventoryCurrent",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        samples: { type: "integer" },
        supportedSamples: { type: "integer" },
        unlocatedSamples: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "samples",
        "supportedSamples",
        "unlocatedSamples",
        "share",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "sampleIds",
          label: "Sample Ids",
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
          id: "inventoryCurrent",
          label: "Inventory Current",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        { id: "samples", label: "Samples", valueType: { type: "integer" } },
        {
          id: "supportedSamples",
          label: "Supported Samples",
          valueType: { type: "integer" },
        },
        {
          id: "unlocatedSamples",
          label: "Unlocated Samples",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = storageLocationSupportShareTool.execute;
export default storageLocationSupportShareTool;
