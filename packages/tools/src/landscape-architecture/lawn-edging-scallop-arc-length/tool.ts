import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly radius: number;
  readonly sweepRadians: number;
  readonly scallops: number;
};
export type Output = {
  readonly oneArc: number;
  readonly totalLength: number;
  readonly chordWidth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radius: { type: "number", minimum: 0 },
    sweepRadians: { type: "number", minimum: 0 },
    scallops: { type: "integer", minimum: 0 },
  },
  required: ["radius", "sweepRadians", "scallops"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oneArc: { type: "number" },
    totalLength: { type: "number" },
    chordWidth: { type: "number" },
  },
  required: ["oneArc", "totalLength", "chordWidth"],
} as const;
/** Calculate lawn edging scallop arc length from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { radius, sweepRadians, scallops } = request;
  const compute = (): Output => {
    H.domain(radius >= 0 && sweepRadians >= 0 && sweepRadians <= 2 * Math.PI);
    H.integer(scallops, 0);
    return {
      oneArc: radius * sweepRadians,
      totalLength: radius * sweepRadians * scallops,
      chordWidth: 2 * radius * Math.sin(sweepRadians / 2),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { radius: 2, sweepRadians: 3.141592653589793, scallops: 3 },
  output: {
    oneArc: 6.283185307179586,
    totalLength: 18.84955592153876,
    chordWidth: 4,
  },
} satisfies ToolExample<Input, Output>;
export const lawnEdgingScallopArcLengthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "landscape-architecture/lawn-edging-scallop-arc-length",
    title: "Lawn Edging Scallop Arc Length Tool",
    description:
      "Calculate lawn edging scallop arc length from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        radius: { type: "number", minimum: 0 },
        sweepRadians: { type: "number", minimum: 0 },
        scallops: { type: "integer", minimum: 0 },
      },
      required: ["radius", "sweepRadians", "scallops"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oneArc: { type: "number" },
        totalLength: { type: "number" },
        chordWidth: { type: "number" },
      },
      required: ["oneArc", "totalLength", "chordWidth"],
    },
    ports: {
      inputs: [
        {
          id: "radius",
          label: "Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sweepRadians",
          label: "Sweep Radians",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scallops",
          label: "Scallops",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "oneArc", label: "One Arc", valueType: { type: "number" } },
        {
          id: "totalLength",
          label: "Total Length",
          valueType: { type: "number" },
        },
        {
          id: "chordWidth",
          label: "Chord Width",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = lawnEdgingScallopArcLengthTool.execute;
export default lawnEdgingScallopArcLengthTool;
