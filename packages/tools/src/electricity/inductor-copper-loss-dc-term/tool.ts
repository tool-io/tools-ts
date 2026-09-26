import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dcCurrent: number;
  readonly windingResistance: number;
};
export type Output = { readonly power: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dcCurrent: { type: "number" },
    windingResistance: { type: "number", minimum: 0 },
  },
  required: ["dcCurrent", "windingResistance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { power: { type: "number" } },
  required: ["power"],
} as const;
/** Calculate inductor copper loss dc term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dcCurrent, windingResistance } = request;
  const compute = (): Output => {
    H.domain(windingResistance >= 0);
    return { power: dcCurrent * dcCurrent * windingResistance };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dcCurrent: -3, windingResistance: 0.2 },
  output: { power: 1.8 },
} satisfies ToolExample<Input, Output>;
export const inductorCopperLossDcTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electricity/inductor-copper-loss-dc-term",
    title: "Inductor Copper Loss DC Term Tool",
    description:
      "Calculate inductor copper loss dc term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dcCurrent: { type: "number" },
        windingResistance: { type: "number", minimum: 0 },
      },
      required: ["dcCurrent", "windingResistance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { power: { type: "number" } },
      required: ["power"],
    },
    ports: {
      inputs: [
        {
          id: "dcCurrent",
          label: "Dc Current",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "windingResistance",
          label: "Winding Resistance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "power", label: "Power", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = inductorCopperLossDcTermTool.execute;
export default inductorCopperLossDcTermTool;
