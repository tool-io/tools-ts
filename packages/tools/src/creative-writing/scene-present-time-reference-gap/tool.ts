import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventTime: number;
  readonly scenePresent: number;
  readonly narrativeReference: number;
};
export type Output = {
  readonly eventFromPresent: number;
  readonly presentFromReference: number;
  readonly eventFromReference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventTime: { type: "number" },
    scenePresent: { type: "number" },
    narrativeReference: { type: "number" },
  },
  required: ["eventTime", "scenePresent", "narrativeReference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventFromPresent: { type: "number" },
    presentFromReference: { type: "number" },
    eventFromReference: { type: "number" },
  },
  required: ["eventFromPresent", "presentFromReference", "eventFromReference"],
} as const;
/** Calculate scene present time reference gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventTime, scenePresent, narrativeReference } = request;
  const compute = (): Output => {
    return {
      eventFromPresent: eventTime - scenePresent,
      presentFromReference: scenePresent - narrativeReference,
      eventFromReference: eventTime - narrativeReference,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eventTime: 15, scenePresent: 10, narrativeReference: 2 },
  output: {
    eventFromPresent: 5,
    presentFromReference: 8,
    eventFromReference: 13,
  },
} satisfies ToolExample<Input, Output>;
export const scenePresentTimeReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "creative-writing/scene-present-time-reference-gap",
    title: "Scene Present Time Reference Gap Tool",
    description:
      "Calculate scene present time reference gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventTime: { type: "number" },
        scenePresent: { type: "number" },
        narrativeReference: { type: "number" },
      },
      required: ["eventTime", "scenePresent", "narrativeReference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventFromPresent: { type: "number" },
        presentFromReference: { type: "number" },
        eventFromReference: { type: "number" },
      },
      required: [
        "eventFromPresent",
        "presentFromReference",
        "eventFromReference",
      ],
    },
    ports: {
      inputs: [
        {
          id: "eventTime",
          label: "Event Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scenePresent",
          label: "Scene Present",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "narrativeReference",
          label: "Narrative Reference",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "eventFromPresent",
          label: "Event From Present",
          valueType: { type: "number" },
        },
        {
          id: "presentFromReference",
          label: "Present From Reference",
          valueType: { type: "number" },
        },
        {
          id: "eventFromReference",
          label: "Event From Reference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = scenePresentTimeReferenceGapTool.execute;
export default scenePresentTimeReferenceGapTool;
