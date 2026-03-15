# Patient Type Selection Layout Review - Tasks

## Phase 1: Restore Responsive Layout (CRITICAL)

- [ ] 1.1 Restore responsive container structure
  - Replace fixed-width container with responsive flex layout
  - Match the pattern used in DateTimeSelection component
  - Add proper padding and max-width constraints
  
- [ ] 1.2 Restore mobile ClinicInfo section
  - Add mobile-only ClinicInfo section above form content
  - Use `lg:hidden` class to hide on desktop
  - Add proper spacing (mb-6)

- [ ] 1.3 Update form container to be responsive
  - Change from `w-[673px]` to `flex-1 lg:pr-8 flex flex-col max-w-[673px]`
  - Ensure proper flex behavior on mobile and desktop
  
- [ ] 1.4 Fix desktop ClinicInfo positioning
  - Add `hidden lg:block` classes
  - Restore proper margin and positioning (`ml-16 mt-32`)
  - Remove fixed gap-[267px] approach

- [ ] 1.5 Update title section for responsiveness
  - Change from `text-[24px]` to `text-xl lg:text-2xl`
  - Update margins from `mb-[78px]` to `mb-6 lg:mb-8`
  - Wrap in proper container with `flex-shrink-0`

- [ ] 1.6 Make patient type section responsive
  - Wrap in container with `mb-6 lg:mb-8 flex-shrink-0`
  - Consider full-width buttons on mobile: `w-full sm:w-[157px]`
  - Test button layout on small screens

- [ ] 1.7 Make reason for visit section scrollable
  - Wrap in `flex-1 overflow-y-auto` container
  - Ensure buttons wrap properly on all screen sizes
  - Test with long procedure lists

- [ ] 1.8 Update confirm button section
  - Wrap in `flex-shrink-0 pt-4 pb-8 flex justify-center`
  - Consider responsive button width: `w-full sm:w-[256px]`
  - Ensure proper spacing from form content

## Phase 2: Normalize Spacing (HIGH)

- [ ] 2.1 Review spacing values with design team
  - Verify if pt-[118px], mb-[78px], mb-[53px], mb-[83px] are from Figma
  - Document the source of these values
  - Get approval for any changes

- [ ] 2.2 Map custom spacing to Tailwind scale (if approved)
  - Replace `pt-[118px]` with standard value or document reason
  - Replace `mb-[78px]` with `mb-16 lg:mb-20` or keep if from design
  - Replace `mb-[53px]` with `mb-12 lg:mb-14` or keep if from design
  - Replace `mb-[83px]` with `mb-20 lg:mb-24` or keep if from design

- [ ] 2.3 Create design tokens file (if custom values are intentional)
  - Create `src/design-tokens/spacing.ts`
  - Export spacing constants
  - Document usage in component

- [ ] 2.4 Add responsive spacing variants
  - Ensure spacing adapts appropriately on mobile
  - Test spacing at different breakpoints
  - Verify visual hierarchy is maintained

## Phase 3: Improve Button Responsiveness (MEDIUM)

- [ ] 3.1 Standardize button heights
  - Decide on 58px or 55px as standard
  - Update all buttons to use consistent height
  - Update input field to match button height

- [ ] 3.2 Make patient type buttons responsive
  - Add responsive width classes: `w-full sm:w-[157px]`
  - Test on mobile devices
  - Ensure proper gap between buttons on mobile

- [ ] 3.3 Make reason buttons responsive
  - Ensure proper wrapping on small screens
  - Test with various numbers of procedure choices
  - Verify touch targets are adequate (min 44x44px)

- [ ] 3.4 Make confirm button responsive
  - Add responsive width: `w-full sm:w-[256px]`
  - Add proper padding on mobile
  - Test button positioning on all screen sizes

- [ ] 3.5 Test touch interactions
  - Test on actual mobile devices
  - Verify all buttons are easily tappable
  - Check for accidental touches

## Phase 4: Code Quality Improvements (LOW)

- [ ] 4.1 Handle onBack prop
  - Decide: implement back button or remove prop
  - If implementing: add back button to UI
  - If removing: remove from interface and props

- [ ] 4.2 Extract magic numbers to constants
  - Create LAYOUT_CONSTANTS object
  - Create SPACING object
  - Replace hardcoded values with constants

