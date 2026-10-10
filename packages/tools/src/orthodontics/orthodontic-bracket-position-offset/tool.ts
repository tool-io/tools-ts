import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedPosition: number;
  readonly referencePosition: number;
  readonly positiveDirectionSign: number;
};
export type Output = { readonly referencedOffset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedPosition: { type: "number" },
    referencePosition: { type: "number" },
    positiveDirectionSign: { type: "number" },
  },
  required: ["recordedPosition", "referencePosition", "positiveDirectionSign"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { referencedOffset: { type: "number" } },
  required: ["referencedOffset"],
} as const;
/** Reference an explicit bracket-position measurement under a supplied axis sign without choosing placement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedPosition, referencePosition, positiveDirectionSign } =
    request;
  const compute = (): Output => {
    H.domain(
      positiveDirectionSign === 1 || positiveDirectionSign === -1,
      "positiveDirectionSign",
    );
    return {
      referencedOffset:
        (recordedPosition - referencePosition) * positiveDirectionSign,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordedPosition: 4,
    referencePosition: 3,
    positiveDirectionSign: 1,
  },
  output: { referencedOffset: 1 },
} satisfies ToolExample<Input, Output>;
export const orthodonticBracketPositionOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["orthodontics", "health and medicine"],
      keywords: ["orthodontics", "health and medicine"],
    },
    id: "orthodontics/orthodontic-bracket-position-offset",
    title: "Orthodontic Bracket Position Offset",
    description:
      "Reference an explicit bracket-position measurement under a supplied axis sign without choosing placement.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedPosition: { type: "number" },
        referencePosition: { type: "number" },
        positiveDirectionSign: { type: "number" },
      },
      required: [
        "recordedPosition",
        "referencePosition",
        "positiveDirectionSign",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { referencedOffset: { type: "number" } },
      required: ["referencedOffset"],
    },
    ports: {
      inputs: [
        {
          id: "recordedPosition",
          label: "Recorded Position",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referencePosition",
          label: "Reference Position",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "positiveDirectionSign",
          label: "Positive Direction Sign",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "referencedOffset",
          label: "Referenced Offset",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = orthodonticBracketPositionOffsetTool.execute;
export default orthodonticBracketPositionOffsetTool;
