import type { Tier, Tour } from '@/lib/types';
import { exploreTour } from './explore';
import { raiseTour } from './raise';
import { scoutTour } from './scout';

/** One tour per tier. */
export const TOURS: Record<Tier, Tour> = {
  explore: exploreTour,
  raise: raiseTour,
  scout: scoutTour,
};
