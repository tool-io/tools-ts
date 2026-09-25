import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly second: number;
  readonly millisecond: number;
  readonly tiePolicy: string;
};
export type Output = {
  readonly roundedSecond: number;
  readonly carriesMinute: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    second: { type: "integer", minimum: 0, maximum: 59 },
    millisecond: { type: "integer", minimum: 0, maximum: 999 },
    tiePolicy: { type: "string", maxLength: 8192, enum: ["up", "even"] },
  },
  required: ["second", "millisecond", "tiePolicy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    roundedSecond: { type: "integer" },
    carriesMinute: { type: "boolean" },
  },
  required: ["roundedSecond", "carriesMinute"],
} as const;
/** Round a non-leap civil second to the nearest second using an explicit half-tie policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { second, millisecond, tiePolicy } = request;
  const compute = (): Output => {
    H.integer(second, 0, 59);
    H.integer(millisecond, 0, 999);
    H.domain(["up", "even"].includes(tiePolicy));
    return {
      roundedSecond:
        (millisecond > 500 ||
        (millisecond === 500 && (tiePolicy === "up" || second % 2 !== 0))
          ? second + 1
          : second) % 60,
      carriesMinute:
        second === 59 &&
        (millisecond > 500 ||
          (millisecond === 500 && (tiePolicy === "up" || second % 2 !== 0))),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { second: 59, millisecond: 500, tiePolicy: "even" },
  output: { roundedSecond: 0, carriesMinute: true },
} satisfies ToolExample<Input, Output>;
export const civilTimeMillisecondTieCarryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "date/civil-time-millisecond-tie-carry",
    title: "Civil Time Millisecond Tie Carry Tool",
    description:
      "Round a non-leap civil second to the nearest second using an explicit half-tie policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        second: { type: "integer", minimum: 0, maximum: 59 },
        millisecond: { type: "integer", minimum: 0, maximum: 999 },
        tiePolicy: { type: "string", maxLength: 8192, enum: ["up", "even"] },
      },
      required: ["second", "millisecond", "tiePolicy"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        roundedSecond: { type: "integer" },
        carriesMinute: { type: "boolean" },
      },
      required: ["roundedSecond", "carriesMinute"],
    },
    ports: {
      inputs: [
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "millisecond",
          label: "Millisecond",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "tiePolicy",
          label: "Tie Policy",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "roundedSecond",
          label: "Rounded Second",
          valueType: { type: "integer" },
        },
        {
          id: "carriesMinute",
          label: "Carries Minute",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = civilTimeMillisecondTieCarryTool.execute;
export default civilTimeMillisecondTieCarryTool;
