import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cut: number;
  readonly discarded: number;
  readonly reserved: number;
  readonly mounted: number;
};
export type Output = {
  readonly unaccounted: number;
  readonly mountedFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cut: { type: "integer", minimum: 1 },
    discarded: { type: "integer", minimum: 0 },
    reserved: { type: "integer", minimum: 0 },
    mounted: { type: "integer", minimum: 0 },
  },
  required: ["cut", "discarded", "reserved", "mounted"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unaccounted: { type: "integer" },
    mountedFraction: { type: "number" },
  },
  required: ["unaccounted", "mountedFraction"],
} as const;
/** Calculate histology mounted section count balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cut, discarded, reserved, mounted } = request;
  const compute = (): Output => {
    H.integer(cut, 1);
    H.integer(discarded, 0);
    H.integer(reserved, 0);
    H.integer(mounted, 0);
    H.domain(discarded + reserved + mounted <= cut);
    return {
      unaccounted: cut - discarded - reserved - mounted,
      mountedFraction: mounted / cut,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cut: 100, discarded: 10, reserved: 20, mounted: 65 },
  output: { unaccounted: 5, mountedFraction: 0.65 },
} satisfies ToolExample<Input, Output>;
export const histologyMountedSectionCountBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "histology/histology-mounted-section-count-balance",
      title: "Histology Mounted Section Count Balance Tool",
      description:
        "Calculate histology mounted section count balance from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          cut: { type: "integer", minimum: 1 },
          discarded: { type: "integer", minimum: 0 },
          reserved: { type: "integer", minimum: 0 },
          mounted: { type: "integer", minimum: 0 },
        },
        required: ["cut", "discarded", "reserved", "mounted"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          unaccounted: { type: "integer" },
          mountedFraction: { type: "number" },
        },
        required: ["unaccounted", "mountedFraction"],
      },
      ports: {
        inputs: [
          {
            id: "cut",
            label: "Cut",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "discarded",
            label: "Discarded",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "reserved",
            label: "Reserved",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "mounted",
            label: "Mounted",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "unaccounted",
            label: "Unaccounted",
            valueType: { type: "integer" },
          },
          {
            id: "mountedFraction",
            label: "Mounted Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = histologyMountedSectionCountBalanceTool.execute;
export default histologyMountedSectionCountBalanceTool;
