import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly responseObserved: boolean;
  readonly testedLevelDb: number;
  readonly levelReference: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    responseObserved: { type: "boolean" },
    testedLevelDb: { type: "number" },
    levelReference: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["responseObserved", "testedLevelDb", "levelReference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Distinguish a recorded no-response observation from a measured threshold without assigning a hearing-loss category. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { responseObserved, testedLevelDb, levelReference } = request;
  const compute = (): Output => {
    H.domain(levelReference.length > 0, "levelReference");
    return {
      label:
        (responseObserved ? "response at " : "no response at ") +
        testedLevelDb +
        " dB " +
        levelReference,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { responseObserved: false, testedLevelDb: 90, levelReference: "HL" },
  output: { label: "no response at 90 dB HL" },
} satisfies ToolExample<Input, Output>;
export const hearingTestNoresponseMarkerTool = H.defineSchemaCalculation<
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
    id: "audiology/hearing-test-no-response-marker",
    title: "Hearing Test No Response Marker",
    description:
      "Distinguish a recorded no-response observation from a measured threshold without assigning a hearing-loss category.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        responseObserved: { type: "boolean" },
        testedLevelDb: { type: "number" },
        levelReference: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["responseObserved", "testedLevelDb", "levelReference"],
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
          id: "responseObserved",
          label: "Response Observed",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "testedLevelDb",
          label: "Tested Level Db",
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
export const run = hearingTestNoresponseMarkerTool.execute;
export default hearingTestNoresponseMarkerTool;
