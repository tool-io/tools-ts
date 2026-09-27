import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly releaseLocalSeconds: number;
  readonly receiveLocalSeconds: number;
  readonly releaseUtcOffsetSeconds: number;
  readonly receiveUtcOffsetSeconds: number;
};
export type Output = {
  readonly releaseUtcSeconds: number;
  readonly receiveUtcSeconds: number;
  readonly transitSeconds: number;
  readonly ordered: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    releaseLocalSeconds: { type: "number" },
    receiveLocalSeconds: { type: "number" },
    releaseUtcOffsetSeconds: { type: "number" },
    receiveUtcOffsetSeconds: { type: "number" },
  },
  required: [
    "releaseLocalSeconds",
    "receiveLocalSeconds",
    "releaseUtcOffsetSeconds",
    "receiveUtcOffsetSeconds",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    releaseUtcSeconds: { type: "number" },
    receiveUtcSeconds: { type: "number" },
    transitSeconds: { type: "number" },
    ordered: { type: "boolean" },
  },
  required: [
    "releaseUtcSeconds",
    "receiveUtcSeconds",
    "transitSeconds",
    "ordered",
  ],
} as const;
/** Order explicit local-clock epoch-like timestamps after UTC-offset correction; this does not authenticate custody records. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    releaseLocalSeconds,
    receiveLocalSeconds,
    releaseUtcOffsetSeconds,
    receiveUtcOffsetSeconds,
  } = request;
  const compute = (): Output => {
    return {
      releaseUtcSeconds: releaseLocalSeconds - releaseUtcOffsetSeconds,
      receiveUtcSeconds: receiveLocalSeconds - receiveUtcOffsetSeconds,
      transitSeconds:
        receiveLocalSeconds -
        receiveUtcOffsetSeconds -
        releaseLocalSeconds +
        releaseUtcOffsetSeconds,
      ordered:
        receiveLocalSeconds - receiveUtcOffsetSeconds >=
        releaseLocalSeconds - releaseUtcOffsetSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    releaseLocalSeconds: 10000,
    receiveLocalSeconds: 11000,
    releaseUtcOffsetSeconds: 3600,
    receiveUtcOffsetSeconds: 3600,
  },
  output: {
    releaseUtcSeconds: 6400,
    receiveUtcSeconds: 7400,
    transitSeconds: 1000,
    ordered: true,
  },
} satisfies ToolExample<Input, Output>;
export const chainOfCustodyTimezoneOrderCheckTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "forensic-science/chain-of-custody-timezone-order-check",
    title: "Chain Of Custody Timezone Order Check Tool",
    description:
      "Order explicit local-clock epoch-like timestamps after UTC-offset correction; this does not authenticate custody records.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        releaseLocalSeconds: { type: "number" },
        receiveLocalSeconds: { type: "number" },
        releaseUtcOffsetSeconds: { type: "number" },
        receiveUtcOffsetSeconds: { type: "number" },
      },
      required: [
        "releaseLocalSeconds",
        "receiveLocalSeconds",
        "releaseUtcOffsetSeconds",
        "receiveUtcOffsetSeconds",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        releaseUtcSeconds: { type: "number" },
        receiveUtcSeconds: { type: "number" },
        transitSeconds: { type: "number" },
        ordered: { type: "boolean" },
      },
      required: [
        "releaseUtcSeconds",
        "receiveUtcSeconds",
        "transitSeconds",
        "ordered",
      ],
    },
    ports: {
      inputs: [
        {
          id: "releaseLocalSeconds",
          label: "Release Local Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
        {
          id: "receiveLocalSeconds",
          label: "Receive Local Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
        {
          id: "releaseUtcOffsetSeconds",
          label: "Release Utc Offset Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
        {
          id: "receiveUtcOffsetSeconds",
          label: "Receive Utc Offset Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
      ],
      outputs: [
        {
          id: "releaseUtcSeconds",
          label: "Release Utc Seconds",
          valueType: { type: "number", unit: "s" },
        },
        {
          id: "receiveUtcSeconds",
          label: "Receive Utc Seconds",
          valueType: { type: "number", unit: "s" },
        },
        {
          id: "transitSeconds",
          label: "Transit Seconds",
          valueType: { type: "number", unit: "s" },
        },
        { id: "ordered", label: "Ordered", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = chainOfCustodyTimezoneOrderCheckTool.execute;
export default chainOfCustodyTimezoneOrderCheckTool;
