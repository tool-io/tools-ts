import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly folio: number;
  readonly verso: boolean;
  readonly firstFolio: number;
  readonly firstRectoImage: number;
};
export type Output = { readonly image: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    folio: { type: "integer", minimum: 1 },
    verso: { type: "boolean" },
    firstFolio: { type: "integer", minimum: 1 },
    firstRectoImage: { type: "integer", minimum: 0 },
  },
  required: ["folio", "verso", "firstFolio", "firstRectoImage"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { image: { type: "integer" } },
  required: ["image"],
} as const;
/** Calculate public archive folio image offset from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { folio, verso, firstFolio, firstRectoImage } = request;
  const compute = (): Output => {
    H.integer(folio, 1);
    H.integer(firstFolio, 1);
    H.integer(firstRectoImage, 0);
    H.domain(firstRectoImage + 2 * (folio - firstFolio) + (verso ? 1 : 0) >= 0);
    return {
      image: firstRectoImage + 2 * (folio - firstFolio) + (verso ? 1 : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { folio: 12, verso: true, firstFolio: 10, firstRectoImage: 5 },
  output: { image: 10 },
} satisfies ToolExample<Input, Output>;
export const publicArchiveFolioImageOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "digital-humanities/public-archive-folio-image-offset",
    title: "Public Archive Folio Image Offset Tool",
    description:
      "Calculate public archive folio image offset from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        folio: { type: "integer", minimum: 1 },
        verso: { type: "boolean" },
        firstFolio: { type: "integer", minimum: 1 },
        firstRectoImage: { type: "integer", minimum: 0 },
      },
      required: ["folio", "verso", "firstFolio", "firstRectoImage"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { image: { type: "integer" } },
      required: ["image"],
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
          id: "verso",
          label: "Verso",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "firstFolio",
          label: "First Folio",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "firstRectoImage",
          label: "First Recto Image",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "image", label: "Image", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = publicArchiveFolioImageOffsetTool.execute;
export default publicArchiveFolioImageOffsetTool;
