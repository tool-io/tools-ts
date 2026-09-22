import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly vmax: number;
  readonly km: number;
  readonly inhibitor: number;
  readonly kiPrime: number;
};
export type Output = {
  readonly alphaPrime: number;
  readonly apparentVmax: number;
  readonly apparentKm: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    vmax: { type: "number", minimum: 0 },
    km: { type: "number", minimum: 0 },
    inhibitor: { type: "number", minimum: 0 },
    kiPrime: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["vmax", "km", "inhibitor", "kiPrime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    alphaPrime: { type: "number" },
    apparentVmax: { type: "number" },
    apparentKm: { type: "number" },
  },
  required: ["alphaPrime", "apparentVmax", "apparentKm"],
} as const;
/** Calculate uncompetitive apparent vmax factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { vmax, km, inhibitor, kiPrime } = request;
  const compute = (): Output => {
    H.domain(vmax >= 0 && km >= 0 && inhibitor >= 0);
    H.positive(kiPrime);
    return {
      alphaPrime: 1 + inhibitor / kiPrime,
      apparentVmax: vmax / (1 + inhibitor / kiPrime),
      apparentKm: km / (1 + inhibitor / kiPrime),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { vmax: 100, km: 10, inhibitor: 3, kiPrime: 1 },
  output: { alphaPrime: 4, apparentVmax: 25, apparentKm: 2.5 },
} satisfies ToolExample<Input, Output>;
export const uncompetitiveApparentVmaxFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biochemistry/uncompetitive-apparent-vmax-factor",
    title: "Uncompetitive Apparent Vmax Factor Tool",
    description:
      "Calculate uncompetitive apparent vmax factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        vmax: { type: "number", minimum: 0 },
        km: { type: "number", minimum: 0 },
        inhibitor: { type: "number", minimum: 0 },
        kiPrime: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["vmax", "km", "inhibitor", "kiPrime"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        alphaPrime: { type: "number" },
        apparentVmax: { type: "number" },
        apparentKm: { type: "number" },
      },
      required: ["alphaPrime", "apparentVmax", "apparentKm"],
    },
    ports: {
      inputs: [
        {
          id: "vmax",
          label: "Vmax",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "km",
          label: "Km",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inhibitor",
          label: "Inhibitor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "kiPrime",
          label: "Ki Prime",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "alphaPrime",
          label: "Alpha Prime",
          valueType: { type: "number" },
        },
        {
          id: "apparentVmax",
          label: "Apparent Vmax",
          valueType: { type: "number" },
        },
        {
          id: "apparentKm",
          label: "Apparent Km",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = uncompetitiveApparentVmaxFactorTool.execute;
export default uncompetitiveApparentVmaxFactorTool;
