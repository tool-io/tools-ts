import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly vmaxMolesPerSecond: number;
  readonly enzymeMoles: number;
  readonly activeFraction: number;
};
export type Output = {
  readonly activeEnzymeMoles: number;
  readonly turnoverPerSecond: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    vmaxMolesPerSecond: { type: "number", minimum: 0 },
    enzymeMoles: { type: "number", exclusiveMinimum: 0 },
    activeFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: ["vmaxMolesPerSecond", "enzymeMoles", "activeFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activeEnzymeMoles: { type: "number" },
    turnoverPerSecond: { type: "number" },
  },
  required: ["activeEnzymeMoles", "turnoverPerSecond"],
} as const;
/** Calculate enzyme turnover molar enzyme basis from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { vmaxMolesPerSecond, enzymeMoles, activeFraction } = request;
  const compute = (): Output => {
    H.domain(
      vmaxMolesPerSecond >= 0 && activeFraction > 0 && activeFraction <= 1,
    );
    H.positive(enzymeMoles);
    return {
      activeEnzymeMoles: enzymeMoles * activeFraction,
      turnoverPerSecond: vmaxMolesPerSecond / (enzymeMoles * activeFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    vmaxMolesPerSecond: 0.000002,
    enzymeMoles: 1e-8,
    activeFraction: 0.5,
  },
  output: { activeEnzymeMoles: 5e-9, turnoverPerSecond: 400 },
} satisfies ToolExample<Input, Output>;
export const enzymeTurnoverMolarEnzymeBasisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biochemistry/enzyme-turnover-molar-enzyme-basis",
    title: "Enzyme Turnover Molar Enzyme Basis Tool",
    description:
      "Calculate enzyme turnover molar enzyme basis from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        vmaxMolesPerSecond: { type: "number", minimum: 0 },
        enzymeMoles: { type: "number", exclusiveMinimum: 0 },
        activeFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
      },
      required: ["vmaxMolesPerSecond", "enzymeMoles", "activeFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        activeEnzymeMoles: { type: "number" },
        turnoverPerSecond: { type: "number" },
      },
      required: ["activeEnzymeMoles", "turnoverPerSecond"],
    },
    ports: {
      inputs: [
        {
          id: "vmaxMolesPerSecond",
          label: "Vmax Moles Per Second",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "enzymeMoles",
          label: "Enzyme Moles",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "activeFraction",
          label: "Active Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "activeEnzymeMoles",
          label: "Active Enzyme Moles",
          valueType: { type: "number" },
        },
        {
          id: "turnoverPerSecond",
          label: "Turnover Per Second",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = enzymeTurnoverMolarEnzymeBasisTool.execute;
export default enzymeTurnoverMolarEnzymeBasisTool;
