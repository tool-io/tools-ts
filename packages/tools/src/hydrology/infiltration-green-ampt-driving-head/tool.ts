import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly suctionHead: number;
  readonly pondingHead: number;
  readonly moistureDeficit: number;
  readonly cumulativeInfiltration: number;
};
export type Output = {
  readonly capacityFactor: number;
  readonly wettingFrontDepth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suctionHead: { type: "number", minimum: 0 },
    pondingHead: { type: "number", minimum: 0 },
    moistureDeficit: { type: "number", exclusiveMinimum: 0, maximum: 1 },
    cumulativeInfiltration: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "suctionHead",
    "pondingHead",
    "moistureDeficit",
    "cumulativeInfiltration",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    capacityFactor: { type: "number" },
    wettingFrontDepth: { type: "number" },
  },
  required: ["capacityFactor", "wettingFrontDepth"],
} as const;
/** Return the ideal Green-Ampt infiltration-capacity multiplier and piston wetting-front depth. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suctionHead, pondingHead, moistureDeficit, cumulativeInfiltration } =
    request;
  const compute = (): Output => {
    H.domain(
      suctionHead >= 0 &&
        pondingHead >= 0 &&
        moistureDeficit > 0 &&
        moistureDeficit <= 1,
    );
    H.positive(cumulativeInfiltration);
    return {
      capacityFactor:
        1 +
        ((suctionHead + pondingHead) * moistureDeficit) /
          cumulativeInfiltration,
      wettingFrontDepth: cumulativeInfiltration / moistureDeficit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    suctionHead: 0.2,
    pondingHead: 0.05,
    moistureDeficit: 0.4,
    cumulativeInfiltration: 0.1,
  },
  output: { capacityFactor: 2, wettingFrontDepth: 0.25 },
} satisfies ToolExample<Input, Output>;
export const infiltrationGreenAmptDrivingHeadTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrology/infiltration-green-ampt-driving-head",
    title: "Infiltration Green Ampt Driving Head Tool",
    description:
      "Return the ideal Green-Ampt infiltration-capacity multiplier and piston wetting-front depth.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suctionHead: { type: "number", minimum: 0 },
        pondingHead: { type: "number", minimum: 0 },
        moistureDeficit: { type: "number", exclusiveMinimum: 0, maximum: 1 },
        cumulativeInfiltration: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "suctionHead",
        "pondingHead",
        "moistureDeficit",
        "cumulativeInfiltration",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        capacityFactor: { type: "number" },
        wettingFrontDepth: { type: "number" },
      },
      required: ["capacityFactor", "wettingFrontDepth"],
    },
    ports: {
      inputs: [
        {
          id: "suctionHead",
          label: "Suction Head",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pondingHead",
          label: "Ponding Head",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "moistureDeficit",
          label: "Moisture Deficit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cumulativeInfiltration",
          label: "Cumulative Infiltration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "capacityFactor",
          label: "Capacity Factor",
          valueType: { type: "number" },
        },
        {
          id: "wettingFrontDepth",
          label: "Wetting Front Depth",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = infiltrationGreenAmptDrivingHeadTool.execute;
export default infiltrationGreenAmptDrivingHeadTool;
