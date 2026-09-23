import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly taxonIds: readonly string[];
  readonly sourceConceptIds: readonly string[];
  readonly acceptedConceptIds: readonly string[];
  readonly currentSource: readonly boolean[];
};
export type Output = {
  readonly taxa: number;
  readonly supportedTaxa: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    taxonIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    sourceConceptIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    acceptedConceptIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    currentSource: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: [
    "taxonIds",
    "sourceConceptIds",
    "acceptedConceptIds",
    "currentSource",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    taxa: { type: "integer" },
    supportedTaxa: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["taxa", "supportedTaxa", "share", "defined"],
} as const;
/** Count explicit source-concept matches; no taxonomy or nomenclatural authority is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { taxonIds, sourceConceptIds, acceptedConceptIds, currentSource } =
    request;
  const compute = (): Output => {
    H.sameLength(taxonIds, sourceConceptIds);
    H.sameLength(taxonIds, currentSource);
    return (() => {
      const all = new Set(taxonIds),
        yes = new Set(
          taxonIds.filter(
            (x, i) =>
              currentSource[i] &&
              acceptedConceptIds.includes(sourceConceptIds[i]),
          ),
        );
      return {
        taxa: all.size,
        supportedTaxa: yes.size,
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
    taxonIds: ["a", "b"],
    sourceConceptIds: ["c1", "c2"],
    acceptedConceptIds: ["c1"],
    currentSource: [true, true],
  },
  output: { taxa: 2, supportedTaxa: 1, share: 0.5, defined: true },
} satisfies ToolExample<Input, Output>;
export const taxonConceptSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosystematics/taxon-concept-support-share",
    title: "Taxon Concept Support Share Tool",
    description:
      "Count explicit source-concept matches; no taxonomy or nomenclatural authority is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        taxonIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        sourceConceptIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        acceptedConceptIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        currentSource: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: [
        "taxonIds",
        "sourceConceptIds",
        "acceptedConceptIds",
        "currentSource",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        taxa: { type: "integer" },
        supportedTaxa: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["taxa", "supportedTaxa", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "taxonIds",
          label: "Taxon Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "sourceConceptIds",
          label: "Source Concept Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "acceptedConceptIds",
          label: "Accepted Concept Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "currentSource",
          label: "Current Source",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        { id: "taxa", label: "Taxa", valueType: { type: "integer" } },
        {
          id: "supportedTaxa",
          label: "Supported Taxa",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = taxonConceptSupportShareTool.execute;
export default taxonConceptSupportShareTool;
