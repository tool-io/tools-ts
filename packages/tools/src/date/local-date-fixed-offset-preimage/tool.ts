import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly localDate: string;
  readonly offsetMinutes: number;
};
export type Output = {
  readonly lowerUtc: string;
  readonly upperUtcExclusive: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    localDate: { type: "string", maxLength: 8192 },
    offsetMinutes: { type: "integer", minimum: -1439, maximum: 1439 },
  },
  required: ["localDate", "offsetMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerUtc: { type: "string", maxLength: 8192 },
    upperUtcExclusive: { type: "string", maxLength: 8192 },
  },
  required: ["lowerUtc", "upperUtcExclusive"],
} as const;
/** Calculate local date fixed offset preimage from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { localDate, offsetMinutes } = input;
  const compute = (): Output => {
    H.integer(offsetMinutes, -1439, 1439);
    const start = H.dateOnly(localDate).getTime() - offsetMinutes * 60000;
    return {
      lowerUtc: new Date(start).toISOString(),
      upperUtcExclusive: new Date(start + 86400000).toISOString(),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { localDate: "2026-10-26", offsetMinutes: 120 },
  output: {
    lowerUtc: "2026-10-25T22:00:00.000Z",
    upperUtcExclusive: "2026-10-26T22:00:00.000Z",
  },
} satisfies ToolExample<Input, Output>;
export const localDateFixedOffsetPreimageTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "date/local-date-fixed-offset-preimage",
    title: "Local Date Fixed Offset Preimage Tool",
    description:
      "Calculate local date fixed offset preimage from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        localDate: { type: "string", maxLength: 8192 },
        offsetMinutes: { type: "integer", minimum: -1439, maximum: 1439 },
      },
      required: ["localDate", "offsetMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerUtc: { type: "string", maxLength: 8192 },
        upperUtcExclusive: { type: "string", maxLength: 8192 },
      },
      required: ["lowerUtc", "upperUtcExclusive"],
    },
    ports: {
      inputs: [
        {
          id: "localDate",
          label: "Local Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "offsetMinutes",
          label: "Offset Minutes",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "lowerUtc", label: "Lower Utc", valueType: { type: "string" } },
        {
          id: "upperUtcExclusive",
          label: "Upper Utc Exclusive",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = localDateFixedOffsetPreimageTool.execute;
export default localDateFixedOffsetPreimageTool;
