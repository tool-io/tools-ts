import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly demands: readonly number[];
  readonly durations: readonly number[];
  readonly inPeakPeriod: readonly boolean[];
};
export type Output = {
  readonly totalDemandTime: number;
  readonly coincidentDemandTime: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    demands: { type: "array", maxItems: 256, items: { type: "number" } },
    durations: { type: "array", maxItems: 256, items: { type: "number" } },
    inPeakPeriod: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["demands", "durations", "inPeakPeriod"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalDemandTime: { type: "number" },
    coincidentDemandTime: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["totalDemandTime", "coincidentDemandTime", "share", "defined"],
} as const;
/** Calculate demand period coincidence share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { demands, durations, inPeakPeriod } = request;
  const compute = (): Output => {
    H.sameLength(demands, durations);
    H.sameLength(demands, inPeakPeriod);
    H.domain([...demands, ...durations].every((x) => x >= 0));
    return (() => {
      const totalDemandTime = demands.reduce(
          (s, x, i) => s + x * durations[i],
          0,
        ),
        coincidentDemandTime = demands.reduce(
          (s, x, i) => s + (inPeakPeriod[i] ? x * durations[i] : 0),
          0,
        );
      return {
        totalDemandTime,
        coincidentDemandTime,
        share: totalDemandTime > 0 ? coincidentDemandTime / totalDemandTime : 0,
        defined: totalDemandTime > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { demands: [2, 3], durations: [5, 10], inPeakPeriod: [true, false] },
  output: {
    totalDemandTime: 40,
    coincidentDemandTime: 10,
    share: 0.25,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const demandPeriodCoincidenceShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "energy-economics/demand-period-coincidence-share",
    title: "Demand Period Coincidence Share Tool",
    description:
      "Calculate demand period coincidence share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        demands: { type: "array", maxItems: 256, items: { type: "number" } },
        durations: { type: "array", maxItems: 256, items: { type: "number" } },
        inPeakPeriod: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["demands", "durations", "inPeakPeriod"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalDemandTime: { type: "number" },
        coincidentDemandTime: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["totalDemandTime", "coincidentDemandTime", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "demands",
          label: "Demands",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "durations",
          label: "Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "inPeakPeriod",
          label: "In Peak Period",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "totalDemandTime",
          label: "Total Demand Time",
          valueType: { type: "number" },
        },
        {
          id: "coincidentDemandTime",
          label: "Coincident Demand Time",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = demandPeriodCoincidenceShareTool.execute;
export default demandPeriodCoincidenceShareTool;
