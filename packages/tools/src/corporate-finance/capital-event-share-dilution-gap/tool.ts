import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly heldBefore: number;
  readonly outstandingBefore: number;
  readonly issued: number;
  readonly acquired: number;
  readonly suppliedExpectedOwnership: number;
};
export type Output = {
  readonly ownershipBefore: number;
  readonly ownershipAfter: number;
  readonly dilution: number;
  readonly expectationGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    heldBefore: { type: "number", minimum: 0 },
    outstandingBefore: { type: "number", exclusiveMinimum: 0 },
    issued: { type: "number", minimum: 0 },
    acquired: { type: "number", minimum: 0 },
    suppliedExpectedOwnership: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "heldBefore",
    "outstandingBefore",
    "issued",
    "acquired",
    "suppliedExpectedOwnership",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ownershipBefore: { type: "number" },
    ownershipAfter: { type: "number" },
    dilution: { type: "number" },
    expectationGap: { type: "number" },
  },
  required: ["ownershipBefore", "ownershipAfter", "dilution", "expectationGap"],
} as const;
/** Calculate capital event share dilution gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    heldBefore,
    outstandingBefore,
    issued,
    acquired,
    suppliedExpectedOwnership,
  } = request;
  const compute = (): Output => {
    H.positive(outstandingBefore);
    H.domain(
      heldBefore >= 0 &&
        heldBefore <= outstandingBefore &&
        issued >= 0 &&
        acquired >= 0 &&
        acquired <= issued,
    );
    H.probability(suppliedExpectedOwnership);
    return (() => {
      const ownershipBefore = heldBefore / outstandingBefore,
        ownershipAfter = (heldBefore + acquired) / (outstandingBefore + issued);
      return {
        ownershipBefore,
        ownershipAfter,
        dilution: ownershipBefore - ownershipAfter,
        expectationGap: ownershipAfter - suppliedExpectedOwnership,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    heldBefore: 20,
    outstandingBefore: 100,
    issued: 100,
    acquired: 0,
    suppliedExpectedOwnership: 0.12,
  },
  output: {
    ownershipBefore: 0.2,
    ownershipAfter: 0.1,
    dilution: 0.1,
    expectationGap: -0.01999999999999999,
  },
} satisfies ToolExample<Input, Output>;
export const capitalEventShareDilutionGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "corporate-finance/capital-event-share-dilution-gap",
    title: "Capital Event Share Dilution Gap Tool",
    description:
      "Calculate capital event share dilution gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        heldBefore: { type: "number", minimum: 0 },
        outstandingBefore: { type: "number", exclusiveMinimum: 0 },
        issued: { type: "number", minimum: 0 },
        acquired: { type: "number", minimum: 0 },
        suppliedExpectedOwnership: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "heldBefore",
        "outstandingBefore",
        "issued",
        "acquired",
        "suppliedExpectedOwnership",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ownershipBefore: { type: "number" },
        ownershipAfter: { type: "number" },
        dilution: { type: "number" },
        expectationGap: { type: "number" },
      },
      required: [
        "ownershipBefore",
        "ownershipAfter",
        "dilution",
        "expectationGap",
      ],
    },
    ports: {
      inputs: [
        {
          id: "heldBefore",
          label: "Held Before",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outstandingBefore",
          label: "Outstanding Before",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "issued",
          label: "Issued",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "acquired",
          label: "Acquired",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedExpectedOwnership",
          label: "Supplied Expected Ownership",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "ownershipBefore",
          label: "Ownership Before",
          valueType: { type: "number" },
        },
        {
          id: "ownershipAfter",
          label: "Ownership After",
          valueType: { type: "number" },
        },
        { id: "dilution", label: "Dilution", valueType: { type: "number" } },
        {
          id: "expectationGap",
          label: "Expectation Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = capitalEventShareDilutionGapTool.execute;
export default capitalEventShareDilutionGapTool;
