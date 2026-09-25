import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly toothIds: readonly string[];
  readonly sitesPerTooth: readonly number[];
  readonly excludedToothIds: readonly string[];
};
export type Output = {
  readonly countedSites: number;
  readonly countedTeeth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    toothIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    sitesPerTooth: { type: "array", maxItems: 256, items: { type: "integer" } },
    excludedToothIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["toothIds", "sitesPerTooth", "excludedToothIds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    countedSites: { type: "integer" },
    countedTeeth: { type: "integer" },
  },
  required: ["countedSites", "countedTeeth"],
} as const;
/** Count supplied chart-site inventory without selecting a periodontal scoring protocol. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { toothIds, sitesPerTooth, excludedToothIds } = request;
  const compute = (): Output => {
    H.sameLength(toothIds, sitesPerTooth);
    H.domain(
      new Set(toothIds).size === toothIds.length &&
        sitesPerTooth.every((x) => x >= 0),
    );
    return {
      countedSites: sitesPerTooth.reduce(
        (a, b, i) => a + (excludedToothIds.includes(toothIds[i]) ? 0 : b),
        0,
      ),
      countedTeeth: toothIds.filter((x) => !excludedToothIds.includes(x))
        .length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    toothIds: ["T1", "T2", "T3"],
    sitesPerTooth: [6, 6, 4],
    excludedToothIds: ["T2"],
  },
  output: { countedSites: 10, countedTeeth: 2 },
} satisfies ToolExample<Input, Output>;
export const periodontalChartSiteCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dental-hygiene/periodontal-chart-site-count",
    title: "Periodontal Chart Site Count Tool",
    description:
      "Count supplied chart-site inventory without selecting a periodontal scoring protocol.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        toothIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        sitesPerTooth: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        excludedToothIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["toothIds", "sitesPerTooth", "excludedToothIds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        countedSites: { type: "integer" },
        countedTeeth: { type: "integer" },
      },
      required: ["countedSites", "countedTeeth"],
    },
    ports: {
      inputs: [
        {
          id: "toothIds",
          label: "Tooth Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "sitesPerTooth",
          label: "Sites Per Tooth",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "excludedToothIds",
          label: "Excluded Tooth Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "countedSites",
          label: "Counted Sites",
          valueType: { type: "integer" },
        },
        {
          id: "countedTeeth",
          label: "Counted Teeth",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = periodontalChartSiteCountTool.execute;
export default periodontalChartSiteCountTool;
