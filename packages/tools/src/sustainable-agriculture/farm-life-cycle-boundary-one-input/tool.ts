import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inputId: string;
  readonly includedIds: readonly string[];
  readonly upstream: number;
  readonly onFarm: number;
  readonly downstream: number;
  readonly includeUpstream: boolean;
  readonly includeDownstream: boolean;
};
export type Output = {
  readonly included: boolean;
  readonly contribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inputId: { type: "string", maxLength: 8192 },
    includedIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    upstream: { type: "number" },
    onFarm: { type: "number" },
    downstream: { type: "number" },
    includeUpstream: { type: "boolean" },
    includeDownstream: { type: "boolean" },
  },
  required: [
    "inputId",
    "includedIds",
    "upstream",
    "onFarm",
    "downstream",
    "includeUpstream",
    "includeDownstream",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    included: { type: "boolean" },
    contribution: { type: "number" },
  },
  required: ["included", "contribution"],
} as const;
/** Sum one supplied inventory record under an explicit system boundary. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    inputId,
    includedIds,
    upstream,
    onFarm,
    downstream,
    includeUpstream,
    includeDownstream,
  } = request;
  const compute = (): Output => {
    const included = includedIds.includes(inputId);
    return {
      included,
      contribution: included
        ? onFarm +
          (includeUpstream ? upstream : 0) +
          (includeDownstream ? downstream : 0)
        : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    inputId: "fuel",
    includedIds: ["fuel"],
    upstream: 20,
    onFarm: 50,
    downstream: 10,
    includeUpstream: true,
    includeDownstream: false,
  },
  output: { included: true, contribution: 70 },
} satisfies ToolExample<Input, Output>;
export const farmLifeCycleBoundaryOneInputTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sustainable-agriculture/farm-life-cycle-boundary-one-input",
    title: "Farm Life Cycle Boundary One Input Tool",
    description:
      "Sum one supplied inventory record under an explicit system boundary.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inputId: { type: "string", maxLength: 8192 },
        includedIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        upstream: { type: "number" },
        onFarm: { type: "number" },
        downstream: { type: "number" },
        includeUpstream: { type: "boolean" },
        includeDownstream: { type: "boolean" },
      },
      required: [
        "inputId",
        "includedIds",
        "upstream",
        "onFarm",
        "downstream",
        "includeUpstream",
        "includeDownstream",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        included: { type: "boolean" },
        contribution: { type: "number" },
      },
      required: ["included", "contribution"],
    },
    ports: {
      inputs: [
        {
          id: "inputId",
          label: "Input Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "includedIds",
          label: "Included Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "upstream",
          label: "Upstream",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "onFarm",
          label: "On Farm",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "downstream",
          label: "Downstream",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeUpstream",
          label: "Include Upstream",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "includeDownstream",
          label: "Include Downstream",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "included", label: "Included", valueType: { type: "boolean" } },
        {
          id: "contribution",
          label: "Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = farmLifeCycleBoundaryOneInputTool.execute;
export default farmLifeCycleBoundaryOneInputTool;
