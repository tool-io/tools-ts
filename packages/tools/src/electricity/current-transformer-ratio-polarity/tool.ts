import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly secondaryAmperes: number;
  readonly primaryTurns: number;
  readonly secondaryTurns: number;
  readonly reversedPolarity: boolean;
};
export type Output = { readonly primaryReferenceAmperes: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    secondaryAmperes: { type: "number" },
    primaryTurns: { type: "integer", minimum: 1 },
    secondaryTurns: { type: "integer", minimum: 1 },
    reversedPolarity: { type: "boolean" },
  },
  required: [
    "secondaryAmperes",
    "primaryTurns",
    "secondaryTurns",
    "reversedPolarity",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { primaryReferenceAmperes: { type: "number" } },
  required: ["primaryReferenceAmperes"],
} as const;
/** Apply an ideal explicit current-transformer turns ratio and supplied reference polarity without sizing or operating a transformer. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { secondaryAmperes, primaryTurns, secondaryTurns, reversedPolarity } =
    request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(primaryTurns) &&
        primaryTurns >= 1 &&
        primaryTurns <= Number.MAX_SAFE_INTEGER,
      "primaryTurns",
    ),
      primaryTurns);
    (H.domain(
      Number.isSafeInteger(secondaryTurns) &&
        secondaryTurns >= 1 &&
        secondaryTurns <= Number.MAX_SAFE_INTEGER,
      "secondaryTurns",
    ),
      secondaryTurns);
    return {
      primaryReferenceAmperes:
        secondaryAmperes *
        (secondaryTurns / primaryTurns) *
        (reversedPolarity ? -1 : 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    secondaryAmperes: 5,
    primaryTurns: 1,
    secondaryTurns: 100,
    reversedPolarity: false,
  },
  output: { primaryReferenceAmperes: 500 },
} satisfies ToolExample<Input, Output>;
export const currentTransformerRatioPolarityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["electricity", "engineering"],
      keywords: ["electricity", "engineering"],
    },
    id: "electricity/current-transformer-ratio-polarity",
    title: "Current Transformer Ratio Polarity",
    description:
      "Apply an ideal explicit current-transformer turns ratio and supplied reference polarity without sizing or operating a transformer.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        secondaryAmperes: { type: "number" },
        primaryTurns: { type: "integer", minimum: 1 },
        secondaryTurns: { type: "integer", minimum: 1 },
        reversedPolarity: { type: "boolean" },
      },
      required: [
        "secondaryAmperes",
        "primaryTurns",
        "secondaryTurns",
        "reversedPolarity",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { primaryReferenceAmperes: { type: "number" } },
      required: ["primaryReferenceAmperes"],
    },
    ports: {
      inputs: [
        {
          id: "secondaryAmperes",
          label: "Secondary Amperes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "primaryTurns",
          label: "Primary Turns",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondaryTurns",
          label: "Secondary Turns",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "reversedPolarity",
          label: "Reversed Polarity",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "primaryReferenceAmperes",
          label: "Primary Reference Amperes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = currentTransformerRatioPolarityTool.execute;
export default currentTransformerRatioPolarityTool;
