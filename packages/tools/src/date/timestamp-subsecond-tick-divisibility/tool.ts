import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly nanoseconds: number;
  readonly tickNanoseconds: number;
};
export type Output = { readonly aligned: boolean; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nanoseconds: { type: "integer", minimum: 0, maximum: 999999999 },
    tickNanoseconds: { type: "integer", minimum: 1, maximum: 1000000000 },
  },
  required: ["nanoseconds", "tickNanoseconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { aligned: { type: "boolean" }, remainder: { type: "integer" } },
  required: ["aligned", "remainder"],
} as const;
/** Calculate timestamp subsecond tick divisibility from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { nanoseconds, tickNanoseconds } = input;
  const compute = (): Output => {
    H.integer(nanoseconds, 0, 999999999);
    H.integer(tickNanoseconds, 1, 1000000000);
    return {
      aligned: nanoseconds % tickNanoseconds === 0,
      remainder: nanoseconds % tickNanoseconds,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { nanoseconds: 123456000, tickNanoseconds: 1000 },
  output: { aligned: true, remainder: 0 },
} satisfies ToolExample<Input, Output>;
export const timestampSubsecondTickDivisibilityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "date/timestamp-subsecond-tick-divisibility",
    title: "Timestamp Subsecond Tick Divisibility Tool",
    description:
      "Calculate timestamp subsecond tick divisibility from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nanoseconds: { type: "integer", minimum: 0, maximum: 999999999 },
        tickNanoseconds: { type: "integer", minimum: 1, maximum: 1000000000 },
      },
      required: ["nanoseconds", "tickNanoseconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        aligned: { type: "boolean" },
        remainder: { type: "integer" },
      },
      required: ["aligned", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "nanoseconds",
          label: "Nanoseconds",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "tickNanoseconds",
          label: "Tick Nanoseconds",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "aligned", label: "Aligned", valueType: { type: "boolean" } },
        { id: "remainder", label: "Remainder", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = timestampSubsecondTickDivisibilityTool.execute;
export default timestampSubsecondTickDivisibilityTool;
