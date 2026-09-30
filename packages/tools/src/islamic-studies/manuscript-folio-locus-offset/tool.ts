import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly folio: number;
  readonly recto: boolean;
  readonly referenceFolio: number;
  readonly referenceRecto: boolean;
};
export type Output = { readonly halfLeafOffset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    folio: { type: "integer", minimum: 1 },
    recto: { type: "boolean" },
    referenceFolio: { type: "integer", minimum: 1 },
    referenceRecto: { type: "boolean" },
  },
  required: ["folio", "recto", "referenceFolio", "referenceRecto"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { halfLeafOffset: { type: "number" } },
  required: ["halfLeafOffset"],
} as const;
/** Calculate manuscript folio locus offset from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { folio, recto, referenceFolio, referenceRecto } = request;
  const compute = (): Output => {
    H.integer(folio, 1);
    H.integer(referenceFolio, 1);
    return {
      halfLeafOffset:
        Number(BigInt(folio) - BigInt(referenceFolio)) +
        (recto ? 0 : 0.5) -
        (referenceRecto ? 0 : 0.5),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { folio: 12, recto: false, referenceFolio: 10, referenceRecto: true },
  output: { halfLeafOffset: 2.5 },
} satisfies ToolExample<Input, Output>;
export const manuscriptFolioLocusOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "islamic-studies/manuscript-folio-locus-offset",
    title: "Manuscript Folio Locus Offset Tool",
    description:
      "Calculate manuscript folio locus offset from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        folio: { type: "integer", minimum: 1 },
        recto: { type: "boolean" },
        referenceFolio: { type: "integer", minimum: 1 },
        referenceRecto: { type: "boolean" },
      },
      required: ["folio", "recto", "referenceFolio", "referenceRecto"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { halfLeafOffset: { type: "number" } },
      required: ["halfLeafOffset"],
    },
    ports: {
      inputs: [
        {
          id: "folio",
          label: "Folio",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "recto",
          label: "Recto",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "referenceFolio",
          label: "Reference Folio",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "referenceRecto",
          label: "Reference Recto",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "halfLeafOffset",
          label: "Half Leaf Offset",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = manuscriptFolioLocusOffsetTool.execute;
export default manuscriptFolioLocusOffsetTool;
