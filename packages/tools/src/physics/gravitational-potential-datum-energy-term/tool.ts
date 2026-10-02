import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly mass: number; readonly potentialShift: number };
export type Output = { readonly energyShift: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mass: { type: "number", minimum: 0 },
    potentialShift: { type: "number" },
  },
  required: ["mass", "potentialShift"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { energyShift: { type: "number" } },
  required: ["energyShift"],
} as const;
/** Calculate gravitational potential datum energy term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mass, potentialShift } = request;
  const compute = (): Output => {
    H.domain(mass >= 0);
    return { energyShift: mass * potentialShift };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { mass: 3, potentialShift: 20 },
  output: { energyShift: 60 },
} satisfies ToolExample<Input, Output>;
export const gravitationalPotentialDatumEnergyTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "physics/gravitational-potential-datum-energy-term",
      title: "Gravitational Potential Datum Energy Term Tool",
      description:
        "Calculate gravitational potential datum energy term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          mass: { type: "number", minimum: 0 },
          potentialShift: { type: "number" },
        },
        required: ["mass", "potentialShift"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { energyShift: { type: "number" } },
        required: ["energyShift"],
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
            id: "potentialShift",
            label: "Potential Shift",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "energyShift",
            label: "Energy Shift",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = gravitationalPotentialDatumEnergyTermTool.execute;
export default gravitationalPotentialDatumEnergyTermTool;