- [ ] 4.3 Add component documentation
  - Add JSDoc comment to component
  - Document props
  - Document responsive behavior
  - Add usage examples

- [ ] 4.4 Add inline comments for complex logic
  - Comment responsive layout structure
  - Explain spacing decisions
  - Document any Figma-specific values

- [ ] 4.5 Improve code organization
  - Group related styles
  - Consider extracting button components
  - Ensure consistent formatting

## Phase 5: Accessibility Improvements (MEDIUM)

- [ ] 5.1 Add ARIA labels to button groups
  - Add role="radiogroup" to patient type section
  - Add role="radio" to patient type buttons
  - Add aria-checked attributes

- [ ] 5.2 Add ARIA labels to reason buttons
  - Add role="radiogroup" to reason section
  - Add role="radio" to reason buttons
  - Add aria-checked attributes

- [ ] 5.3 Improve error message accessibility
  - Add aria-invalid to inputs with errors
  - Add aria-describedby linking to error messages
  - Add role="alert" to error messages

- [ ] 5.4 Test keyboard navigation
  - Verify Tab order is logical
  - Test Enter/Space on all buttons
  - Consider adding arrow key navigation

- [ ] 5.5 Test with screen readers
  - Test with NVDA (Windows)
  - Test with VoiceOver (Mac/iOS)
  - Verify all content is announced correctly

- [ ] 5.6 Test with browser zoom
  - Test at 150% zoom
  - Test at 200% zoom
  - Verify no overflow or layout breaks

## Phase 6: Testing (HIGH)

- [ ] 6.1 Visual regression testing
  - Test on mobile (375px width)
  - Test on mobile (414px width)
  - Test on tablet (768px width)
  - Test on tablet (1024px width)
  - Test on desktop (1280px width)
  - Test on desktop (1440px width)
  - Test on desktop (1920px width)

- [ ] 6.2 Functional testing
  - Test patient type selection
  - Test reason for visit selection
  - Test "Others" text input
  - Test form validation
  - Test confirm button enable/disable
  - Test navigation to next page
  - Test data persistence

- [ ] 6.3 Cross-browser testing
  - Test on Chrome desktop
  - Test on Firefox
  - Test on Safari desktop
  - Test on Edge
  - Test on iOS Safari
  - Test on iOS Chrome
  - Test on Android Chrome

- [ ] 6.4 Performance testing
  - Verify no performance regressions
  - Check render times
  - Test with large procedure lists
  - Monitor re-renders

- [ ] 6.5 Accessibility testing
  - Run axe DevTools
  - Run Lighthouse accessibility audit
  - Test with keyboard only
  - Test with screen reader

## Phase 7: Documentation (LOW)

- [ ] 7.1 Update component documentation
  - Document responsive breakpoints
  - Document design system values
  - Add usage examples
  - Document props

- [ ] 7.2 Create or update design specification
  - Link to Figma file (if exists)
  - Document spacing values
  - Document color values
  - Document typography values

- [ ] 7.3 Update README or wiki
  - Document responsive design approach
  - Document testing procedures
  - Document known issues or limitations

## Phase 8: Deployment (CRITICAL)

- [ ] 8.1 Code review
  - Submit pull request
  - Address review comments
  - Get approval from team

- [ ] 8.2 User acceptance testing
  - Deploy to staging environment
  - Test with stakeholders
  - Collect feedback
  - Make necessary adjustments

- [ ] 8.3 Production deployment
  - Deploy to production
  - Monitor error rates
  - Monitor user feedback
  - Be ready to rollback if needed

- [ ] 8.4 Post-deployment monitoring
  - Monitor form completion rates
  - Track mobile vs desktop usage
  - Monitor error logs
  - Collect user feedback

## Notes

- **Priority Order**: Phase 1 (CRITICAL) should be completed first, as it fixes the broken mobile experience
- **Dependencies**: Phase 2 depends on design team input
- **Testing**: Phase 6 should be done after each phase, not just at the end
- **Rollback Plan**: Keep previous version ready in case issues arise

## Estimated Timeline

- Phase 1: 2-3 hours
- Phase 2: 1-2 hours (depends on design team availability)
- Phase 3: 1 hour
- Phase 4: 1 hour
- Phase 5: 2 hours
- Phase 6: 3-4 hours
- Phase 7: 1 hour
- Phase 8: 2 hours (plus monitoring time)

**Total**: 13-16 hours of development work
