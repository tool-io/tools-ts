import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cartons: number;
  readonly netPerCarton: number;
  readonly tarePerCarton: number;
  readonly palletTare: number;
};
export type Output = {
  readonly netMass: number;
  readonly tareMass: number;
  readonly grossMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cartons: { type: "integer", minimum: 0 },
    netPerCarton: { type: "number", minimum: 0 },
    tarePerCarton: { type: "number", minimum: 0 },
    palletTare: { type: "number", minimum: 0 },
  },
  required: ["cartons", "netPerCarton", "tarePerCarton", "palletTare"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netMass: { type: "number" },
    tareMass: { type: "number" },
    grossMass: { type: "number" },
  },
  required: ["netMass", "tareMass", "grossMass"],
} as const;
/** Calculate customs carton net gross tare from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cartons, netPerCarton, tarePerCarton, palletTare } = request;
  const compute = (): Output => {
    H.integer(cartons, 0);
    H.domain(netPerCarton >= 0 && tarePerCarton >= 0 && palletTare >= 0);
    return {
      netMass: cartons * netPerCarton,
      tareMass: cartons * tarePerCarton + palletTare,
      grossMass: cartons * (netPerCarton + tarePerCarton) + palletTare,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cartons: 10, netPerCarton: 8, tarePerCarton: 1, palletTare: 20 },
  output: { netMass: 80, tareMass: 30, grossMass: 110 },
} satisfies ToolExample<Input, Output>;
export const customsCartonNetGrossTareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "supply-chain/customs-carton-net-gross-tare",
    title: "Customs Carton Net Gross Tare Tool",
    description:
      "Calculate customs carton net gross tare from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cartons: { type: "integer", minimum: 0 },
        netPerCarton: { type: "number", minimum: 0 },
        tarePerCarton: { type: "number", minimum: 0 },
        palletTare: { type: "number", minimum: 0 },
      },
      required: ["cartons", "netPerCarton", "tarePerCarton", "palletTare"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netMass: { type: "number" },
        tareMass: { type: "number" },
        grossMass: { type: "number" },
      },
      required: ["netMass", "tareMass", "grossMass"],
    },
    ports: {
      inputs: [
        {
          id: "cartons",
          label: "Cartons",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "netPerCarton",
          label: "Net Per Carton",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tarePerCarton",
          label: "Tare Per Carton",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "palletTare",
          label: "Pallet Tare",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "netMass", label: "Net Mass", valueType: { type: "number" } },
        { id: "tareMass", label: "Tare Mass", valueType: { type: "number" } },
        { id: "grossMass", label: "Gross Mass", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = customsCartonNetGrossTareTool.execute;
export default customsCartonNetGrossTareTool;
