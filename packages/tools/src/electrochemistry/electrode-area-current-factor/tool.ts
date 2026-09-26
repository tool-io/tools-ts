import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly current: number;
  readonly geometricArea: number;
  readonly suppliedActiveAreaFactor: number;
  readonly useActiveArea: boolean;
};
export type Output = {
  readonly areaBase: number;
  readonly currentDensity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    current: { type: "number" },
    geometricArea: { type: "number", exclusiveMinimum: 0 },
    suppliedActiveAreaFactor: { type: "number", exclusiveMinimum: 0 },
    useActiveArea: { type: "boolean" },
  },
  required: [
    "current",
    "geometricArea",
    "suppliedActiveAreaFactor",
    "useActiveArea",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    areaBase: { type: "number" },
    currentDensity: { type: "number" },
  },
  required: ["areaBase", "currentDensity"],
} as const;
/** Compare supplied signed current density on explicit geometric/active area bases. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { current, geometricArea, suppliedActiveAreaFactor, useActiveArea } =
    request;
  const compute = (): Output => {
    H.positive(geometricArea);
    H.positive(suppliedActiveAreaFactor);
    return {
      areaBase: geometricArea * (useActiveArea ? suppliedActiveAreaFactor : 1),
      currentDensity:
        current /
        (geometricArea * (useActiveArea ? suppliedActiveAreaFactor : 1)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    current: 10,
    geometricArea: 2,
    suppliedActiveAreaFactor: 5,
    useActiveArea: true,
  },
  output: { areaBase: 10, currentDensity: 1 },
} satisfies ToolExample<Input, Output>;
export const electrodeAreaCurrentFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electrochemistry/electrode-area-current-factor",
    title: "Electrode Area Current Factor Tool",
    description:
      "Compare supplied signed current density on explicit geometric/active area bases.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        current: { type: "number" },
        geometricArea: { type: "number", exclusiveMinimum: 0 },
        suppliedActiveAreaFactor: { type: "number", exclusiveMinimum: 0 },
        useActiveArea: { type: "boolean" },
      },
      required: [
        "current",
        "geometricArea",
        "suppliedActiveAreaFactor",
        "useActiveArea",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        areaBase: { type: "number" },
        currentDensity: { type: "number" },
      },
      required: ["areaBase", "currentDensity"],
    },
    ports: {
      inputs: [
        {
          id: "current",
          label: "Current",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "geometricArea",
          label: "Geometric Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedActiveAreaFactor",
          label: "Supplied Active Area Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "useActiveArea",
          label: "Use Active Area",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "areaBase", label: "Area Base", valueType: { type: "number" } },
        {
          id: "currentDensity",
          label: "Current Density",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = electrodeAreaCurrentFactorTool.execute;
export default electrodeAreaCurrentFactorTool;
