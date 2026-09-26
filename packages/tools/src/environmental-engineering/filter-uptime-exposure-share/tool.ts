import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly flowRates: readonly number[];
  readonly durations: readonly number[];
  readonly operating: readonly boolean[];
};
export type Output = {
  readonly possibleVolume: number;
  readonly filteredVolume: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    flowRates: { type: "array", maxItems: 256, items: { type: "number" } },
    durations: { type: "array", maxItems: 256, items: { type: "number" } },
    operating: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["flowRates", "durations", "operating"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    possibleVolume: { type: "number" },
    filteredVolume: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["possibleVolume", "filteredVolume", "share", "defined"],
} as const;
/** Calculate filter uptime exposure share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { flowRates, durations, operating } = request;
  const compute = (): Output => {
    H.sameLength(flowRates, durations);
    H.sameLength(flowRates, operating);
    H.domain([...flowRates, ...durations].every((x) => x >= 0));
    return (() => {
      const possibleVolume = flowRates.reduce(
          (s, x, i) => s + x * durations[i],
          0,
        ),
        filteredVolume = flowRates.reduce(
          (s, x, i) => s + (operating[i] ? x * durations[i] : 0),
          0,
        );
      return {
        possibleVolume,
        filteredVolume,
        share: possibleVolume > 0 ? filteredVolume / possibleVolume : 0,
        defined: possibleVolume > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { flowRates: [2, 3], durations: [5, 10], operating: [true, false] },
  output: {
    possibleVolume: 40,
    filteredVolume: 10,
    share: 0.25,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const filterUptimeExposureShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-engineering/filter-uptime-exposure-share",
    title: "Filter Uptime Exposure Share Tool",
    description:
      "Calculate filter uptime exposure share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        flowRates: { type: "array", maxItems: 256, items: { type: "number" } },
        durations: { type: "array", maxItems: 256, items: { type: "number" } },
        operating: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["flowRates", "durations", "operating"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        possibleVolume: { type: "number" },
        filteredVolume: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["possibleVolume", "filteredVolume", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "flowRates",
          label: "Flow Rates",
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
          id: "operating",
          label: "Operating",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "possibleVolume",
          label: "Possible Volume",
          valueType: { type: "number" },
        },
        {
          id: "filteredVolume",
          label: "Filtered Volume",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = filterUptimeExposureShareTool.execute;
export default filterUptimeExposureShareTool;
