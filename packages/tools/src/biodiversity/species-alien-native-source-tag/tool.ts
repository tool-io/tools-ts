import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly taxonId: string;
  readonly regionId: string;
  readonly suppliedStatus: string;
  readonly sourceId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    taxonId: { type: "string", maxLength: 8192, minLength: 1 },
    regionId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedStatus: { type: "string", maxLength: 8192, minLength: 1 },
    sourceId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["taxonId", "regionId", "suppliedStatus", "sourceId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record a supplied regional species-status assertion and its source without determining nativity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { taxonId, regionId, suppliedStatus, sourceId } = request;
  const compute = (): Output => {
    H.domain(taxonId.length > 0, "taxonId");
    H.domain(regionId.length > 0, "regionId");
    H.domain(suppliedStatus.length > 0, "suppliedStatus");
    H.domain(sourceId.length > 0, "sourceId");
    return {
      token: JSON.stringify([taxonId, regionId, suppliedStatus, sourceId]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    taxonId: "T17",
    regionId: "R4",
    suppliedStatus: "native",
    sourceId: "S2",
  },
  output: { token: '["T17","R4","native","S2"]' },
} satisfies ToolExample<Input, Output>;
export const speciesAlienNativeSourceTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biodiversity", "biology"],
      keywords: ["biodiversity", "biology"],
    },
    id: "biodiversity/species-alien-native-source-tag",
    title: "Species Alien Native Source Tag",
    description:
      "Record a supplied regional species-status assertion and its source without determining nativity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        taxonId: { type: "string", maxLength: 8192, minLength: 1 },
        regionId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedStatus: { type: "string", maxLength: 8192, minLength: 1 },
        sourceId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["taxonId", "regionId", "suppliedStatus", "sourceId"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "taxonId",
          label: "Taxon Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "regionId",
          label: "Region Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedStatus",
          label: "Supplied Status",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceId",
          label: "Source Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = speciesAlienNativeSourceTagTool.execute;
export default speciesAlienNativeSourceTagTool;
