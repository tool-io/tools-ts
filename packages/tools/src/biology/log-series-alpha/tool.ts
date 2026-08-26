import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const logSeriesAlphaProxyExample = {
  input: { speciesCountInt: 10, totalIndividualsInt: 99 },
  output: { logSeriesAlphaProxy: 2.1714724095162588 },
} satisfies ToolExample<
  { readonly speciesCountInt: number; readonly totalIndividualsInt: number },
  { readonly logSeriesAlphaProxy: number }
>;

export const logSeriesAlphaProxyTool = createSimpleTool({
  id: "biology/log-series-alpha",
  title: "Log Series Alpha Proxy",
  description:
    "Compute a documented Fisher-lite proxy for the log-series alpha parameter as species count divided by the natural logarithm of total individuals plus one.",
  inputs: [
    {
      id: "speciesCountInt",
      label: "Species count S",
      kind: "integer",
      minimum: 1,
    },
    {
      id: "totalIndividualsInt",
      label: "Total individuals N",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "logSeriesAlphaProxy",
      label: "Log-series alpha proxy",
      kind: "number",
    },
  ],
  calculate: (input) => ({
    logSeriesAlphaProxy:
      (input.speciesCountInt as number) /
      Math.log((input.totalIndividualsInt as number) + 1),
  }),
});
export const runLogSeriesAlphaProxy = logSeriesAlphaProxyTool.execute;
export default logSeriesAlphaProxyTool;
