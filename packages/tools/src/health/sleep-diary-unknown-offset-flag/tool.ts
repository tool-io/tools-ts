import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startOffsetKnown: boolean;
  readonly endOffsetKnown: boolean;
  readonly sameClockAssertion: boolean;
};
export type Output = {
  readonly elapsedComparable: boolean;
  readonly missingEndpoints: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startOffsetKnown: { type: "boolean" },
    endOffsetKnown: { type: "boolean" },
    sameClockAssertion: { type: "boolean" },
  },
  required: ["startOffsetKnown", "endOffsetKnown", "sameClockAssertion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsedComparable: { type: "boolean" },
    missingEndpoints: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["elapsedComparable", "missingEndpoints"],
} as const;
/** Report whether supplied diary clock metadata supports comparing endpoint elapsed time. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startOffsetKnown, endOffsetKnown, sameClockAssertion } = request;
  const compute = (): Output => {
    return {
      elapsedComparable:
        (startOffsetKnown && endOffsetKnown) || sameClockAssertion,
      missingEndpoints: [
        ...(!startOffsetKnown ? ["start"] : []),
        ...(!endOffsetKnown ? ["end"] : []),
      ],
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    startOffsetKnown: false,
    endOffsetKnown: true,
    sameClockAssertion: false,
  },
  output: { elapsedComparable: false, missingEndpoints: ["start"] },
} satisfies ToolExample<Input, Output>;
export const sleepDiaryUnknownOffsetFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health/sleep-diary-unknown-offset-flag",
    title: "Sleep Diary Unknown Offset Flag Tool",
    description:
      "Report whether supplied diary clock metadata supports comparing endpoint elapsed time.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startOffsetKnown: { type: "boolean" },
        endOffsetKnown: { type: "boolean" },
        sameClockAssertion: { type: "boolean" },
      },
      required: ["startOffsetKnown", "endOffsetKnown", "sameClockAssertion"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsedComparable: { type: "boolean" },
        missingEndpoints: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["elapsedComparable", "missingEndpoints"],
    },
    ports: {
      inputs: [
        {
          id: "startOffsetKnown",
          label: "Start Offset Known",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "endOffsetKnown",
          label: "End Offset Known",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "sameClockAssertion",
          label: "Same Clock Assertion",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "elapsedComparable",
          label: "Elapsed Comparable",
          valueType: { type: "boolean" },
        },
        {
          id: "missingEndpoints",
          label: "Missing Endpoints",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = sleepDiaryUnknownOffsetFlagTool.execute;
export default sleepDiaryUnknownOffsetFlagTool;
