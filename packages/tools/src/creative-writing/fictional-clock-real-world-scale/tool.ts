import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fictionalElapsed: number;
  readonly realUnitsPerFictionalUnit: number;
};
export type Output = { readonly realElapsed: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fictionalElapsed: { type: "number", minimum: 0 },
    realUnitsPerFictionalUnit: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["fictionalElapsed", "realUnitsPerFictionalUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { realElapsed: { type: "number" } },
  required: ["realElapsed"],
} as const;
/** Scale an elapsed fictional duration by an explicit positive real-time conversion factor. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fictionalElapsed, realUnitsPerFictionalUnit } = request;
  const compute = (): Output => {
    H.domain(fictionalElapsed >= 0, "fictionalElapsed");
    (H.domain(
      Number.isFinite(realUnitsPerFictionalUnit) &&
        realUnitsPerFictionalUnit > 0,
      "realUnitsPerFictionalUnit",
    ),
      realUnitsPerFictionalUnit);
    return { realElapsed: fictionalElapsed * realUnitsPerFictionalUnit };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fictionalElapsed: 12, realUnitsPerFictionalUnit: 2 },
  output: { realElapsed: 24 },
} satisfies ToolExample<Input, Output>;
export const fictionalClockRealWorldScaleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["creative-writing", "creative writing", "humanities"],
      keywords: ["creative writing", "humanities"],
    },
    id: "creative-writing/fictional-clock-real-world-scale",
    title: "Fictional Clock Real World Scale",
    description:
      "Scale an elapsed fictional duration by an explicit positive real-time conversion factor.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fictionalElapsed: { type: "number", minimum: 0 },
        realUnitsPerFictionalUnit: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["fictionalElapsed", "realUnitsPerFictionalUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { realElapsed: { type: "number" } },
      required: ["realElapsed"],
    },
    ports: {
      inputs: [
        {
          id: "fictionalElapsed",
          label: "Fictional Elapsed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "realUnitsPerFictionalUnit",
          label: "Real Units Per Fictional Unit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "realElapsed",
          label: "Real Elapsed",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fictionalClockRealWorldScaleTool.execute;
export default fictionalClockRealWorldScaleTool;
