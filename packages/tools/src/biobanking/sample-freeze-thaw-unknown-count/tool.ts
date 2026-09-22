import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly knownEvents: number;
  readonly uncertainEvents: number;
  readonly upperKnown: boolean;
  readonly suppliedUnobservedUpper: number;
};
export type Output = {
  readonly minimumEvents: number;
  readonly maximumEvents: number;
  readonly maximumKnown: boolean;
  readonly uncertainRecords: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    knownEvents: { type: "integer", minimum: 0 },
    uncertainEvents: { type: "integer", minimum: 0 },
    upperKnown: { type: "boolean" },
    suppliedUnobservedUpper: { type: "integer" },
  },
  required: [
    "knownEvents",
    "uncertainEvents",
    "upperKnown",
    "suppliedUnobservedUpper",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minimumEvents: { type: "integer" },
    maximumEvents: { type: "integer" },
    maximumKnown: { type: "boolean" },
    uncertainRecords: { type: "integer" },
  },
  required: [
    "minimumEvents",
    "maximumEvents",
    "maximumKnown",
    "uncertainRecords",
  ],
} as const;
/** Represent supplied freeze/thaw event uncertainty as a lower bound and a known-or-unbounded upper endpoint; flagged zero is not an event count. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { knownEvents, uncertainEvents, upperKnown, suppliedUnobservedUpper } =
    request;
  const compute = (): Output => {
    H.integer(knownEvents, 0);
    H.integer(uncertainEvents, 0);
    H.integer(suppliedUnobservedUpper, uncertainEvents);
    return {
      uncertainRecords: uncertainEvents,
      minimumEvents: knownEvents,
      maximumEvents: upperKnown ? knownEvents + suppliedUnobservedUpper : 0,
      maximumKnown: upperKnown,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    knownEvents: 2,
    uncertainEvents: 1,
    upperKnown: true,
    suppliedUnobservedUpper: 3,
  },
  output: {
    minimumEvents: 2,
    maximumEvents: 5,
    maximumKnown: true,
    uncertainRecords: 1,
  },
} satisfies ToolExample<Input, Output>;
export const sampleFreezeThawUnknownCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biobanking/sample-freeze-thaw-unknown-count",
    title: "Sample Freeze Thaw Unknown Count Tool",
    description:
      "Represent supplied freeze/thaw event uncertainty as a lower bound and a known-or-unbounded upper endpoint; flagged zero is not an event count.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        knownEvents: { type: "integer", minimum: 0 },
        uncertainEvents: { type: "integer", minimum: 0 },
        upperKnown: { type: "boolean" },
        suppliedUnobservedUpper: { type: "integer" },
      },
      required: [
        "knownEvents",
        "uncertainEvents",
        "upperKnown",
        "suppliedUnobservedUpper",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        minimumEvents: { type: "integer" },
        maximumEvents: { type: "integer" },
        maximumKnown: { type: "boolean" },
        uncertainRecords: { type: "integer" },
      },
      required: [
        "minimumEvents",
        "maximumEvents",
        "maximumKnown",
        "uncertainRecords",
      ],
    },
    ports: {
      inputs: [
        {
          id: "knownEvents",
          label: "Known Events",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "uncertainEvents",
          label: "Uncertain Events",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "upperKnown",
          label: "Upper Known",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "suppliedUnobservedUpper",
          label: "Supplied Unobserved Upper",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "minimumEvents",
          label: "Minimum Events",
          valueType: { type: "integer" },
        },
        {
          id: "maximumEvents",
          label: "Maximum Events",
          valueType: { type: "integer" },
        },
        {
          id: "maximumKnown",
          label: "Maximum Known",
          valueType: { type: "boolean" },
        },
        {
          id: "uncertainRecords",
          label: "Uncertain Records",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = sampleFreezeThawUnknownCountTool.execute;
export default sampleFreezeThawUnknownCountTool;
