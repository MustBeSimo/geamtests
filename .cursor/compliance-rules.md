# Mind Gleam Compliance Rules

> **Injected into every Cursor AI request.**  
> Rules below are absolute—Cursor should refuse or warn if any are violated.

---

## 1. Allowed Claims & Phrasing  
- ✅ "Based on cognitive-behavioural principles"  
- ✅ "Guided self-reflection to spot unhelpful thoughts"  
- ✅ "Track your mood trends over time"  
- ❌ Any form of "diagnose", "treat", "cure", "prevent", "clinically proven"

---

## 2. UI Requirements  
1. **Import disclaimer** on every new screen/component:  
   ```tsx
   import { DisclaimerBanner } from '@/components/DisclaimerBanner'
   // …in your JSX: <DisclaimerBanner/>
   ```

## 3. Component Header Directive
Component header directive (top of file):
```tsx
// @cursor-directive: MindGleamCompliance
// 1. No new therapeutic claims without compliance-review.
// 2. Always include <DisclaimerBanner/>.
// 3. Wrap sensitive data with collectSensitiveData<T>().
```

## 4. Data-Handling Guardrails

All health/mood inputs must use:
```tsx
collectSensitiveData<MyType>(/* … */)
```
- Mood-log consent checkbox REQUIRED before recording.
- Persist data in encrypted form (AES-256 at rest, TLS 1.3 in transit).

## 5. Privacy & Security

- **Policy baseline**: APP/GDPR compliant
- **User rights**: access, correction, deletion, export
- **Cross-border**: use SCCs or local mechanisms for exports (GDPR)
- **Retention**: purge user data 30 days after deletion

## 6. Pre-commit Checks (scripts/compliance-check.ts)

- Flag: missing header directive
- Flag: missing `<DisclaimerBanner/>` import
- Flag: banned phrases (treat, diagnose, cure, prevent, clinically proven)

## 7. CI Prompt Instruction

Default prompt for Cursor:

"Follow Mind Gleam compliance rules: no medical claims, add disclaimers, secure data."

---

Once you've saved this in `./.cursor/compliance-rules.md`, Cursor will enforce all guard-rails automatically.
