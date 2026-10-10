import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly placeWording: string;
  readonly suppliedIdentifier: string;
  readonly identifierCertain: boolean;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    placeWording: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedIdentifier: { type: "string", maxLength: 8192, minLength: 1 },
    identifierCertain: { type: "boolean" },
  },
  required: ["placeWording", "suppliedIdentifier", "identifierCertain"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Display explicit historical-place wording and a supplied identifier uncertainty flag without resolving the place. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { placeWording, suppliedIdentifier, identifierCertain } = request;
  const compute = (): Output => {
    H.domain(
      placeWording.length > 0 && suppliedIdentifier.length > 0,
      "placeWording",
    );
    return {
      label:
        placeWording +
        " [" +
        suppliedIdentifier +
        (identifierCertain ? "" : "?") +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    placeWording: "Place A",
    suppliedIdentifier: "ID17",
    identifierCertain: false,
  },
  output: { label: "Place A [ID17?]" },
} satisfies ToolExample<Input, Output>;
export const historicalPlaceUncertainIdDisplayTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["history", "humanities"],
      keywords: ["history", "humanities"],
    },
    id: "history/historical-place-uncertain-id-display",
    title: "Historical Place Uncertain ID Display",
    description:
      "Display explicit historical-place wording and a supplied identifier uncertainty flag without resolving the place.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        placeWording: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedIdentifier: { type: "string", maxLength: 8192, minLength: 1 },
        identifierCertain: { type: "boolean" },
      },
      required: ["placeWording", "suppliedIdentifier", "identifierCertain"],
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
          id: "placeWording",
          label: "Place Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedIdentifier",
          label: "Supplied Identifier",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "identifierCertain",
          label: "Identifier Certain",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = historicalPlaceUncertainIdDisplayTool.execute;
export default historicalPlaceUncertainIdDisplayTool;
