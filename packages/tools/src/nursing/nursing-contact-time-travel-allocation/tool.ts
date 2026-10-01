import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly contactMinutes: number;
  readonly travelMinutes: number;
  readonly documentationMinutes: number;
  readonly sharedTravelFraction: number;
};
export type Output = {
  readonly directMinutes: number;
  readonly allocatedTravel: number;
  readonly totalAllocated: number;
  readonly directShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contactMinutes: { type: "number", minimum: 0 },
    travelMinutes: { type: "number", minimum: 0 },
    documentationMinutes: { type: "number", minimum: 0 },
    sharedTravelFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "contactMinutes",
    "travelMinutes",
    "documentationMinutes",
    "sharedTravelFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    directMinutes: { type: "number" },
    allocatedTravel: { type: "number" },
    totalAllocated: { type: "number" },
    directShare: { type: "number" },
  },
  required: [
    "directMinutes",
    "allocatedTravel",
    "totalAllocated",
    "directShare",
  ],
} as const;
/** Calculate nursing contact time travel allocation from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    contactMinutes,
    travelMinutes,
    documentationMinutes,
    sharedTravelFraction,
  } = request;
  const compute = (): Output => {
    H.domain(
      contactMinutes >= 0 &&
        travelMinutes >= 0 &&
        documentationMinutes >= 0 &&
        contactMinutes +
          travelMinutes * sharedTravelFraction +
          documentationMinutes >
          0,
    );
    H.probability(sharedTravelFraction);
    return {
      directMinutes: contactMinutes,
      allocatedTravel: travelMinutes * sharedTravelFraction,
      totalAllocated:
        contactMinutes +
        travelMinutes * sharedTravelFraction +
        documentationMinutes,
      directShare:
        contactMinutes /
        (contactMinutes +
          travelMinutes * sharedTravelFraction +
          documentationMinutes),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    contactMinutes: 30,
    travelMinutes: 20,
    documentationMinutes: 10,
    sharedTravelFraction: 0.5,
  },
  output: {
    directMinutes: 30,
    allocatedTravel: 10,
    totalAllocated: 50,
    directShare: 0.6,
  },
} satisfies ToolExample<Input, Output>;
export const nursingContactTimeTravelAllocationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nursing/nursing-contact-time-travel-allocation",
    title: "Nursing Contact Time Travel Allocation Tool",
    description:
      "Calculate nursing contact time travel allocation from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contactMinutes: { type: "number", minimum: 0 },
        travelMinutes: { type: "number", minimum: 0 },
        documentationMinutes: { type: "number", minimum: 0 },
        sharedTravelFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "contactMinutes",
        "travelMinutes",
        "documentationMinutes",
        "sharedTravelFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        directMinutes: { type: "number" },
        allocatedTravel: { type: "number" },
        totalAllocated: { type: "number" },
        directShare: { type: "number" },
      },
      required: [
        "directMinutes",
        "allocatedTravel",
        "totalAllocated",
        "directShare",
      ],
    },
    ports: {
      inputs: [
        {
          id: "contactMinutes",
          label: "Contact Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "travelMinutes",
          label: "Travel Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "documentationMinutes",
          label: "Documentation Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sharedTravelFraction",
          label: "Shared Travel Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "directMinutes",
          label: "Direct Minutes",
          valueType: { type: "number" },
        },
        {
          id: "allocatedTravel",
          label: "Allocated Travel",
          valueType: { type: "number" },
        },
        {
          id: "totalAllocated",
          label: "Total Allocated",
          valueType: { type: "number" },
        },
        {
          id: "directShare",
          label: "Direct Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = nursingContactTimeTravelAllocationTool.execute;
export default nursingContactTimeTravelAllocationTool;
