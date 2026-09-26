import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly counter: number;
  readonly previousCounter: number;
  readonly reset: boolean;
  readonly modulus: number;
  readonly suppliedCapacity: number;
};
export type Output = {
  readonly elapsed: number;
  readonly remaining: number;
  readonly due: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    counter: { type: "integer", minimum: 0 },
    previousCounter: { type: "integer", minimum: 0 },
    reset: { type: "boolean" },
    modulus: { type: "integer", minimum: 1 },
    suppliedCapacity: { type: "integer", minimum: 0 },
  },
  required: [
    "counter",
    "previousCounter",
    "reset",
    "modulus",
    "suppliedCapacity",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsed: { type: "integer" },
    remaining: { type: "integer" },
    due: { type: "boolean" },
  },
  required: ["elapsed", "remaining", "due"],
} as const;
/** Audit an explicit single counter rollover against a supplied volume capacity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { counter, previousCounter, reset, modulus, suppliedCapacity } =
    request;
  const compute = (): Output => {
    H.integer(modulus, 1);
    H.integer(counter, 0, modulus - 1);
    H.integer(previousCounter, 0, modulus - 1);
    H.integer(suppliedCapacity, 0);
    H.domain(reset || counter >= previousCounter);
    return {
      elapsed: reset
        ? counter + modulus - previousCounter
        : counter - previousCounter,
      remaining:
        suppliedCapacity -
        (reset
          ? counter + modulus - previousCounter
          : counter - previousCounter),
      due:
        (reset
          ? counter + modulus - previousCounter
          : counter - previousCounter) >= suppliedCapacity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    counter: 20,
    previousCounter: 980,
    reset: true,
    modulus: 1000,
    suppliedCapacity: 50,
  },
  output: { elapsed: 40, remaining: 10, due: false },
} satisfies ToolExample<Input, Output>;
export const waterFilterReplacementCounterRemainderTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "environmental-health/water-filter-replacement-counter-remainder",
      title: "Water Filter Replacement Counter Remainder Tool",
      description:
        "Audit an explicit single counter rollover against a supplied volume capacity.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          counter: { type: "integer", minimum: 0 },
          previousCounter: { type: "integer", minimum: 0 },
          reset: { type: "boolean" },
          modulus: { type: "integer", minimum: 1 },
          suppliedCapacity: { type: "integer", minimum: 0 },
        },
        required: [
          "counter",
          "previousCounter",
          "reset",
          "modulus",
          "suppliedCapacity",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          elapsed: { type: "integer" },
          remaining: { type: "integer" },
          due: { type: "boolean" },
        },
        required: ["elapsed", "remaining", "due"],
      },
      ports: {
        inputs: [
          {
            id: "counter",
            label: "Counter",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "previousCounter",
            label: "Previous Counter",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "reset",
            label: "Reset",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "modulus",
            label: "Modulus",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "suppliedCapacity",
            label: "Supplied Capacity",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "elapsed", label: "Elapsed", valueType: { type: "integer" } },
          {
            id: "remaining",
            label: "Remaining",
            valueType: { type: "integer" },
          },
          { id: "due", label: "Due", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = waterFilterReplacementCounterRemainderTool.execute;
export default waterFilterReplacementCounterRemainderTool;
