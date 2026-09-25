import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceUnits: number;
  readonly includedUnits: number;
  readonly sourceUnit: string;
  readonly corpusUnit: string;
};
export type Output = { readonly share: number; readonly defined: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceUnits: { type: "integer", minimum: 0 },
    includedUnits: { type: "integer", minimum: 0 },
    sourceUnit: { type: "string", maxLength: 8192 },
    corpusUnit: { type: "string", maxLength: 8192 },
  },
  required: ["sourceUnits", "includedUnits", "sourceUnit", "corpusUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" }, defined: { type: "boolean" } },
  required: ["share", "defined"],
} as const;
/** Measure one source’s included units within an explicitly counted public corpus; no representativeness inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceUnits, includedUnits, sourceUnit, corpusUnit } = request;
  const compute = (): Output => {
    H.integer(includedUnits, 0);
    H.integer(sourceUnits, 0, includedUnits);
    H.domain(sourceUnit.length > 0 && sourceUnit === corpusUnit);
    return {
      share: includedUnits > 0 ? sourceUnits / includedUnits : 0,
      defined: includedUnits > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceUnits: 12,
    includedUnits: 40,
    sourceUnit: "excerpt",
    corpusUnit: "excerpt",
  },
  output: { share: 0.3, defined: true },
} satisfies ToolExample<Input, Output>;
export const publicCorpusSourceShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cultural-studies/public-corpus-source-share",
    title: "Public Corpus Source Share Tool",
    description:
      "Measure one source’s included units within an explicitly counted public corpus; no representativeness inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceUnits: { type: "integer", minimum: 0 },
        includedUnits: { type: "integer", minimum: 0 },
        sourceUnit: { type: "string", maxLength: 8192 },
        corpusUnit: { type: "string", maxLength: 8192 },
      },
      required: ["sourceUnits", "includedUnits", "sourceUnit", "corpusUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" }, defined: { type: "boolean" } },
      required: ["share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "sourceUnits",
          label: "Source Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includedUnits",
          label: "Included Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sourceUnit",
          label: "Source Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "corpusUnit",
          label: "Corpus Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = publicCorpusSourceShareTool.execute;
export default publicCorpusSourceShareTool;
