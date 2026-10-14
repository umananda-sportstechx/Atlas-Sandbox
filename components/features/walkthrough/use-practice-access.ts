'use client';

import { getRealUserType, useUserProfile } from '@/hooks/use-user-profile';
import { isPreviewMode } from '@/lib/preview-mode';
import { usePractice } from '@/lib/sandbox/store';

/**
 * Who sees The Warm-Up. Only a real Explore account can practise, and the
 * "Try the Warm-Up" entry points are hidden while practice is already running.
 * Both stay false until the profile has loaded, so a paying user never sees a
 * flash of either. The pre-signup `/preview/*` tour has no profile to check —
 * `isPreviewMode()` grants access there instead.
 */
export function usePracticeAccess() {
	const { data: profile } = useUserProfile();
	const practice = usePractice();
	const isExplore = isPreviewMode() || (!!profile && getRealUserType(profile) === 'explore');
	return {
		/** Show "Try the Warm-Up" entry points. */
		canEnter: isExplore && !practice.active,
		/** Practice is running for this (Explore) account: show the bar / coach. */
		inPractice: isExplore && !!practice.active,
		practice,
	};
}
