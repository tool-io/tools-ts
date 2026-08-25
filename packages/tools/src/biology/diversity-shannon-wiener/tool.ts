import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const diversityShannonWienerExample = {
  input: { proportion1: 0.5, proportion2: 0.5 },
} satisfies ToolExample<{
  readonly proportion1: number;
  readonly proportion2?: number;
  readonly proportion3?: number;
  readonly proportion4?: number;
  readonly proportion5?: number;
}>;

export const diversityShannonWienerTool = createSimpleTool({
  id: "biology/diversity-shannon-wiener",
  title: "Shannon Wiener H",
  description:
    "Compute the Shannon-Wiener diversity index from up to five species proportions.",
  inputs: [
    {
      id: "proportion1",
      label: "Species 1 proportion",
      kind: "number",
      maximum: 1,
      minimum: 0,
    },
    {
      id: "proportion2",
      label: "Species 2 proportion",
      kind: "number",
      maximum: 1,
      minimum: 0,
      required: false,
    },
    {
      id: "proportion3",
      label: "Species 3 proportion",
      kind: "number",
      maximum: 1,
      minimum: 0,
      required: false,
    },
    {
      id: "proportion4",
      label: "Species 4 proportion",
      kind: "number",
      maximum: 1,
      minimum: 0,
      required: false,
    },
    {
      id: "proportion5",
      label: "Species 5 proportion",
      kind: "number",
      maximum: 1,
      minimum: 0,
      required: false,
    },
  ],
  outputs: [
    {
      id: "shannonWienerIndex",
      label: "Shannon-Wiener index",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const proportions = [
      input.proportion1 as number | undefined,
      input.proportion2 as number | undefined,
      input.proportion3 as number | undefined,
      input.proportion4 as number | undefined,
      input.proportion5 as number | undefined,
    ];
    const total = proportions.reduce(
      (sum: number, value) => sum + (value ?? 0),
      0,
    );
    if (Math.abs(total - 1) > 1e-9)
      simpleError(
        "proportion1",
        "Species proportions must sum to one.",
        "invalid_proportions",
      );
    let shannonWienerIndex = 0;
    for (const proportion of proportions) {
      if (proportion === undefined || proportion <= 0) continue;
      shannonWienerIndex -= proportion * Math.log(proportion);
    }
    return { shannonWienerIndex };
  },
});
export const runDiversityShannonWiener = diversityShannonWienerTool.execute;
export default diversityShannonWienerTool;
