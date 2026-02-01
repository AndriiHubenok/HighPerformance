import { trigger, transition, style, animate, query, stagger, state } from '@angular/animations';

// Page transition animation
export const fadeInAnimation = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('300ms ease-out', style({ opacity: 1 }))
  ]),
  transition(':leave', [
    animate('200ms ease-in', style({ opacity: 0 }))
  ])
]);

// Slide in animation
export const slideInAnimation = trigger('slideIn', [
  transition(':enter', [
    style({ transform: 'translateY(20px)', opacity: 0 }),
    animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
  ]),
  transition(':leave', [
    animate('200ms ease-in', style({ transform: 'translateY(-20px)', opacity: 0 }))
  ])
]);

// Slide from right
export const slideFromRightAnimation = trigger('slideFromRight', [
  transition(':enter', [
    style({ transform: 'translateX(100%)', opacity: 0 }),
    animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
  ]),
  transition(':leave', [
    animate('200ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
  ])
]);

// Scale animation
export const scaleAnimation = trigger('scale', [
  transition(':enter', [
    style({ transform: 'scale(0.8)', opacity: 0 }),
    animate('250ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'scale(1)', opacity: 1 }))
  ]),
  transition(':leave', [
    animate('200ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'scale(0.8)', opacity: 0 }))
  ])
]);

// List stagger animation
export const listAnimation = trigger('listAnimation', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(20px)' }),
      stagger('50ms', [
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ], { optional: true })
  ])
]);

// Expand/collapse animation
export const expandAnimation = trigger('expand', [
  state('collapsed', style({ height: '0', overflow: 'hidden', opacity: 0 })),
  state('expanded', style({ height: '*', overflow: 'visible', opacity: 1 })),
  transition('collapsed <=> expanded', [
    animate('300ms cubic-bezier(0.4, 0, 0.2, 1)')
  ])
]);

// Shake animation for errors
export const shakeAnimation = trigger('shake', [
  transition('* => error', [
    animate('100ms', style({ transform: 'translateX(-10px)' })),
    animate('100ms', style({ transform: 'translateX(10px)' })),
    animate('100ms', style({ transform: 'translateX(-10px)' })),
    animate('100ms', style({ transform: 'translateX(10px)' })),
    animate('100ms', style({ transform: 'translateX(0)' }))
  ])
]);

// Pulse animation
export const pulseAnimation = trigger('pulse', [
  transition('* => pulse', [
    animate('200ms', style({ transform: 'scale(1.05)' })),
    animate('200ms', style({ transform: 'scale(1)' }))
  ])
]);

// Router animations
export const routeAnimation = trigger('routeAnimation', [
  transition('* <=> *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(20px)' })
    ], { optional: true }),
    query(':leave', [
      animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
    ], { optional: true }),
    query(':enter', [
      animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
    ], { optional: true })
  ])
]);
