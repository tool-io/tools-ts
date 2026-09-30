import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly source: string;
  readonly eventId: string;
  readonly dayIndex: number;
  readonly minute: number;
  readonly version: number;
};
export type Output = {
  readonly eventKey: string;
  readonly revisionKey: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    source: { type: "string", maxLength: 8192 },
    eventId: { type: "string", maxLength: 8192 },
    dayIndex: { type: "integer" },
    minute: { type: "integer", minimum: 0, maximum: 1439 },
    version: { type: "integer", minimum: 0 },
  },
  required: ["source", "eventId", "dayIndex", "minute", "version"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventKey: { type: "string", maxLength: 8192 },
    revisionKey: { type: "string", maxLength: 8192 },
  },
  required: ["eventKey", "revisionKey"],
} as const;
/** Build separate event and revision keys from supplied birth-record fields. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { source, eventId, dayIndex, minute, version } = request;
  const compute = (): Output => {
    H.integer(minute, 0, 1439);
    H.integer(version, 0);
    H.domain(source.length > 0 && eventId.length > 0);
    return {
      eventKey: JSON.stringify([source, eventId, dayIndex, minute]),
      revisionKey: JSON.stringify([source, eventId, dayIndex, minute, version]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { source: "A", eventId: "E1", dayIndex: 100, minute: 600, version: 2 },
  output: {
    eventKey: '["A","E1",100,600]',
    revisionKey: '["A","E1",100,600,2]',
  },
} satisfies ToolExample<Input, Output>;
export const birthRecordDuplicateEventKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "midwifery/birth-record-duplicate-event-key",
    title: "Birth Record Duplicate Event Key Tool",
    description:
      "Build separate event and revision keys from supplied birth-record fields.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        source: { type: "string", maxLength: 8192 },
        eventId: { type: "string", maxLength: 8192 },
        dayIndex: { type: "integer" },
        minute: { type: "integer", minimum: 0, maximum: 1439 },
        version: { type: "integer", minimum: 0 },
      },
      required: ["source", "eventId", "dayIndex", "minute", "version"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventKey: { type: "string", maxLength: 8192 },
        revisionKey: { type: "string", maxLength: 8192 },
      },
      required: ["eventKey", "revisionKey"],
    },
    ports: {
      inputs: [
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "eventId",
          label: "Event Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "dayIndex",
          label: "Day Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "minute",
          label: "Minute",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "version",
          label: "Version",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "eventKey", label: "Event Key", valueType: { type: "string" } },
        {
          id: "revisionKey",
          label: "Revision Key",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = birthRecordDuplicateEventKeyTool.execute;
export default birthRecordDuplicateEventKeyTool;
