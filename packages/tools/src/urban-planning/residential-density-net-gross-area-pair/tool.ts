import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly units: number;
  readonly grossArea: number;
  readonly excludedArea: number;
};
export type Output = {
  readonly netArea: number;
  readonly grossDensity: number;
  readonly netDensity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    units: { type: "integer", minimum: 0 },
    grossArea: { type: "number" },
    excludedArea: { type: "number", minimum: 0 },
  },
  required: ["units", "grossArea", "excludedArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netArea: { type: "number" },
    grossDensity: { type: "number" },
    netDensity: { type: "number" },
  },
  required: ["netArea", "grossDensity", "netDensity"],
} as const;
/** Calculate residential density net gross area pair from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { units, grossArea, excludedArea } = request;
  const compute = (): Output => {
    H.integer(units, 0);
    H.domain(excludedArea >= 0 && grossArea > excludedArea);
    return {
      netArea: grossArea - excludedArea,
      grossDensity: units / grossArea,
      netDensity: units / (grossArea - excludedArea),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { units: 100, grossArea: 5, excludedArea: 1 },
  output: { netArea: 4, grossDensity: 20, netDensity: 25 },
} satisfies ToolExample<Input, Output>;
export const residentialDensityNetGrossAreaPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-planning/residential-density-net-gross-area-pair",
    title: "Residential Density Net Gross Area Pair Tool",
    description:
      "Calculate residential density net gross area pair from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        units: { type: "integer", minimum: 0 },
        grossArea: { type: "number" },
        excludedArea: { type: "number", minimum: 0 },
      },
      required: ["units", "grossArea", "excludedArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netArea: { type: "number" },
        grossDensity: { type: "number" },
        netDensity: { type: "number" },
      },
      required: ["netArea", "grossDensity", "netDensity"],
    },
    ports: {
      inputs: [
        {
          id: "units",
          label: "Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "grossArea",
          label: "Gross Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedArea",
          label: "Excluded Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "netArea", label: "Net Area", valueType: { type: "number" } },
        {
          id: "grossDensity",
          label: "Gross Density",
          valueType: { type: "number" },
        },
        {
          id: "netDensity",
          label: "Net Density",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = residentialDensityNetGrossAreaPairTool.execute;
export default residentialDensityNetGrossAreaPairTool;
