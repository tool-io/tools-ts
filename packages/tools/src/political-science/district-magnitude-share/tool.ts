import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly districtSeats: number;
  readonly allSeats: number;
};
export type Output = { readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    districtSeats: { type: "integer", minimum: 0 },
    allSeats: { type: "integer", minimum: 1 },
  },
  required: ["districtSeats", "allSeats"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" } },
  required: ["share"],
} as const;
/** Calculate district magnitude share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { districtSeats, allSeats } = request;
  const compute = (): Output => {
    H.integer(allSeats, 1);
    H.integer(districtSeats, 0, allSeats);
    return { share: districtSeats / allSeats };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { districtSeats: 5, allSeats: 100 },
  output: { share: 0.05 },
} satisfies ToolExample<Input, Output>;
export const districtMagnitudeShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "political-science/district-magnitude-share",
    title: "District Magnitude Share Tool",
    description:
      "Calculate district magnitude share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        districtSeats: { type: "integer", minimum: 0 },
        allSeats: { type: "integer", minimum: 1 },
      },
      required: ["districtSeats", "allSeats"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" } },
      required: ["share"],
    },
    ports: {
      inputs: [
        {
          id: "districtSeats",
          label: "District Seats",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "allSeats",
          label: "All Seats",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "share", label: "Share", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = districtMagnitudeShareTool.execute;
export default districtMagnitudeShareTool;
