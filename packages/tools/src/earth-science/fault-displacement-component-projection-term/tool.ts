import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly slip: number;
  readonly rakeRadians: number;
  readonly dipRadians: number;
};
export type Output = {
  readonly strikeSlip: number;
  readonly dipSlip: number;
  readonly horizontalAcrossStrike: number;
  readonly verticalDown: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    slip: { type: "number", minimum: 0 },
    rakeRadians: { type: "number" },
    dipRadians: { type: "number", minimum: 0 },
  },
  required: ["slip", "rakeRadians", "dipRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    strikeSlip: { type: "number" },
    dipSlip: { type: "number" },
    horizontalAcrossStrike: { type: "number" },
    verticalDown: { type: "number" },
  },
  required: ["strikeSlip", "dipSlip", "horizontalAcrossStrike", "verticalDown"],
} as const;
/** Rake measured from positive strike toward down-dip, dip from horizontal; components preserve the supplied slip-direction convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { slip, rakeRadians, dipRadians } = request;
  const compute = (): Output => {
    H.domain(slip >= 0 && dipRadians >= 0 && dipRadians <= Math.PI / 2);
    return {
      strikeSlip: slip * Math.cos(rakeRadians),
      dipSlip: slip * Math.sin(rakeRadians),
      horizontalAcrossStrike:
        slip * Math.sin(rakeRadians) * Math.cos(dipRadians),
      verticalDown: slip * Math.sin(rakeRadians) * Math.sin(dipRadians),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    slip: 10,
    rakeRadians: 1.5707963267948966,
    dipRadians: 0.5235987755982988,
  },
  output: {
    strikeSlip: 6.123233995736766e-16,
    dipSlip: 10,
    horizontalAcrossStrike: 8.660254037844387,
    verticalDown: 4.999999999999999,
  },
} satisfies ToolExample<Input, Output>;
export const faultDisplacementComponentProjectionTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "earth-science/fault-displacement-component-projection-term",
      title: "Fault Displacement Component Projection Term Tool",
      description:
        "Rake measured from positive strike toward down-dip, dip from horizontal; components preserve the supplied slip-direction convention.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          slip: { type: "number", minimum: 0 },
          rakeRadians: { type: "number" },
          dipRadians: { type: "number", minimum: 0 },
        },
        required: ["slip", "rakeRadians", "dipRadians"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          strikeSlip: { type: "number" },
          dipSlip: { type: "number" },
          horizontalAcrossStrike: { type: "number" },
          verticalDown: { type: "number" },
        },
        required: [
          "strikeSlip",
          "dipSlip",
          "horizontalAcrossStrike",
          "verticalDown",
        ],
      },
      ports: {
        inputs: [
          {
            id: "slip",
            label: "Slip",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "rakeRadians",
            label: "Rake Radians",
            required: true,
            valueType: { type: "number", unit: "rad" },
          },
          {
            id: "dipRadians",
            label: "Dip Radians",
            required: true,
            valueType: { type: "number", unit: "rad" },
          },
        ],
        outputs: [
          {
            id: "strikeSlip",
            label: "Strike Slip",
            valueType: { type: "number" },
          },
          { id: "dipSlip", label: "Dip Slip", valueType: { type: "number" } },
          {
            id: "horizontalAcrossStrike",
            label: "Horizontal Across Strike",
            valueType: { type: "number" },
          },
          {
            id: "verticalDown",
            label: "Vertical Down",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = faultDisplacementComponentProjectionTermTool.execute;
export default faultDisplacementComponentProjectionTermTool;
