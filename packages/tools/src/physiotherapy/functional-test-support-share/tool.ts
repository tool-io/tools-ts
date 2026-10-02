import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly taskWeights: readonly number[];
  readonly attempted: readonly boolean[];
  readonly validProtocol: readonly boolean[];
  readonly completeRecord: readonly boolean[];
};
export type Output = {
  readonly attemptedWeight: number;
  readonly supportedWeight: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    taskWeights: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    attempted: { type: "array", maxItems: 256, items: { type: "boolean" } },
    validProtocol: { type: "array", maxItems: 256, items: { type: "boolean" } },
    completeRecord: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: ["taskWeights", "attempted", "validProtocol", "completeRecord"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    attemptedWeight: { type: "number" },
    supportedWeight: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["attemptedWeight", "supportedWeight", "share", "defined"],
} as const;
/** Calculate functional test support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { taskWeights, attempted, validProtocol, completeRecord } = request;
  const compute = (): Output => {
    H.sameLength(taskWeights, attempted);
    H.sameLength(taskWeights, validProtocol);
    H.sameLength(taskWeights, completeRecord);
    H.domain(taskWeights.every((x) => x >= 0));
    return (() => {
      const attemptedWeight = taskWeights.reduce(
          (s, x, i) => s + (attempted[i] ? x : 0),
          0,
        ),
        supportedWeight = taskWeights.reduce(
          (s, x, i) =>
            s + (attempted[i] && validProtocol[i] && completeRecord[i] ? x : 0),
          0,
        );
      return {
        attemptedWeight,
        supportedWeight,
        share: attemptedWeight > 0 ? supportedWeight / attemptedWeight : 0,
        defined: attemptedWeight > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    taskWeights: [2, 3, 5],
    attempted: [true, true, false],
    validProtocol: [true, true, true],
    completeRecord: [true, false, true],
  },
  output: { attemptedWeight: 5, supportedWeight: 2, share: 0.4, defined: true },
} satisfies ToolExample<Input, Output>;
export const functionalTestSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physiotherapy/functional-test-support-share",
    title: "Functional Test Support Share Tool",
    description:
      "Calculate functional test support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        taskWeights: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        attempted: { type: "array", maxItems: 256, items: { type: "boolean" } },
        validProtocol: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        completeRecord: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["taskWeights", "attempted", "validProtocol", "completeRecord"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        attemptedWeight: { type: "number" },
        supportedWeight: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["attemptedWeight", "supportedWeight", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "taskWeights",
          label: "Task Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "attempted",
          label: "Attempted",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "validProtocol",
          label: "Valid Protocol",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "completeRecord",
          label: "Complete Record",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "attemptedWeight",
          label: "Attempted Weight",
          valueType: { type: "number" },
        },
        {
          id: "supportedWeight",
          label: "Supported Weight",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = functionalTestSupportShareTool.execute;
export default functionalTestSupportShareTool;
