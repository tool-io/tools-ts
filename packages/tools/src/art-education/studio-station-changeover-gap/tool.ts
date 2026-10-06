import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousSessionEnd: number;
  readonly nextSessionStart: number;
  readonly requiredResetDuration: number;
};
export type Output = {
  readonly availableDuration: number;
  readonly margin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousSessionEnd: { type: "number" },
    nextSessionStart: { type: "number" },
    requiredResetDuration: { type: "number", minimum: 0 },
  },
  required: ["previousSessionEnd", "nextSessionStart", "requiredResetDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableDuration: { type: "number" },
    margin: { type: "number" },
  },
  required: ["availableDuration", "margin"],
} as const;
/** Compare the signed gap between studio sessions with an explicit reset duration on a shared timeline. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousSessionEnd, nextSessionStart, requiredResetDuration } =
    request;
  const compute = (): Output => {
    H.domain(requiredResetDuration >= 0, "requiredResetDuration");
    return {
      availableDuration: nextSessionStart - previousSessionEnd,
      margin: nextSessionStart - previousSessionEnd - requiredResetDuration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    previousSessionEnd: 60,
    nextSessionStart: 75,
    requiredResetDuration: 10,
  },
  output: { availableDuration: 15, margin: 5 },
} satisfies ToolExample<Input, Output>;
export const studioStationChangeoverGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["art-education", "art education", "education"],
      keywords: ["art education", "education"],
    },
    id: "art-education/studio-station-changeover-gap",
    title: "Studio Station Changeover Gap",
    description:
      "Compare the signed gap between studio sessions with an explicit reset duration on a shared timeline.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousSessionEnd: { type: "number" },
        nextSessionStart: { type: "number" },
        requiredResetDuration: { type: "number", minimum: 0 },
      },
      required: [
        "previousSessionEnd",
        "nextSessionStart",
        "requiredResetDuration",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableDuration: { type: "number" },
        margin: { type: "number" },
      },
      required: ["availableDuration", "margin"],
    },
    ports: {
      inputs: [
        {
          id: "previousSessionEnd",
          label: "Previous Session End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nextSessionStart",
          label: "Next Session Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "requiredResetDuration",
          label: "Required Reset Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "availableDuration",
          label: "Available Duration",
          valueType: { type: "number" },
        },
        { id: "margin", label: "Margin", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = studioStationChangeoverGapTool.execute;
export default studioStationChangeoverGapTool;
