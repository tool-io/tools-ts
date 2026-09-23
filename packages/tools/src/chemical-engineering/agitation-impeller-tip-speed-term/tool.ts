import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly diameter: number;
  readonly revolutionsPerSecond: number;
};
export type Output = {
  readonly tipSpeed: number;
  readonly angularSpeed: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    diameter: { type: "number", minimum: 0 },
    revolutionsPerSecond: { type: "number", minimum: 0 },
  },
  required: ["diameter", "revolutionsPerSecond"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tipSpeed: { type: "number" },
    angularSpeed: { type: "number" },
  },
  required: ["tipSpeed", "angularSpeed"],
} as const;
/** Calculate agitation impeller tip speed term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { diameter, revolutionsPerSecond } = request;
  const compute = (): Output => {
    H.domain(diameter >= 0 && revolutionsPerSecond >= 0);
    return {
      tipSpeed: Math.PI * diameter * revolutionsPerSecond,
      angularSpeed: 2 * Math.PI * revolutionsPerSecond,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { diameter: 2, revolutionsPerSecond: 3 },
  output: { tipSpeed: 18.84955592153876, angularSpeed: 18.84955592153876 },
} satisfies ToolExample<Input, Output>;
export const agitationImpellerTipSpeedTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "chemical-engineering/agitation-impeller-tip-speed-term",
    title: "Agitation Impeller Tip Speed Term Tool",
    description:
      "Calculate agitation impeller tip speed term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        diameter: { type: "number", minimum: 0 },
        revolutionsPerSecond: { type: "number", minimum: 0 },
      },
      required: ["diameter", "revolutionsPerSecond"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tipSpeed: { type: "number" },
        angularSpeed: { type: "number" },
      },
      required: ["tipSpeed", "angularSpeed"],
    },
    ports: {
      inputs: [
        {
          id: "diameter",
          label: "Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "revolutionsPerSecond",
          label: "Revolutions Per Second",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "tipSpeed", label: "Tip Speed", valueType: { type: "number" } },
        {
          id: "angularSpeed",
          label: "Angular Speed",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = agitationImpellerTipSpeedTermTool.execute;
export default agitationImpellerTipSpeedTermTool;
