import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly issued: number;
  readonly used: number;
  readonly returned: number;
  readonly destroyed: number;
  readonly samples: number;
};
export type Output = {
  readonly accounted: number;
  readonly missing: number;
  readonly usedShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    issued: { type: "integer", minimum: 1 },
    used: { type: "integer", minimum: 0 },
    returned: { type: "integer", minimum: 0 },
    destroyed: { type: "integer", minimum: 0 },
    samples: { type: "integer", minimum: 0 },
  },
  required: ["issued", "used", "returned", "destroyed", "samples"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    accounted: { type: "integer" },
    missing: { type: "integer" },
    usedShare: { type: "number" },
  },
  required: ["accounted", "missing", "usedShare"],
} as const;
/** Calculate gmp line clearance returned label count from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { issued, used, returned, destroyed, samples } = request;
  const compute = (): Output => {
    H.integer(issued, 1);
    H.integer(used, 0);
    H.integer(returned, 0);
    H.integer(destroyed, 0);
    H.integer(samples, 0);
    return {
      accounted: used + returned + destroyed + samples,
      missing: issued - used - returned - destroyed - samples,
      usedShare: used / issued,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { issued: 1000, used: 900, returned: 50, destroyed: 20, samples: 10 },
  output: { accounted: 980, missing: 20, usedShare: 0.9 },
} satisfies ToolExample<Input, Output>;
export const gmpLineClearanceReturnedLabelCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gmp/gmp-line-clearance-returned-label-count",
    title: "GMP Line Clearance Returned Label Count Tool",
    description:
      "Calculate gmp line clearance returned label count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        issued: { type: "integer", minimum: 1 },
        used: { type: "integer", minimum: 0 },
        returned: { type: "integer", minimum: 0 },
        destroyed: { type: "integer", minimum: 0 },
        samples: { type: "integer", minimum: 0 },
      },
      required: ["issued", "used", "returned", "destroyed", "samples"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        accounted: { type: "integer" },
        missing: { type: "integer" },
        usedShare: { type: "number" },
      },
      required: ["accounted", "missing", "usedShare"],
    },
    ports: {
      inputs: [
        {
          id: "issued",
          label: "Issued",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "used",
          label: "Used",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "returned",
          label: "Returned",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "destroyed",
          label: "Destroyed",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "samples",
          label: "Samples",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "accounted", label: "Accounted", valueType: { type: "integer" } },
        { id: "missing", label: "Missing", valueType: { type: "integer" } },
        { id: "usedShare", label: "Used Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = gmpLineClearanceReturnedLabelCountTool.execute;
export default gmpLineClearanceReturnedLabelCountTool;
