# Patient Type Selection Layout Review - Requirements

## 1. Overview
Review and address critical issues introduced by the recent layout changes to the PatientTypeSelection component, which removed responsive design and introduced potential regressions.

## 2. Problem Statement
The PatientTypeSelection component was recently refactored from a responsive, mobile-friendly layout to a fixed-width desktop-only layout. This change introduces several critical issues:

### 2.1 Removed Responsive Design
- **Before**: Component used responsive Tailwind classes (`lg:`, `flex-col`, `lg:flex-row`) to adapt to different screen sizes
- **After**: Fixed widths (`w-[673px]`), fixed gaps (`gap-[267px]`), and no mobile breakpoints
- **Impact**: Component will break on mobile devices, tablets, and smaller desktop screens

### 2.2 Layout Inconsistency
- **Before**: Followed the same responsive pattern as DateTimeSelection component
- **After**: Uses completely different layout approach with fixed positioning
- **Impact**: Inconsistent user experience across booking flow pages

### 2.3 Accessibility Concerns
- Fixed `pt-[118px]` top padding assumes fixed header height
- No consideration for users who zoom or use different font sizes
- Layout will overflow on smaller viewports

### 2.4 Unused Props
- `onBack` prop is declared but never used in the component
- Creates confusion about navigation capabilities

## 3. User Stories

### 3.1 Mobile User Experience
**As a** mobile user  
**I want** to book an appointment on my phone  
**So that** I can schedule dental visits conveniently from anywhere

**Acceptance Criteria:**
- Component renders correctly on screens < 768px width
- All buttons and inputs are accessible and tappable (min 44x44px touch targets)
- Content doesn't overflow horizontally
- ClinicInfo component is visible and properly positioned on mobile
- Form validation messages are visible on small screens

### 3.2 Tablet User Experience
**As a** tablet user  
**I want** the booking interface to adapt to my screen size  
**So that** I can use the full screen real estate effectively

**Acceptance Criteria:**
- Component adapts layout between 768px and 1024px
- Buttons and form elements scale appropriately
- Gap between form and ClinicInfo adjusts based on available space
- No horizontal scrolling required

### 3.3 Desktop User Experience
**As a** desktop user  
**I want** a clean, centered layout with optimal spacing  
**So that** the booking form is easy to read and use

**Acceptance Criteria:**
- Layout is centered and doesn't stretch too wide on large screens
- Spacing between elements follows design system
- ClinicInfo is positioned consistently with other pages
- Form maintains readability at various zoom levels

### 3.4 Consistent Navigation
**As a** user navigating the booking flow  
**I want** consistent layout and behavior across all pages  
**So that** I have a predictable and smooth experience

**Acceptance Criteria:**
- PatientTypeSelection layout matches DateTimeSelection pattern
- Header positioning is consistent across pages
- ClinicInfo positioning follows same responsive rules
- Navigation buttons (back/next) are consistently placed

## 4. Technical Requirements

### 4.1 Responsive Design Restoration
- Restore mobile-first responsive design using Tailwind breakpoints
- Implement flexible widths with max-width constraints
- Use responsive gap values that adapt to screen size
- Ensure proper stacking on mobile (vertical) vs desktop (horizontal)

### 4.2 Layout Consistency
- Match the responsive pattern used in DateTimeSelection component
- Use consistent spacing values across booking flow pages
- Maintain same ClinicInfo positioning strategy (mobile vs desktop)
- Follow established design system spacing scale

### 4.3 Accessibility Compliance
- Ensure minimum touch target sizes (44x44px) on mobile
- Use relative units for spacing where appropriate
- Test with browser zoom at 200%
- Ensure keyboard navigation works correctly
- Maintain proper focus indicators

### 4.4 Code Quality
- Remove unused props or implement their functionality
- Add proper TypeScript types for all props
- Ensure component follows React best practices
- Add comments for complex layout logic

## 5. Design System Alignment

### 5.1 Spacing Scale
Review and document the spacing values used:
- `pt-[118px]` - Is this the correct header offset?
- `mb-[78px]` - Is this consistent with other pages?
- `mb-[53px]` - Should this use a standard spacing token?
- `mb-[83px]` - Should this use a standard spacing token?
- `gap-[267px]` - This seems arbitrary and too large

### 5.2 Component Dimensions
Review fixed width values:
- `w-[673px]` - Should this be a max-width instead?
- `w-[157px]` - Button width, is this from design spec?
- `h-[58px]` - Button height, is this consistent?
- `h-[55px]` - Input height, why different from buttons?

### 5.3 Typography
Verify font sizes and weights match design system:
- `text-[24px]` - Title size
- `text-[20px]` - Section heading size
- `text-[18px]` - Button text size
- `text-[14px]` - Input text size
- `text-[16px]` - Confirm button text size

## 6. Testing Requirements

### 6.1 Visual Regression Testing
- Test on mobile (375px, 414px widths)
- Test on tablet (768px, 1024px widths)
- Test on desktop (1280px, 1440px, 1920px widths)
- Test with browser zoom at 100%, 150%, 200%
- Test in portrait and landscape orientations

### 6.2 Functional Testing
- Verify all buttons are clickable on all screen sizes
- Verify form validation works correctly
- Verify navigation to next page works
- Verify data persistence across navigation
- Verify "Others" input field behavior

### 6.3 Cross-Browser Testing
- Test on Chrome, Firefox, Safari, Edge
- Test on iOS Safari and Chrome
- Test on Android Chrome
- Verify layout consistency across browsers

## 7. Performance Considerations

### 7.1 Render Performance
- Verify useMemo hooks are working correctly
- Check for unnecessary re-renders
- Ensure procedure choices update efficiently

### 7.2 Bundle Size
- No additional dependencies should be added
- Maintain current component size

## 8. Migration Strategy

### 8.1 Rollback Plan
- Keep previous responsive version in git history
- Document what was changed and why
- Provide clear rollback instructions if issues arise

### 8.2 Gradual Rollout
- Test changes in development environment first
- Conduct user acceptance testing
- Monitor error rates after deployment
- Have rollback ready if issues detected

## 9. Documentation Needs

### 9.1 Component Documentation
- Document expected props and their usage
- Document responsive breakpoints
- Document design system values used
- Add usage examples

### 9.2 Design Specification
- Create or reference Figma design file
- Document exact spacing, sizing, and color values
- Clarify responsive behavior expectations
- Define mobile vs desktop layouts

## 10. Open Questions

1. **Design Source**: Is there a Figma design file that specifies these exact pixel values?
2. **Mobile Support**: Is mobile support intentionally being dropped, or is this an oversight?
3. **Layout Pattern**: Should all booking pages follow this new fixed-width pattern, or should this page match the existing responsive pattern?
4. **Spacing Values**: Are the arbitrary spacing values (78px, 53px, 83px, 267px) from a design spec, or should they use standard spacing scale?
5. **onBack Prop**: Should the back button be implemented, or should the prop be removed?
6. **Browser Support**: What browsers and screen sizes must be supported?
7. **Accessibility Target**: What WCAG level compliance is required?

## 11. Success Criteria

The implementation will be considered successful when:
- Component works correctly on all target screen sizes (mobile, tablet, desktop)
- Layout is consistent with other pages in the booking flow
- All accessibility requirements are met
- No visual regressions are introduced
- Code follows established patterns and best practices
- All tests pass
- User acceptance testing is successful
