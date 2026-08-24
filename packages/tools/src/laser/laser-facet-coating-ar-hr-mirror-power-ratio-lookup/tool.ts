import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FacetCoatingMode = "coatings" | "cleaved-gaas";

export type FacetCoatingSplitInput = {
  readonly mode: FacetCoatingMode;
  readonly rearReflectivityPercent?: number;
  readonly frontReflectivityPercent?: number;
  readonly refractiveIndex?: number;
};

export type FacetCoatingSplitOutput = {
  readonly frontReflectivityUsedPercent: number;
  readonly rearReflectivityUsedPercent: number;
  readonly frontOutputFractionPercent: number;
  readonly rearOutputFractionPercent: number;
};

const cleavedReflectivityPercent = (refractiveIndex: number): number =>
  ((refractiveIndex - 1) / (refractiveIndex + 1)) ** 2 * 100;

export const splitFacetPower = (
  input: FacetCoatingSplitInput,
): FacetCoatingSplitOutput => {
  let rear = input.rearReflectivityPercent ?? 98;
  let front = input.frontReflectivityPercent ?? 5;
  if (input.mode === "cleaved-gaas") {
    const n = input.refractiveIndex ?? 3.53;
    if (n <= 1)
      simpleError(
        "refractiveIndex",
        "Refractive index must exceed that of air.",
      );
    const r = cleavedReflectivityPercent(n);
    rear = r;
    front = r;
  }
  if (rear < 0 || rear > 100)
    simpleError(
      "rearReflectivityPercent",
      "Rear reflectivity must be between zero and 100 percent.",
    );
  if (front < 0 || front > 100)
    simpleError(
      "frontReflectivityPercent",
      "Front reflectivity must be between zero and 100 percent.",
    );
  const transmissionFront = (100 - front) / 100;
  const transmissionRear = (100 - rear) / 100;
  const total = transmissionFront + transmissionRear;
  if (total === 0)
    simpleError(
      "frontReflectivityPercent",
      "At least one facet must transmit some power.",
    );
  return {
    frontReflectivityUsedPercent: front,
    rearReflectivityUsedPercent: rear,
    frontOutputFractionPercent: (transmissionFront / total) * 100,
    rearOutputFractionPercent: (transmissionRear / total) * 100,
  };
};

export const facetCoatingSplitExample = {
  input: {
    mode: "coatings",
    rearReflectivityPercent: 98,
    frontReflectivityPercent: 5,
  },
  output: {
    frontReflectivityUsedPercent: 5,
    rearReflectivityUsedPercent: 98,
    frontOutputFractionPercent: (95 / 97) * 100,
    rearOutputFractionPercent: (2 / 97) * 100,
  },
} satisfies ToolExample<FacetCoatingSplitInput, FacetCoatingSplitOutput>;

export const facetCoatingSplitTool = createSimpleTool({
  calculate: (input) =>
    splitFacetPower({
      frontReflectivityPercent: input.frontReflectivityPercent as number,
      mode: input.mode as FacetCoatingMode,
      rearReflectivityPercent: input.rearReflectivityPercent as number,
      refractiveIndex: input.refractiveIndex as number,
    }),
  description:
    "Split the internal laser power between the two facets from their reflectivities, either coated or a bare cleaved GaAs facet.",
  id: "laser/laser-facet-coating-ar-hr-mirror-power-ratio-lookup",
  inputs: [
    {
      description: "Use explicit coating values or an uncoated GaAs facet.",
      enum: ["coatings", "cleaved-gaas"],
      id: "mode",
      kind: "string",
      label: "Mode",
    },
    {
      default: 98,
      description: "HR-coated rear facet reflectivity.",
      id: "rearReflectivityPercent",
      kind: "number",
      label: "R_rear",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      default: 5,
      description: "AR-coated front facet reflectivity.",
      id: "frontReflectivityPercent",
      kind: "number",
      label: "R_front",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      default: 3.53,
      description: "Refractive index for the uncoated GaAs cleave.",
      id: "refractiveIndex",
      kind: "number",
      label: "n",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Reflectivity used at the front facet.",
      id: "frontReflectivityUsedPercent",
      kind: "number",
      label: "R_front used",
      unit: "%",
    },
    {
      description: "Reflectivity used at the rear facet.",
      id: "rearReflectivityUsedPercent",
      kind: "number",
      label: "R_rear used",
      unit: "%",
    },
    {
      description: "Share of internal power exiting the front facet.",
      id: "frontOutputFractionPercent",
      kind: "number",
      label: "Front share",
      unit: "%",
    },
    {
      description: "Share of internal power exiting the rear facet.",
      id: "rearOutputFractionPercent",
      kind: "number",
      label: "Rear share",
      unit: "%",
    },
  ],
  title: "Facet Coating Power Split",
});
export const runFacetCoatingSplit = facetCoatingSplitTool.execute;
export default facetCoatingSplitTool;

export { facetCoatingSplitExample as example };
