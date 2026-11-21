'use client';

import {useEffect} from 'react';
import {analyticsEventNames, trackEvent, type AnalyticsEventName} from '@/lib/analytics';

const allowedEvents = new Set<string>(analyticsEventNames);

export function AnalyticsEvents() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const trackedElement = event.target.closest<HTMLElement>('[data-track]');
      const eventName = trackedElement?.dataset.track;
      if (!eventName || !allowedEvents.has(eventName)) return;
      const label = trackedElement.dataset.trackLabel;
      trackEvent(eventName as AnalyticsEventName, label ? {label} : undefined);
    }

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
}
