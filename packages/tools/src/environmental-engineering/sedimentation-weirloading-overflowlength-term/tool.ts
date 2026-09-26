import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly flowPerDay: number;
  readonly weirCount: number;
  readonly lengthPerWeir: number;
  readonly activeFraction: number;
};
export type Output = {
  readonly activeWeirLength: number;
  readonly loadingPerLength: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    flowPerDay: { type: "number", minimum: 0 },
    weirCount: { type: "integer", minimum: 1 },
    lengthPerWeir: { type: "number", exclusiveMinimum: 0 },
    activeFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: ["flowPerDay", "weirCount", "lengthPerWeir", "activeFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activeWeirLength: { type: "number" },
    loadingPerLength: { type: "number" },
  },
  required: ["activeWeirLength", "loadingPerLength"],
} as const;
/** Calculate sedimentation weirloading overflowlength term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { flowPerDay, weirCount, lengthPerWeir, activeFraction } = request;
  const compute = (): Output => {
    H.domain(flowPerDay >= 0 && activeFraction > 0 && activeFraction <= 1);
    H.integer(weirCount, 1);
    H.positive(lengthPerWeir);
    return {
      activeWeirLength: weirCount * lengthPerWeir * activeFraction,
      loadingPerLength:
        flowPerDay / (weirCount * lengthPerWeir * activeFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    flowPerDay: 1000,
    weirCount: 4,
    lengthPerWeir: 10,
    activeFraction: 0.5,
  },
  output: { activeWeirLength: 20, loadingPerLength: 50 },
} satisfies ToolExample<Input, Output>;
export const sedimentationWeirloadingOverflowlengthTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "environmental-engineering/sedimentation-weirloading-overflowlength-term",
      title: "Sedimentation Weirloading Overflowlength Term Tool",
      description:
        "Calculate sedimentation weirloading overflowlength term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          flowPerDay: { type: "number", minimum: 0 },
          weirCount: { type: "integer", minimum: 1 },
          lengthPerWeir: { type: "number", exclusiveMinimum: 0 },
          activeFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
        },
        required: [
          "flowPerDay",
          "weirCount",
          "lengthPerWeir",
          "activeFraction",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          activeWeirLength: { type: "number" },
          loadingPerLength: { type: "number" },
        },
        required: ["activeWeirLength", "loadingPerLength"],
      },
      ports: {
        inputs: [
          {
            id: "flowPerDay",
            label: "Flow Per Day",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "weirCount",
            label: "Weir Count",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "lengthPerWeir",
            label: "Length Per Weir",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "activeFraction",
            label: "Active Fraction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "activeWeirLength",
            label: "Active Weir Length",
            valueType: { type: "number" },
          },
          {
            id: "loadingPerLength",
            label: "Loading Per Length",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = sedimentationWeirloadingOverflowlengthTermTool.execute;
export default sedimentationWeirloadingOverflowlengthTermTool;
