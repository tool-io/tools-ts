import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AerialSubstrateLayerNoteGeneratorInput = {
  readonly layer: "aerial-mycelium" | "buried-mycelium" | "substrate-interface";
};

export type AerialSubstrateLayerNoteGeneratorOutput = {
  readonly layerNote: string;
};

export const aerialSubstrateLayerNoteGeneratorExample = {
  input: { layer: "aerial-mycelium" },
  output: { layerNote: "Mycelium observed above the substrate surface." },
} satisfies ToolExample<
  AerialSubstrateLayerNoteGeneratorInput,
  AerialSubstrateLayerNoteGeneratorOutput
>;

const LAYER_NOTES: Record<
  AerialSubstrateLayerNoteGeneratorInput["layer"],
  string
> = {
  "aerial-mycelium": "Mycelium observed above the substrate surface.",
  "buried-mycelium": "Mycelium observed within the substrate.",
  "substrate-interface": "Mycelium observed at the substrate-air interface.",
};

export const calculateAerialSubstrateLayerNoteGenerator = (
  input: AerialSubstrateLayerNoteGeneratorInput,
): AerialSubstrateLayerNoteGeneratorOutput => {
  const layerNote = LAYER_NOTES[input.layer];
  if (layerNote === undefined)
    return simpleError(
      "layer",
      "Select a supported culture layer.",
      "invalid_layer",
    );
  return { layerNote };
};

export const aerialSubstrateLayerNoteGeneratorTool = createSimpleTool({
  id: "mycology/aerial-substrate-layer-note-generator",
  title: "Layer Note Generator",
  description:
    "Generate a descriptive note for a recorded culture layer observation.",
  inputs: [
    {
      enum: ["aerial-mycelium", "substrate-interface", "buried-mycelium"],
      id: "layer",
      kind: "string",
      label: "Layer",
    },
  ],
  outputs: [{ id: "layerNote", label: "Layer note", kind: "string" }],
  calculate: (input) =>
    calculateAerialSubstrateLayerNoteGenerator({
      layer: input.layer as AerialSubstrateLayerNoteGeneratorInput["layer"],
    }),
});
export const runAerialSubstrateLayerNoteGenerator =
  aerialSubstrateLayerNoteGeneratorTool.execute;
export default aerialSubstrateLayerNoteGeneratorTool;
