import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = {
  readonly referenceStop: number;
  readonly newResidue: string;
  readonly distance: number;
  readonly distanceKnown: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceStop: { type: "integer" },
    newResidue: { type: "string", maxLength: 8192 },
    distance: { type: "integer" },
    distanceKnown: { type: "boolean" },
  },
  required: ["referenceStop", "newResidue", "distance", "distanceKnown"],
} as const;
/** Parse a Ter-style protein stop-extension syntax subset; unknown distance is represented explicitly. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token } = request;
  const compute = (): Output => {
    const match =
      /^p\.Ter([1-9]\d*)([A-Z][a-z]{2})extTer(\?|[1-9]\d*)(?![\s\S])/.exec(
        token,
      );
    H.domain(match, "token");
    const referenceStop = Number(match[1]),
      distanceKnown = match[3] !== "?",
      distance = distanceKnown ? Number(match[3]) : 0;
    H.integer(referenceStop, 1);
    if (distanceKnown) H.integer(distance, 1);
    return { referenceStop, newResidue: match[2], distance, distanceKnown };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "p.Ter110GlnextTer17" },
  output: {
    referenceStop: 110,
    newResidue: "Gln",
    distance: 17,
    distanceKnown: true,
  },
} satisfies ToolExample<Input, Output>;
export const pharmacogeneHgvsStopExtensionTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacogenomics/pharmacogene-hgvs-stop-extension-token",
    title: "Pharmacogene Hgvs Stop Extension Token Tool",
    description:
      "Parse a Ter-style protein stop-extension syntax subset; unknown distance is represented explicitly.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceStop: { type: "integer" },
        newResidue: { type: "string", maxLength: 8192 },
        distance: { type: "integer" },
        distanceKnown: { type: "boolean" },
      },
      required: ["referenceStop", "newResidue", "distance", "distanceKnown"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "referenceStop",
          label: "Reference Stop",
          valueType: { type: "integer" },
        },
        {
          id: "newResidue",
          label: "New Residue",
          valueType: { type: "string" },
        },
        { id: "distance", label: "Distance", valueType: { type: "integer" } },
        {
          id: "distanceKnown",
          label: "Distance Known",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = pharmacogeneHgvsStopExtensionTokenTool.execute;
export default pharmacogeneHgvsStopExtensionTokenTool;
