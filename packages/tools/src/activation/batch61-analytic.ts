import { sigmoidTool } from "./sigmoid/tool.js";
import { softplusTool } from "./softplus/tool.js";
import { tanhTool } from "./tanh/tool.js";
import { domain } from "../core/batch60-schema-calculation.js";
export const sigmoid = (x: number): number => {
  const r = sigmoidTool.execute({ x });
  domain(r.ok);
  return r.output.y;
};
export const softplus = (x: number): number => {
  const r = softplusTool.execute({ x });
  domain(r.ok);
  return r.output.y;
};
export const tanh = (x: number): number => {
  const r = tanhTool.execute({ x });
  domain(r.ok);
  return r.output.y;
};
