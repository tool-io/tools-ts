import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

type ReversePigment =
  "no-pigment" | "red-brown" | "tan" | "violet" | "wine-red" | "yellow";

export const reversePigmentNoteGeneratorExample = {
  input: { pigment: "wine-red" },
  output: { reversePigmentNote: "Reverse pigment: wine-red." },
} satisfies ToolExample<
  { readonly pigment: ReversePigment },
  { readonly reversePigmentNote: string }
>;

export const reversePigmentNoteGeneratorTool = createSimpleTool({
  id: "mycology/trichophyton-reverse-pigment-note-generator",
  title: "Reverse Pigment Note",
  description:
    "Generate a culture note describing the reverse pigment observed on Sabouraud dextrose agar.",
  inputs: [
    {
      enum: ["yellow", "red-brown", "wine-red", "violet", "tan", "no-pigment"],
      id: "pigment",
      kind: "string",
      label: "Pigment",
    },
  ],
  outputs: [
    {
      id: "reversePigmentNote",
      kind: "string",
      label: "Reverse pigment note",
    },
  ],
  calculate: (input) => ({
    reversePigmentNote:
      input.pigment === "no-pigment"
        ? "No reverse pigment on SDA."
        : `Reverse pigment: ${input.pigment as ReversePigment}.`,
  }),
});
export const runReversePigmentNoteGenerator =
  reversePigmentNoteGeneratorTool.execute;
export default reversePigmentNoteGeneratorTool;
