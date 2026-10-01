import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly mass: number;
  readonly transverseShift: number;
  readonly gravity: number;
};
export type Output = { readonly moment: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mass: { type: "number", minimum: 0 },
    transverseShift: { type: "number" },
    gravity: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["mass", "transverseShift", "gravity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { moment: { type: "number" } },
  required: ["moment"],
} as const;
/** Calculate transverse shift heeling moment term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mass, transverseShift, gravity } = request;
  const compute = (): Output => {
    H.domain(mass >= 0);
    H.positive(gravity);
    return { moment: mass * gravity * transverseShift };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { mass: 1000, transverseShift: 2, gravity: 9.8 },
  output: { moment: 19600 },
} satisfies ToolExample<Input, Output>;
export const transverseShiftHeelingMomentTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nautical/transverse-shift-heeling-moment-term",
    title: "Transverse Shift Heeling Moment Term Tool",
    description:
      "Calculate transverse shift heeling moment term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mass: { type: "number", minimum: 0 },
        transverseShift: { type: "number" },
        gravity: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["mass", "transverseShift", "gravity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { moment: { type: "number" } },
      required: ["moment"],
    },
    ports: {
      inputs: [
        {
          id: "mass",
          label: "Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "transverseShift",
          label: "Transverse Shift",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gravity",
          label: "Gravity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "moment", label: "Moment", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = transverseShiftHeelingMomentTermTool.execute;
export default transverseShiftHeelingMomentTermTool;
