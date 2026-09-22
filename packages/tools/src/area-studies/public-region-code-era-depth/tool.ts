import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly regionPath: readonly string[];
  readonly applicableEditions: readonly string[];
  readonly requestedEdition: string;
};
export type Output = {
  readonly depth: number;
  readonly editionSupported: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    regionPath: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    applicableEditions: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    requestedEdition: { type: "string", maxLength: 8192 },
  },
  required: ["regionPath", "applicableEditions", "requestedEdition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    depth: { type: "integer" },
    editionSupported: { type: "boolean" },
  },
  required: ["depth", "editionSupported"],
} as const;
/** Inspect caller-supplied public region hierarchy and edition support without geographic lookup. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { regionPath, applicableEditions, requestedEdition } = request;
  const compute = (): Output => {
    return {
      depth: regionPath.length,
      editionSupported: applicableEditions.includes(requestedEdition),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    regionPath: ["world", "region", "district"],
    applicableEditions: ["2000", "2010"],
    requestedEdition: "2010",
  },
  output: { depth: 3, editionSupported: true },
} satisfies ToolExample<Input, Output>;
export const publicRegionCodeEraDepthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "area-studies/public-region-code-era-depth",
    title: "Public Region Code Era Depth Tool",
    description:
      "Inspect caller-supplied public region hierarchy and edition support without geographic lookup.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        regionPath: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        applicableEditions: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        requestedEdition: { type: "string", maxLength: 8192 },
      },
      required: ["regionPath", "applicableEditions", "requestedEdition"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        depth: { type: "integer" },
        editionSupported: { type: "boolean" },
      },
      required: ["depth", "editionSupported"],
    },
    ports: {
      inputs: [
        {
          id: "regionPath",
          label: "Region Path",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "applicableEditions",
          label: "Applicable Editions",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "requestedEdition",
          label: "Requested Edition",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "depth", label: "Depth", valueType: { type: "integer" } },
        {
          id: "editionSupported",
          label: "Edition Supported",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicRegionCodeEraDepthTool.execute;
export default publicRegionCodeEraDepthTool;
