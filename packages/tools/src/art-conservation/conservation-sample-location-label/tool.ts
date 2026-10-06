import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly objectId: string;
  readonly surface: string;
  readonly locationNote: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    objectId: { type: "string", maxLength: 8192, minLength: 1 },
    surface: { type: "string", maxLength: 8192, minLength: 1 },
    locationNote: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["objectId", "surface", "locationNote"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label a caller-recorded conservation sample location without inferring sampling authorization or object composition. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { objectId, surface, locationNote } = request;
  const compute = (): Output => {
    H.domain(
      objectId.length > 0 && surface.length > 0 && locationNote.length > 0,
      "objectId",
    );
    return { label: objectId + "; " + surface + ": " + locationNote };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { objectId: "O17", surface: "verso", locationNote: "upper-left edge" },
  output: { label: "O17; verso: upper-left edge" },
} satisfies ToolExample<Input, Output>;
export const conservationSampleLocationLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["art-conservation", "art conservation", "arts and design"],
      keywords: ["art conservation", "arts and design"],
    },
    id: "art-conservation/conservation-sample-location-label",
    title: "Conservation Sample Location Label",
    description:
      "Label a caller-recorded conservation sample location without inferring sampling authorization or object composition.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        objectId: { type: "string", maxLength: 8192, minLength: 1 },
        surface: { type: "string", maxLength: 8192, minLength: 1 },
        locationNote: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["objectId", "surface", "locationNote"],
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
          id: "objectId",
          label: "Object Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "surface",
          label: "Surface",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "locationNote",
          label: "Location Note",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = conservationSampleLocationLabelTool.execute;
export default conservationSampleLocationLabelTool;
