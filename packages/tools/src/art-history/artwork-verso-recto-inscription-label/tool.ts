import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly inscription: string; readonly surface: string };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inscription: { type: "string", maxLength: 8192 },
    surface: { type: "string", maxLength: 8192, enum: ["recto", "verso"] },
  },
  required: ["inscription", "surface"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Attach an explicit recto/verso location to a literal inscription transcription without interpreting authenticity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inscription, surface } = request;
  const compute = (): Output => {
    H.domain(["recto", "verso"].includes(surface), "surface");
    H.domain(inscription.length > 0, "inscription");
    return { label: surface + ": " + inscription };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { inscription: "Signed A.L.", surface: "verso" },
  output: { label: "verso: Signed A.L." },
} satisfies ToolExample<Input, Output>;
export const artworkVersoRectoInscriptionLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-history/artwork-verso-recto-inscription-label",
    title: "Artwork Verso Recto Inscription Label Tool",
    description:
      "Attach an explicit recto/verso location to a literal inscription transcription without interpreting authenticity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inscription: { type: "string", maxLength: 8192 },
        surface: { type: "string", maxLength: 8192, enum: ["recto", "verso"] },
      },
      required: ["inscription", "surface"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "inscription",
          label: "Inscription",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "surface",
          label: "Surface",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = artworkVersoRectoInscriptionLabelTool.execute;
export default artworkVersoRectoInscriptionLabelTool;
