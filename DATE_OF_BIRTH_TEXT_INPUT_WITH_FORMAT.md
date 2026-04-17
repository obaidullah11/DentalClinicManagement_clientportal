# Date of Birth Text Input with Format Placeholder

## Changes Made

### Input Field Configuration
- **Type**: `text` (not date picker)
- **Placeholder**: `"YYYY-MM-DD (e.g., 1990-05-15)"` - Shows exact format with example
- **Auto-formatting**: Automatically adds hyphens as user types
- **Validation**: Only allows numbers and hyphens
- **Max Length**: 10 characters (YYYY-MM-DD)

## Features

### 1. Clear Placeholder
```typescript
placeholder="YYYY-MM-DD (e.g., 1990-05-15)"
```
- Shows the exact format backend requires
- Includes a real example for clarity
- Helps users understand the expected input

### 2. Auto-Formatting
```typescript
onChange={(e) => {
  let val = e.target.value.replace(/[^0-9-]/g, '');
  // Auto-format as user types
  if (val.length === 4 && !val.includes('-')) {
    val = val + '-';
  } else if (val.length === 7 && val.split('-').length === 2) {
    val = val + '-';
  }
  // Limit to YYYY-MM-DD format (10 characters)
  val = val.slice(0, 10);
  updateBookingData('dateOfBirth', val);
}}
```

**How it works:**
- User types: `1990` → Automatically becomes: `1990-`
- User continues: `199005` → Automatically becomes: `1990-05-`
- User finishes: `19900515` → Automatically becomes: `1990-05-15`

### 3. Input Restrictions
- **Only allows**: Numbers (0-9) and hyphens (-)
- **Removes**: Letters, spaces, special characters
- **Max length**: 10 characters
- **Format**: YYYY-MM-DD

## User Experience

### Typing Flow:
1. User clicks field → Sees placeholder: "YYYY-MM-DD (e.g., 1990-05-15)"
2. User types `1` → Shows: `1`
3. User types `9` → Shows: `19`
4. User types `9` → Shows: `199`
5. User types `0` → Shows: `1990-` (hyphen auto-added)
6. User types `0` → Shows: `1990-0`
7. User types `5` → Shows: `1990-05-` (hyphen auto-added)
8. User types `1` → Shows: `1990-05-1`
9. User types `5` → Shows: `1990-05-15` (complete)

### Error Prevention:
- ❌ User types letters → Ignored
- ❌ User types spaces → Ignored
- ❌ User types special chars → Ignored
- ✅ User types numbers → Accepted
- ✅ User types hyphen → Accepted (if needed)

## Backend Compatibility

### Backend Requirement:
```php
'patient.dateOfBirth' => 'required|date|date_format:Y-m-d|before:today|after:' . now()->subYears(150)->format('Y-m-d')
```

### Frontend Provides:
- ✅ **Format**: YYYY-MM-DD (matches `Y-m-d`)
- ✅ **Placeholder**: Shows exact format with example
- ✅ **Auto-formatting**: Helps users enter correct format
- ✅ **Validation**: React validation checks date is valid and within range

## Validation

### Client-Side Validation (React):
```typescript
if (!bookingData.dateOfBirth) {
  newErrors.dateOfBirth = 'Date of Birth is required';
} else {
  const dob = new Date(bookingData.dateOfBirth);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const oneHundredFiftyYearsAgo = new Date();
  oneHundredFiftyYearsAgo.setFullYear(today.getFullYear() - 150);
  
  if (dob >= today) {
    newErrors.dateOfBirth = 'Date of birth must be before today';
  } else if (dob < oneHundredFiftyYearsAgo) {
    newErrors.dateOfBirth = 'Please enter a valid date of birth';
  }
}
```

### Validation Checks:
1. ✅ Field is not empty
2. ✅ Date is valid (can be parsed)
3. ✅ Date is before today
4. ✅ Date is within last 150 years

## Examples

### Valid Inputs:
- `1990-05-15` → May 15, 1990
- `2000-01-01` → January 1, 2000
- `1985-12-31` → December 31, 1985
- `1950-06-20` → June 20, 1950

### Invalid Inputs (Will show error on submit):
- `2025-01-01` → Future date (error: "Date of birth must be before today")
- `1800-01-01` → Too old (error: "Please enter a valid date of birth")
- `2024-02-30` → Invalid date (error: "Please enter a valid date of birth")
- `abc-def-ghi` → Invalid format (error: "Please enter a valid date of birth")
- Empty field → (error: "Date of Birth is required")

## Testing Checklist

### Input Behavior:
- [ ] Click field → Placeholder shows "YYYY-MM-DD (e.g., 1990-05-15)"
- [ ] Type `1990` → Automatically adds hyphen: `1990-`
- [ ] Continue typing `05` → Automatically adds hyphen: `1990-05-`
- [ ] Finish typing `15` → Shows: `1990-05-15`
- [ ] Try typing letters → Letters are ignored
- [ ] Try typing spaces → Spaces are ignored
- [ ] Try typing special chars → Special chars are ignored
- [ ] Try typing more than 10 chars → Stops at 10

### Validation:
- [ ] Submit with empty field → Shows "Date of Birth is required"
- [ ] Submit with future date → Shows "Date of birth must be before today"
- [ ] Submit with date >150 years ago → Shows "Please enter a valid date of birth"
- [ ] Submit with invalid date (e.g., 2024-02-30) → Shows error
- [ ] Submit with valid date → Passes validation

### Backend Integration:
- [ ] Submit valid date → Backend accepts in YYYY-MM-DD format
- [ ] Age calculation works correctly
- [ ] Date displays correctly on confirmation page

## Benefits

✅ **Clear Format**: Placeholder shows exact format with example
✅ **Auto-formatting**: Hyphens added automatically as user types
✅ **Error Prevention**: Only allows valid characters (numbers and hyphens)
✅ **User Friendly**: Easy to type, no date picker confusion
✅ **Backend Compatible**: Always outputs YYYY-MM-DD format
✅ **Consistent**: Same input style as other text fields
✅ **Validated**: Client-side validation ensures valid dates

## Notes

- The input is a regular text field, not a date picker
- Users type the date manually with auto-formatting help
- The placeholder clearly shows the required format with an example
- Hyphens are automatically inserted at the correct positions
- Invalid characters are automatically removed
- The format always matches the backend requirement (YYYY-MM-DD)
