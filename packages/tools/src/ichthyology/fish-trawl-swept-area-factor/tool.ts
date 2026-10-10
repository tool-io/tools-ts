import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly towDistance: number;
  readonly effectiveNetWidth: number;
  readonly suppliedCoverageFraction: number;
};
export type Output = { readonly sweptArea: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    towDistance: { type: "number", minimum: 0 },
    effectiveNetWidth: { type: "number", minimum: 0 },
    suppliedCoverageFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["towDistance", "effectiveNetWidth", "suppliedCoverageFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sweptArea: { type: "number" } },
  required: ["sweptArea"],
} as const;
/** Calculate nominal swept area from explicit tow geometry and a supplied coverage factor without estimating catchability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { towDistance, effectiveNetWidth, suppliedCoverageFraction } = request;
  const compute = (): Output => {
    H.domain(towDistance >= 0 && effectiveNetWidth >= 0, "towDistance");
    (H.domain(
      suppliedCoverageFraction >= 0 && suppliedCoverageFraction <= 1,
      "suppliedCoverageFraction",
    ),
      suppliedCoverageFraction);
    return {
      sweptArea: towDistance * effectiveNetWidth * suppliedCoverageFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    towDistance: 1000,
    effectiveNetWidth: 10,
    suppliedCoverageFraction: 0.8,
  },
  output: { sweptArea: 8000 },
} satisfies ToolExample<Input, Output>;
export const fishTrawlSweptAreaFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["ichthyology", "biology"],
      keywords: ["ichthyology", "biology"],
    },
    id: "ichthyology/fish-trawl-swept-area-factor",
    title: "Fish Trawl Swept Area Factor",
    description:
      "Calculate nominal swept area from explicit tow geometry and a supplied coverage factor without estimating catchability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        towDistance: { type: "number", minimum: 0 },
        effectiveNetWidth: { type: "number", minimum: 0 },
        suppliedCoverageFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "towDistance",
        "effectiveNetWidth",
        "suppliedCoverageFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { sweptArea: { type: "number" } },
      required: ["sweptArea"],
    },
    ports: {
      inputs: [
        {
          id: "towDistance",
          label: "Tow Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "effectiveNetWidth",
          label: "Effective Net Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedCoverageFraction",
          label: "Supplied Coverage Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "sweptArea", label: "Swept Area", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = fishTrawlSweptAreaFactorTool.execute;
export default fishTrawlSweptAreaFactorTool;
