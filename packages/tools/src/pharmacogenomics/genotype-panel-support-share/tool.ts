import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredLoci: readonly string[];
  readonly calledLoci: readonly string[];
  readonly referenceMatchedLoci: readonly string[];
};
export type Output = {
  readonly required: number;
  readonly called: number;
  readonly supported: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredLoci: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    calledLoci: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    referenceMatchedLoci: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["requiredLoci", "calledLoci", "referenceMatchedLoci"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    required: { type: "integer" },
    called: { type: "integer" },
    supported: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["required", "called", "supported", "share", "defined"],
} as const;
/** Count supplied locus-call and reference-matching support without phenotype or medication recommendations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredLoci, calledLoci, referenceMatchedLoci } = request;
  const compute = (): Output => {
    return (() => {
      const req = [...new Set(requiredLoci)],
        called = req.filter((x) => calledLoci.includes(x)).length,
        supported = req.filter(
          (x) => calledLoci.includes(x) && referenceMatchedLoci.includes(x),
        ).length;
      return {
        required: req.length,
        called,
        supported,
        share: req.length ? supported / req.length : 0,
        defined: req.length > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    requiredLoci: ["a", "b"],
    calledLoci: ["a", "b"],
    referenceMatchedLoci: ["a"],
  },
  output: { required: 2, called: 2, supported: 1, share: 0.5, defined: true },
} satisfies ToolExample<Input, Output>;
export const genotypePanelSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacogenomics/genotype-panel-support-share",
    title: "Genotype Panel Support Share Tool",
    description:
      "Count supplied locus-call and reference-matching support without phenotype or medication recommendations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredLoci: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        calledLoci: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        referenceMatchedLoci: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["requiredLoci", "calledLoci", "referenceMatchedLoci"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        required: { type: "integer" },
        called: { type: "integer" },
        supported: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["required", "called", "supported", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "requiredLoci",
          label: "Required Loci",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "calledLoci",
          label: "Called Loci",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "referenceMatchedLoci",
          label: "Reference Matched Loci",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "required", label: "Required", valueType: { type: "integer" } },
        { id: "called", label: "Called", valueType: { type: "integer" } },
        { id: "supported", label: "Supported", valueType: { type: "integer" } },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = genotypePanelSupportShareTool.execute;
export default genotypePanelSupportShareTool;
