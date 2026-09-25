import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly isNull: readonly boolean[];
  readonly startIndex: number;
};
export type Output = {
  readonly runLength: number;
  readonly endExclusive: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    isNull: { type: "array", maxItems: 256, items: { type: "boolean" } },
    startIndex: { type: "integer", minimum: 0 },
  },
  required: ["isNull", "startIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    runLength: { type: "integer" },
    endExclusive: { type: "integer" },
  },
  required: ["runLength", "endExclusive"],
} as const;
/** Count one consecutive run in a supplied null mask without treating false, zero or empty string as null. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { isNull, startIndex } = request;
  const compute = (): Output => {
    H.integer(startIndex, 0, isNull.length);
    let endExclusive = startIndex;
    while (endExclusive < isNull.length && isNull[endExclusive]) endExclusive++;
    return { runLength: endExclusive - startIndex, endExclusive };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { isNull: [false, true, true, false], startIndex: 1 },
  output: { runLength: 2, endExclusive: 3 },
} satisfies ToolExample<Input, Output>;
export const featureNullRunLengthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "data-science/feature-null-run-length",
    title: "Feature Null Run Length Tool",
    description:
      "Count one consecutive run in a supplied null mask without treating false, zero or empty string as null.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        isNull: { type: "array", maxItems: 256, items: { type: "boolean" } },
        startIndex: { type: "integer", minimum: 0 },
      },
      required: ["isNull", "startIndex"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        runLength: { type: "integer" },
        endExclusive: { type: "integer" },
      },
      required: ["runLength", "endExclusive"],
    },
    ports: {
      inputs: [
        {
          id: "isNull",
          label: "Is Null",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "startIndex",
          label: "Start Index",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "runLength",
          label: "Run Length",
          valueType: { type: "integer" },
        },
        {
          id: "endExclusive",
          label: "End Exclusive",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = featureNullRunLengthTool.execute;
export default featureNullRunLengthTool;
