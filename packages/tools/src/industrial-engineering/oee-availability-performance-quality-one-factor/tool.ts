import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly plannedMinutes: number;
  readonly runMinutes: number;
  readonly totalUnits: number;
  readonly goodUnits: number;
  readonly idealCycleMinutes: number;
};
export type Output = {
  readonly availability: number;
  readonly performance: number;
  readonly quality: number;
  readonly oee: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plannedMinutes: { type: "number", exclusiveMinimum: 0 },
    runMinutes: { type: "number", exclusiveMinimum: 0 },
    totalUnits: { type: "integer", minimum: 1 },
    goodUnits: { type: "integer", minimum: 0 },
    idealCycleMinutes: { type: "number", minimum: 0 },
  },
  required: [
    "plannedMinutes",
    "runMinutes",
    "totalUnits",
    "goodUnits",
    "idealCycleMinutes",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availability: { type: "number" },
    performance: { type: "number" },
    quality: { type: "number" },
    oee: { type: "number" },
  },
  required: ["availability", "performance", "quality", "oee"],
} as const;
/** OEE factorization with explicit ideal cycle time; performance above one remains visible if the supplied ideal cycle is inconsistent. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    plannedMinutes,
    runMinutes,
    totalUnits,
    goodUnits,
    idealCycleMinutes,
  } = request;
  const compute = (): Output => {
    H.positive(plannedMinutes);
    H.positive(runMinutes);
    H.domain(runMinutes <= plannedMinutes && idealCycleMinutes >= 0);
    H.integer(totalUnits, 1);
    H.integer(goodUnits, 0, totalUnits);
    return {
      availability: runMinutes / plannedMinutes,
      performance: (idealCycleMinutes * totalUnits) / runMinutes,
      quality: goodUnits / totalUnits,
      oee: (idealCycleMinutes * goodUnits) / plannedMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    plannedMinutes: 480,
    runMinutes: 400,
    totalUnits: 1000,
    goodUnits: 950,
    idealCycleMinutes: 0.3,
  },
  output: {
    availability: 0.8333333333333334,
    performance: 0.75,
    quality: 0.95,
    oee: 0.59375,
  },
} satisfies ToolExample<Input, Output>;
export const oeeAvailabilityPerformanceQualityOneFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "industrial-engineering/oee-availability-performance-quality-one-factor",
      title: "OEE Availability Performance Quality One Factor Tool",
      description:
        "OEE factorization with explicit ideal cycle time; performance above one remains visible if the supplied ideal cycle is inconsistent.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          plannedMinutes: { type: "number", exclusiveMinimum: 0 },
          runMinutes: { type: "number", exclusiveMinimum: 0 },
          totalUnits: { type: "integer", minimum: 1 },
          goodUnits: { type: "integer", minimum: 0 },
          idealCycleMinutes: { type: "number", minimum: 0 },
        },
        required: [
          "plannedMinutes",
          "runMinutes",
          "totalUnits",
          "goodUnits",
          "idealCycleMinutes",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          availability: { type: "number" },
          performance: { type: "number" },
          quality: { type: "number" },
          oee: { type: "number" },
        },
        required: ["availability", "performance", "quality", "oee"],
      },
      ports: {
        inputs: [
          {
            id: "plannedMinutes",
            label: "Planned Minutes",
            required: true,
            valueType: { type: "number", unit: "min" },
          },
          {
            id: "runMinutes",
            label: "Run Minutes",
            required: true,
            valueType: { type: "number", unit: "min" },
          },
          {
            id: "totalUnits",
            label: "Total Units",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "goodUnits",
            label: "Good Units",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "idealCycleMinutes",
            label: "Ideal Cycle Minutes",
            required: true,
            valueType: { type: "number", unit: "min" },
          },
        ],
        outputs: [
          {
            id: "availability",
            label: "Availability",
            valueType: { type: "number" },
          },
          {
            id: "performance",
            label: "Performance",
            valueType: { type: "number" },
          },
          { id: "quality", label: "Quality", valueType: { type: "number" } },
          { id: "oee", label: "Oee", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = oeeAvailabilityPerformanceQualityOneFactorTool.execute;
export default oeeAvailabilityPerformanceQualityOneFactorTool;
