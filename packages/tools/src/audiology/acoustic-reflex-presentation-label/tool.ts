import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly frequencyHz: number;
  readonly presentationSide: string;
  readonly stimulusLevelDb: number;
  readonly levelReference: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frequencyHz: { type: "number", exclusiveMinimum: 0 },
    presentationSide: {
      type: "string",
      maxLength: 8192,
      enum: ["ipsilateral", "contralateral"],
    },
    stimulusLevelDb: { type: "number" },
    levelReference: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: [
    "frequencyHz",
    "presentationSide",
    "stimulusLevelDb",
    "levelReference",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label explicitly recorded acoustic-reflex stimulus metadata without prescribing a stimulus or interpreting a response. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { frequencyHz, presentationSide, stimulusLevelDb, levelReference } =
    request;
  const compute = (): Output => {
    (H.domain(frequencyHz > 0, "frequencyHz"), frequencyHz);
    H.domain(
      ["ipsilateral", "contralateral"].includes(presentationSide),
      "presentationSide",
    );
    H.domain(levelReference.length > 0, "levelReference");
    return {
      label:
        frequencyHz +
        " Hz; " +
        presentationSide +
        "; " +
        stimulusLevelDb +
        " dB " +
        levelReference,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    frequencyHz: 1000,
    presentationSide: "ipsilateral",
    stimulusLevelDb: 80,
    levelReference: "HL",
  },
  output: { label: "1000 Hz; ipsilateral; 80 dB HL" },
} satisfies ToolExample<Input, Output>;
export const acousticReflexPresentationLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["audiology", "health and medicine"],
      keywords: ["audiology", "health and medicine"],
    },
    id: "audiology/acoustic-reflex-presentation-label",
    title: "Acoustic Reflex Presentation Label",
    description:
      "Label explicitly recorded acoustic-reflex stimulus metadata without prescribing a stimulus or interpreting a response.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        frequencyHz: { type: "number", exclusiveMinimum: 0 },
        presentationSide: {
          type: "string",
          maxLength: 8192,
          enum: ["ipsilateral", "contralateral"],
        },
        stimulusLevelDb: { type: "number" },
        levelReference: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: [
        "frequencyHz",
        "presentationSide",
        "stimulusLevelDb",
        "levelReference",
      ],
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
          id: "frequencyHz",
          label: "Frequency Hz",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "presentationSide",
          label: "Presentation Side",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "stimulusLevelDb",
          label: "Stimulus Level Db",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "levelReference",
          label: "Level Reference",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = acousticReflexPresentationLabelTool.execute;
export default acousticReflexPresentationLabelTool;
