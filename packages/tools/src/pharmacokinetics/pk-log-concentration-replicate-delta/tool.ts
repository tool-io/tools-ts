import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly first: number; readonly second: number };
export type Output = {
  readonly logDifference: number;
  readonly geometricMean: number;
  readonly ratio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "number", exclusiveMinimum: 0 },
    second: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["first", "second"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    logDifference: { type: "number" },
    geometricMean: { type: "number" },
    ratio: { type: "number" },
  },
  required: ["logDifference", "geometricMean", "ratio"],
} as const;
/** Calculate pk log concentration replicate delta from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second } = request;
  const compute = (): Output => {
    H.positive(first);
    H.positive(second);
    return {
      logDifference: Math.log(second) - Math.log(first),
      geometricMean: Math.exp((Math.log(first) + Math.log(second)) / 2),
      ratio: second / first,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: 2, second: 8 },
  output: { logDifference: 1.3862943611198904, geometricMean: 4, ratio: 4 },
} satisfies ToolExample<Input, Output>;
export const pkLogConcentrationReplicateDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacokinetics/pk-log-concentration-replicate-delta",
    title: "PK Log Concentration Replicate Delta Tool",
    description:
      "Calculate pk log concentration replicate delta from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "number", exclusiveMinimum: 0 },
        second: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["first", "second"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        logDifference: { type: "number" },
        geometricMean: { type: "number" },
        ratio: { type: "number" },
      },
      required: ["logDifference", "geometricMean", "ratio"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "logDifference",
          label: "Log Difference",
          valueType: { type: "number" },
        },
        {
          id: "geometricMean",
          label: "Geometric Mean",
          valueType: { type: "number" },
        },
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = pkLogConcentrationReplicateDeltaTool.execute;
export default pkLogConcentrationReplicateDeltaTool;
