import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly signal: number;
  readonly suppliedThreshold: number;
  readonly equalityIsContact: boolean;
  readonly higherIsContact: boolean;
};
export type Output = { readonly contactUnderRule: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signal: { type: "number" },
    suppliedThreshold: { type: "number" },
    equalityIsContact: { type: "boolean" },
    higherIsContact: { type: "boolean" },
  },
  required: [
    "signal",
    "suppliedThreshold",
    "equalityIsContact",
    "higherIsContact",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { contactUnderRule: { type: "boolean" } },
  required: ["contactUnderRule"],
} as const;
/** Evaluate an explicit bench image-signal threshold rule without selecting a clinical contact criterion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { signal, suppliedThreshold, equalityIsContact, higherIsContact } =
    request;
  const compute = (): Output => {
    const signed = (signal - suppliedThreshold) * (higherIsContact ? 1 : -1);
    return {
      contactUnderRule: signed > 0 || (signed === 0 && equalityIsContact),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    signal: 5,
    suppliedThreshold: 5,
    equalityIsContact: true,
    higherIsContact: true,
  },
  output: { contactUnderRule: true },
} satisfies ToolExample<Input, Output>;
export const occlusalFilmContactThresholdTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "prosthodontics/occlusal-film-contact-threshold-token",
    title: "Occlusal Film Contact Threshold Token Tool",
    description:
      "Evaluate an explicit bench image-signal threshold rule without selecting a clinical contact criterion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signal: { type: "number" },
        suppliedThreshold: { type: "number" },
        equalityIsContact: { type: "boolean" },
        higherIsContact: { type: "boolean" },
      },
      required: [
        "signal",
        "suppliedThreshold",
        "equalityIsContact",
        "higherIsContact",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { contactUnderRule: { type: "boolean" } },
      required: ["contactUnderRule"],
    },
    ports: {
      inputs: [
        {
          id: "signal",
          label: "Signal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedThreshold",
          label: "Supplied Threshold",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "equalityIsContact",
          label: "Equality Is Contact",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "higherIsContact",
          label: "Higher Is Contact",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "contactUnderRule",
          label: "Contact Under Rule",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = occlusalFilmContactThresholdTokenTool.execute;
export default occlusalFilmContactThresholdTokenTool;
