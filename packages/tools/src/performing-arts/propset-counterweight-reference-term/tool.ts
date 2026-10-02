import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly loadMass: number;
  readonly loadArm: number;
  readonly counterMass: number;
  readonly counterArm: number;
  readonly gravity: number;
};
export type Output = { readonly netMoment: number; readonly balanced: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    loadMass: { type: "number", minimum: 0 },
    loadArm: { type: "number", minimum: 0 },
    counterMass: { type: "number", minimum: 0 },
    counterArm: { type: "number", minimum: 0 },
    gravity: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["loadMass", "loadArm", "counterMass", "counterArm", "gravity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { netMoment: { type: "number" }, balanced: { type: "boolean" } },
  required: ["netMoment", "balanced"],
} as const;
/** Ideal static moment comparison only; does not establish rigging suitability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { loadMass, loadArm, counterMass, counterArm, gravity } = request;
  const compute = (): Output => {
    H.domain(
      loadMass >= 0 && loadArm >= 0 && counterMass >= 0 && counterArm >= 0,
    );
    H.positive(gravity);
    return {
      netMoment: gravity * (loadMass * loadArm - counterMass * counterArm),
      balanced: loadMass * loadArm === counterMass * counterArm,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    loadMass: 10,
    loadArm: 2,
    counterMass: 20,
    counterArm: 1,
    gravity: 10,
  },
  output: { netMoment: 0, balanced: true },
} satisfies ToolExample<Input, Output>;
export const propsetCounterweightReferenceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "performing-arts/propset-counterweight-reference-term",
    title: "Propset Counterweight Reference Term Tool",
    description:
      "Ideal static moment comparison only; does not establish rigging suitability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        loadMass: { type: "number", minimum: 0 },
        loadArm: { type: "number", minimum: 0 },
        counterMass: { type: "number", minimum: 0 },
        counterArm: { type: "number", minimum: 0 },
        gravity: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["loadMass", "loadArm", "counterMass", "counterArm", "gravity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netMoment: { type: "number" },
        balanced: { type: "boolean" },
      },
      required: ["netMoment", "balanced"],
    },
    ports: {
      inputs: [
        {
          id: "loadMass",
          label: "Load Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "loadArm",
          label: "Load Arm",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "counterMass",
          label: "Counter Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "counterArm",
          label: "Counter Arm",
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
        { id: "netMoment", label: "Net Moment", valueType: { type: "number" } },
        { id: "balanced", label: "Balanced", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = propsetCounterweightReferenceTermTool.execute;
export default propsetCounterweightReferenceTermTool;
