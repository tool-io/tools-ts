import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly temperatureA: number;
  readonly temperatureB: number;
  readonly positiveMeansAToB: boolean;
};
export type Output = {
  readonly hotterSide: string;
  readonly hotToColdSign: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    temperatureA: { type: "number" },
    temperatureB: { type: "number" },
    positiveMeansAToB: { type: "boolean" },
  },
  required: ["temperatureA", "temperatureB", "positiveMeansAToB"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hotterSide: { type: "string", maxLength: 8192 },
    hotToColdSign: { type: "integer" },
  },
  required: ["hotterSide", "hotToColdSign"],
} as const;
/** Label an explicit hot-to-cold direction under a supplied heat-flow sign convention without calculating a transfer rate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { temperatureA, temperatureB, positiveMeansAToB } = request;
  const compute = (): Output => {
    return {
      hotterSide:
        temperatureA > temperatureB
          ? "A"
          : temperatureA < temperatureB
            ? "B"
            : "equal",
      hotToColdSign:
        temperatureA === temperatureB
          ? 0
          : temperatureA > temperatureB === positiveMeansAToB
            ? 1
            : -1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { temperatureA: 30, temperatureB: 20, positiveMeansAToB: true },
  output: { hotterSide: "A", hotToColdSign: 1 },
} satisfies ToolExample<Input, Output>;
export const heatflowSignHotColdLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["physics"],
      keywords: ["physics"],
    },
    id: "physics/heat-flow-sign-hot-cold-label",
    title: "Heat Flow Sign Hot Cold Label",
    description:
      "Label an explicit hot-to-cold direction under a supplied heat-flow sign convention without calculating a transfer rate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        temperatureA: { type: "number" },
        temperatureB: { type: "number" },
        positiveMeansAToB: { type: "boolean" },
      },
      required: ["temperatureA", "temperatureB", "positiveMeansAToB"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hotterSide: { type: "string", maxLength: 8192 },
        hotToColdSign: { type: "integer" },
      },
      required: ["hotterSide", "hotToColdSign"],
    },
    ports: {
      inputs: [
        {
          id: "temperatureA",
          label: "Temperature A",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "temperatureB",
          label: "Temperature B",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "positiveMeansAToB",
          label: "Positive Means ATo B",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "hotterSide",
          label: "Hotter Side",
          valueType: { type: "string" },
        },
        {
          id: "hotToColdSign",
          label: "Hot To Cold Sign",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = heatflowSignHotColdLabelTool.execute;
export default heatflowSignHotColdLabelTool;
