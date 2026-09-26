import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossMass: number;
  readonly blankMass: number;
  readonly wipedArea: number;
  readonly recovery: number;
  readonly reportingArea: number;
};
export type Output = {
  readonly netMass: number;
  readonly loading: number;
  readonly reportingMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossMass: { type: "number" },
    blankMass: { type: "number" },
    wipedArea: { type: "number", exclusiveMinimum: 0 },
    recovery: { type: "number", exclusiveMinimum: 0, maximum: 1 },
    reportingArea: { type: "number", minimum: 0 },
  },
  required: [
    "grossMass",
    "blankMass",
    "wipedArea",
    "recovery",
    "reportingArea",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netMass: { type: "number" },
    loading: { type: "number" },
    reportingMass: { type: "number" },
  },
  required: ["netMass", "loading", "reportingMass"],
} as const;
/** Calculate indoor dust surface area normalizer from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossMass, blankMass, wipedArea, recovery, reportingArea } = request;
  const compute = (): Output => {
    H.positive(wipedArea);
    H.domain(recovery > 0 && recovery <= 1 && reportingArea >= 0);
    return {
      netMass: grossMass - blankMass,
      loading: (grossMass - blankMass) / (wipedArea * recovery),
      reportingMass:
        ((grossMass - blankMass) * reportingArea) / (wipedArea * recovery),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    grossMass: 12,
    blankMass: 2,
    wipedArea: 100,
    recovery: 0.8,
    reportingArea: 10,
  },
  output: { netMass: 10, loading: 0.125, reportingMass: 1.25 },
} satisfies ToolExample<Input, Output>;
export const indoorDustSurfaceAreaNormalizerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-health/indoor-dust-surface-area-normalizer",
    title: "Indoor Dust Surface Area Normalizer Tool",
    description:
      "Calculate indoor dust surface area normalizer from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossMass: { type: "number" },
        blankMass: { type: "number" },
        wipedArea: { type: "number", exclusiveMinimum: 0 },
        recovery: { type: "number", exclusiveMinimum: 0, maximum: 1 },
        reportingArea: { type: "number", minimum: 0 },
      },
      required: [
        "grossMass",
        "blankMass",
        "wipedArea",
        "recovery",
        "reportingArea",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netMass: { type: "number" },
        loading: { type: "number" },
        reportingMass: { type: "number" },
      },
      required: ["netMass", "loading", "reportingMass"],
    },
    ports: {
      inputs: [
        {
          id: "grossMass",
          label: "Gross Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "blankMass",
          label: "Blank Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wipedArea",
          label: "Wiped Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recovery",
          label: "Recovery",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reportingArea",
          label: "Reporting Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "netMass", label: "Net Mass", valueType: { type: "number" } },
        { id: "loading", label: "Loading", valueType: { type: "number" } },
        {
          id: "reportingMass",
          label: "Reporting Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = indoorDustSurfaceAreaNormalizerTool.execute;
export default indoorDustSurfaceAreaNormalizerTool;
