import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly printedStanza: number;
  readonly pickupStanzas: number;
  readonly includePickup: boolean;
};
export type Output = { readonly sequenceIndex: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    printedStanza: { type: "integer", minimum: 0 },
    pickupStanzas: { type: "integer", minimum: 0 },
    includePickup: { type: "boolean" },
  },
  required: ["printedStanza", "pickupStanzas", "includePickup"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sequenceIndex: { type: "integer" } },
  required: ["sequenceIndex"],
} as const;
/** Shift a supplied stanza index under an explicit pickup-count convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { printedStanza, pickupStanzas, includePickup } = request;
  const compute = (): Output => {
    H.integer(printedStanza, 0);
    H.integer(pickupStanzas, 0);
    return {
      sequenceIndex: printedStanza + (includePickup ? pickupStanzas : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { printedStanza: 3, pickupStanzas: 1, includePickup: true },
  output: { sequenceIndex: 4 },
} satisfies ToolExample<Input, Output>;
export const publicSongStanzaPickupTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "american-studies/public-song-stanza-pickup",
    title: "Public Song Stanza Pickup Tool",
    description:
      "Shift a supplied stanza index under an explicit pickup-count convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        printedStanza: { type: "integer", minimum: 0 },
        pickupStanzas: { type: "integer", minimum: 0 },
        includePickup: { type: "boolean" },
      },
      required: ["printedStanza", "pickupStanzas", "includePickup"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { sequenceIndex: { type: "integer" } },
      required: ["sequenceIndex"],
    },
    ports: {
      inputs: [
        {
          id: "printedStanza",
          label: "Printed Stanza",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "pickupStanzas",
          label: "Pickup Stanzas",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includePickup",
          label: "Include Pickup",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "sequenceIndex",
          label: "Sequence Index",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicSongStanzaPickupTool.execute;
export default publicSongStanzaPickupTool;
