import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstRunLength: number;
  readonly secondRunLength: number;
  readonly sameValue: boolean;
};
export type Output = {
  readonly combinedLength: number;
  readonly resultingRunCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstRunLength: { type: "integer", minimum: 0 },
    secondRunLength: { type: "integer", minimum: 0 },
    sameValue: { type: "boolean" },
  },
  required: ["firstRunLength", "secondRunLength", "sameValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    combinedLength: { type: "integer" },
    resultingRunCount: { type: "integer" },
  },
  required: ["combinedLength", "resultingRunCount"],
} as const;
/** Count resulting runs when two explicit constant-value runs are concatenated, accounting for empty runs and equality. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstRunLength, secondRunLength, sameValue } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(firstRunLength) &&
        firstRunLength >= 0 &&
        firstRunLength <= Number.MAX_SAFE_INTEGER,
      "firstRunLength",
    ),
      firstRunLength);
    (H.domain(
      Number.isSafeInteger(secondRunLength) &&
        secondRunLength >= 0 &&
        secondRunLength <= Number.MAX_SAFE_INTEGER,
      "secondRunLength",
    ),
      secondRunLength);
    return {
      combinedLength: Number(BigInt(firstRunLength) + BigInt(secondRunLength)),
      resultingRunCount:
        firstRunLength === 0
          ? secondRunLength === 0
            ? 0
            : 1
          : secondRunLength === 0
            ? 1
            : sameValue
              ? 1
              : 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstRunLength: 3, secondRunLength: 4, sameValue: true },
  output: { combinedLength: 7, resultingRunCount: 1 },
} satisfies ToolExample<Input, Output>;
export const sequenceTwoRunBoundaryCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["sequence", "mathematics"],
      keywords: ["sequence", "mathematics"],
    },
    id: "sequence/sequence-two-run-boundary-count",
    title: "Sequence Two Run Boundary Count",
    description:
      "Count resulting runs when two explicit constant-value runs are concatenated, accounting for empty runs and equality.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstRunLength: { type: "integer", minimum: 0 },
        secondRunLength: { type: "integer", minimum: 0 },
        sameValue: { type: "boolean" },
      },
      required: ["firstRunLength", "secondRunLength", "sameValue"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        combinedLength: { type: "integer" },
        resultingRunCount: { type: "integer" },
      },
      required: ["combinedLength", "resultingRunCount"],
    },
    ports: {
      inputs: [
        {
          id: "firstRunLength",
          label: "First Run Length",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondRunLength",
          label: "Second Run Length",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sameValue",
          label: "Same Value",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "combinedLength",
          label: "Combined Length",
          valueType: { type: "integer" },
        },
        {
          id: "resultingRunCount",
          label: "Resulting Run Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = sequenceTwoRunBoundaryCountTool.execute;
export default sequenceTwoRunBoundaryCountTool;
