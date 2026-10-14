export type Tier = 'explore' | 'raise' | 'scout';

export const TIERS: Tier[] = ['explore', 'raise', 'scout'];
export const isTier = (v: unknown): v is Tier => v === 'explore' || v === 'raise' || v === 'scout';

/** Values the user types at `prompt` steps, read back by the mock screens. */
export type Inputs = Record<string, string>;

export interface StepPrompt {
  /** Where the typed value is stored in `inputs` so a screen can show it. */
  key: string;
  label: string;
  placeholder?: string;
  cta?: string;
}

export interface Step {
  id: string;
  /** Which mock screen the shell renders for this step. */
  screen: string;
  /** Sidebar nav key to mark active (defaults to `screen`). */
  nav?: string;
  title: string;
  body: string;
  /** `data-spot="<value>"` element to ring; clicking it also advances. */
  spotlight?: string;
  /** Turns the coach into an interactive prompt the user fills in. */
  prompt?: StepPrompt;
}

export interface Tour {
  tier: Tier;
  /** Opening card shown before step 0. */
  intro: { title: string; body: string };
  steps: Step[];
  finale: { title: string; body: string };
}

export interface ScreenProps {
  screen: string;
  inputs: Inputs;
  tier: Tier;
}
