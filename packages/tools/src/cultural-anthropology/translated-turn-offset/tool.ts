import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceTurn: number;
  readonly sourceAnchor: number;
  readonly translatedAnchor: number;
  readonly suppliedAdditionalOffset: number;
};
export type Output = { readonly translatedTurn: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceTurn: { type: "integer" },
    sourceAnchor: { type: "integer" },
    translatedAnchor: { type: "integer" },
    suppliedAdditionalOffset: { type: "integer" },
  },
  required: [
    "sourceTurn",
    "sourceAnchor",
    "translatedAnchor",
    "suppliedAdditionalOffset",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { translatedTurn: { type: "integer" } },
  required: ["translatedTurn"],
} as const;
/** Apply supplied local transcript-turn alignment anchors without inferring a translation alignment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    sourceTurn,
    sourceAnchor,
    translatedAnchor,
    suppliedAdditionalOffset,
  } = request;
  const compute = (): Output => {
    return {
      translatedTurn:
        sourceTurn - sourceAnchor + translatedAnchor + suppliedAdditionalOffset,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceTurn: 10,
    sourceAnchor: 2,
    translatedAnchor: 4,
    suppliedAdditionalOffset: 1,
  },
  output: { translatedTurn: 13 },
} satisfies ToolExample<Input, Output>;
export const translatedTurnOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cultural-anthropology/translated-turn-offset",
    title: "Translated Turn Offset Tool",
    description:
      "Apply supplied local transcript-turn alignment anchors without inferring a translation alignment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceTurn: { type: "integer" },
        sourceAnchor: { type: "integer" },
        translatedAnchor: { type: "integer" },
        suppliedAdditionalOffset: { type: "integer" },
      },
      required: [
        "sourceTurn",
        "sourceAnchor",
        "translatedAnchor",
        "suppliedAdditionalOffset",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { translatedTurn: { type: "integer" } },
      required: ["translatedTurn"],
    },
    ports: {
      inputs: [
        {
          id: "sourceTurn",
          label: "Source Turn",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sourceAnchor",
          label: "Source Anchor",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "translatedAnchor",
          label: "Translated Anchor",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedAdditionalOffset",
          label: "Supplied Additional Offset",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "translatedTurn",
          label: "Translated Turn",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = translatedTurnOffsetTool.execute;
export default translatedTurnOffsetTool;
