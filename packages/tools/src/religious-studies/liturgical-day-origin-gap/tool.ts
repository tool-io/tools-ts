import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventSeconds: number;
  readonly firstOriginSeconds: number;
  readonly secondOriginSeconds: number;
  readonly secondsPerDay: number;
};
export type Output = {
  readonly firstDayDecimal: string;
  readonly secondDayDecimal: string;
  readonly originDayGapDecimal: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventSeconds: { type: "number" },
    firstOriginSeconds: { type: "number" },
    secondOriginSeconds: { type: "number" },
    secondsPerDay: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "eventSeconds",
    "firstOriginSeconds",
    "secondOriginSeconds",
    "secondsPerDay",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstDayDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    secondDayDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    originDayGapDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
  },
  required: ["firstDayDecimal", "secondDayDecimal", "originDayGapDecimal"],
} as const;
/** Compare explicit day-origin conventions without inferring a religious calendar or sunset time. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    eventSeconds,
    firstOriginSeconds,
    secondOriginSeconds,
    secondsPerDay,
  } = request;
  const compute = (): Output => {
    H.positive(secondsPerDay);
    return (() => {
      const a = Math.floor((eventSeconds - firstOriginSeconds) / secondsPerDay),
        b = Math.floor((eventSeconds - secondOriginSeconds) / secondsPerDay);
      H.domain(Number.isSafeInteger(a) && Number.isSafeInteger(b));
      return {
        firstDayDecimal: BigInt(a).toString(),
        secondDayDecimal: BigInt(b).toString(),
        originDayGapDecimal: (BigInt(b) - BigInt(a)).toString(),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    eventSeconds: 100,
    firstOriginSeconds: 0,
    secondOriginSeconds: 50,
    secondsPerDay: 100,
  },
  output: {
    firstDayDecimal: "1",
    secondDayDecimal: "0",
    originDayGapDecimal: "-1",
  },
} satisfies ToolExample<Input, Output>;
export const liturgicalDayOriginGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "religious-studies/liturgical-day-origin-gap",
    title: "Liturgical Day Origin Gap Tool",
    description:
      "Compare explicit day-origin conventions without inferring a religious calendar or sunset time.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventSeconds: { type: "number" },
        firstOriginSeconds: { type: "number" },
        secondOriginSeconds: { type: "number" },
        secondsPerDay: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "eventSeconds",
        "firstOriginSeconds",
        "secondOriginSeconds",
        "secondsPerDay",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstDayDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        secondDayDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        originDayGapDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
      },
      required: ["firstDayDecimal", "secondDayDecimal", "originDayGapDecimal"],
    },
    ports: {
      inputs: [
        {
          id: "eventSeconds",
          label: "Event Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstOriginSeconds",
          label: "First Origin Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondOriginSeconds",
          label: "Second Origin Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondsPerDay",
          label: "Seconds Per Day",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "firstDayDecimal",
          label: "First Day Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "secondDayDecimal",
          label: "Second Day Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "originDayGapDecimal",
          label: "Origin Day Gap Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
      ],
    },
  },
  calculate,
});
export const run = liturgicalDayOriginGapTool.execute;
export default liturgicalDayOriginGapTool;
