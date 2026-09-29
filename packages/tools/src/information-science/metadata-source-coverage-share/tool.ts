import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredKeys: readonly string[];
  readonly sourceKeys: readonly string[];
  readonly verifiedKeys: readonly string[];
};
export type Output = {
  readonly required: number;
  readonly covered: number;
  readonly verifiedCovered: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredKeys: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    sourceKeys: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    verifiedKeys: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["requiredKeys", "sourceKeys", "verifiedKeys"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    required: { type: "integer" },
    covered: { type: "integer" },
    verifiedCovered: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["required", "covered", "verifiedCovered", "share", "defined"],
} as const;
/** Calculate metadata source coverage share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredKeys, sourceKeys, verifiedKeys } = request;
  const compute = (): Output => {
    return (() => {
      const r = [...new Set(requiredKeys)],
        covered = r.filter((x) => sourceKeys.includes(x)).length,
        verifiedCovered = r.filter(
          (x) => sourceKeys.includes(x) && verifiedKeys.includes(x),
        ).length;
      return {
        required: r.length,
        covered,
        verifiedCovered,
        share: r.length > 0 ? verifiedCovered / r.length : 0,
        defined: r.length > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    requiredKeys: ["a", "b"],
    sourceKeys: ["a", "b"],
    verifiedKeys: ["a"],
  },
  output: {
    required: 2,
    covered: 2,
    verifiedCovered: 1,
    share: 0.5,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const metadataSourceCoverageShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information-science/metadata-source-coverage-share",
    title: "Metadata Source Coverage Share Tool",
    description:
      "Calculate metadata source coverage share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredKeys: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        sourceKeys: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        verifiedKeys: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["requiredKeys", "sourceKeys", "verifiedKeys"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        required: { type: "integer" },
        covered: { type: "integer" },
        verifiedCovered: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["required", "covered", "verifiedCovered", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "requiredKeys",
          label: "Required Keys",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "sourceKeys",
          label: "Source Keys",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "verifiedKeys",
          label: "Verified Keys",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "required", label: "Required", valueType: { type: "integer" } },
        { id: "covered", label: "Covered", valueType: { type: "integer" } },
        {
          id: "verifiedCovered",
          label: "Verified Covered",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = metadataSourceCoverageShareTool.execute;
export default metadataSourceCoverageShareTool;
