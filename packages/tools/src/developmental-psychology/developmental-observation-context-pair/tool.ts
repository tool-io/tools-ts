import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstContext: string;
  readonly secondContext: string;
  readonly firstObserver: string;
  readonly secondObserver: string;
};
export type Output = {
  readonly sameContext: boolean;
  readonly sameObserver: boolean;
  readonly bothMatched: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstContext: { type: "string", maxLength: 8192 },
    secondContext: { type: "string", maxLength: 8192 },
    firstObserver: { type: "string", maxLength: 8192 },
    secondObserver: { type: "string", maxLength: 8192 },
  },
  required: [
    "firstContext",
    "secondContext",
    "firstObserver",
    "secondObserver",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sameContext: { type: "boolean" },
    sameObserver: { type: "boolean" },
    bothMatched: { type: "boolean" },
  },
  required: ["sameContext", "sameObserver", "bothMatched"],
} as const;
/** Calculate developmental observation context pair from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstContext, secondContext, firstObserver, secondObserver } =
    request;
  const compute = (): Output => {
    H.domain(
      firstContext.length > 0 &&
        secondContext.length > 0 &&
        firstObserver.length > 0 &&
        secondObserver.length > 0,
    );
    return {
      sameContext: firstContext === secondContext,
      sameObserver: firstObserver === secondObserver,
      bothMatched:
        firstContext === secondContext && firstObserver === secondObserver,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstContext: "home",
    secondContext: "school",
    firstObserver: "A",
    secondObserver: "A",
  },
  output: { sameContext: false, sameObserver: true, bothMatched: false },
} satisfies ToolExample<Input, Output>;
export const developmentalObservationContextPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "developmental-psychology/developmental-observation-context-pair",
      title: "Developmental Observation Context Pair Tool",
      description:
        "Calculate developmental observation context pair from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstContext: { type: "string", maxLength: 8192 },
          secondContext: { type: "string", maxLength: 8192 },
          firstObserver: { type: "string", maxLength: 8192 },
          secondObserver: { type: "string", maxLength: 8192 },
        },
        required: [
          "firstContext",
          "secondContext",
          "firstObserver",
          "secondObserver",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sameContext: { type: "boolean" },
          sameObserver: { type: "boolean" },
          bothMatched: { type: "boolean" },
        },
        required: ["sameContext", "sameObserver", "bothMatched"],
      },
      ports: {
        inputs: [
          {
            id: "firstContext",
            label: "First Context",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "secondContext",
            label: "Second Context",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "firstObserver",
            label: "First Observer",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "secondObserver",
            label: "Second Observer",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "sameContext",
            label: "Same Context",
            valueType: { type: "boolean" },
          },
          {
            id: "sameObserver",
            label: "Same Observer",
            valueType: { type: "boolean" },
          },
          {
            id: "bothMatched",
            label: "Both Matched",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = developmentalObservationContextPairTool.execute;
export default developmentalObservationContextPairTool;
