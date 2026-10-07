import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly forceChange: number;
  readonly elapsedTime: number;
};
export type Output = { readonly loadingRate: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    forceChange: { type: "number" },
    elapsedTime: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["forceChange", "elapsedTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { loadingRate: { type: "number" } },
  required: ["loadingRate"],
} as const;
/** Divide a supplied signed single-molecule force change by positive elapsed time in matching units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { forceChange, elapsedTime } = request;
  const compute = (): Output => {
    (H.domain(Number.isFinite(elapsedTime) && elapsedTime > 0, "elapsedTime"),
      elapsedTime);
    return { loadingRate: forceChange / elapsedTime };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { forceChange: 12, elapsedTime: 3 },
  output: { loadingRate: 4 },
} satisfies ToolExample<Input, Output>;
export const singleMoleculeForceLoadingRateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biophysics", "physics"],
      keywords: ["biophysics", "physics"],
    },
    id: "biophysics/single-molecule-force-loading-rate",
    title: "Single Molecule Force Loading Rate",
    description:
      "Divide a supplied signed single-molecule force change by positive elapsed time in matching units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        forceChange: { type: "number" },
        elapsedTime: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["forceChange", "elapsedTime"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { loadingRate: { type: "number" } },
      required: ["loadingRate"],
    },
    ports: {
      inputs: [
        {
          id: "forceChange",
          label: "Force Change",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "elapsedTime",
          label: "Elapsed Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "loadingRate",
          label: "Loading Rate",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = singleMoleculeForceLoadingRateTool.execute;
export default singleMoleculeForceLoadingRateTool;
